"""Bygger web-modellen av anlegget fra CAD-eksporten.

CAD-eksporten er én sammenslått mesh (500k trekanter) uten delnavn eller
materialer, med tak, tomt, master og rør utenfor bygget. Skriptet lager en
forenklet «dukkehus»-versjon i stil med arkitektens rendring:

  1. fjerner alt utenfor byggets fotavtrykk og alt under gulvnivå
  2. kutter hele modellen i én høyde, rett over karene (ingen tak)
  3. fjerner støy (bittesmå løsrevne biter og nedovervendte undersider)
  4. deler resten i navngitte deler (gulv, vegger, detaljer, rør ...)
  5. legger inn vannflater i alle kar og i kanalbassenget

Resultatet farges i components/facility/Scene.tsx via PART_STYLES.
Koordinatene beholdes uendret, så hotspotene i lib/hotspots.ts gjelder fortsatt.

Bruk (krever trimesh, scipy, pillow):
    python3 scripts/build-model.py anlegg-raw.glb anlegg-web.glb
    gltf-transform draco anlegg-web.glb public/models/anlegg.glb

Kar-sentrene og sonene under er lest av en plantegning generert fra modellen
og gjelder bare denne eksporten.
"""
import sys
import numpy as np
import trimesh
from PIL import Image, ImageDraw
from scipy import ndimage
from scipy.spatial import ConvexHull

SRC, OUT = sys.argv[1], sys.argv[2]
CUT = float(sys.argv[3]) if len(sys.argv) > 3 else 25.6  # snitthøyde (raw y)
GROUND = 14.5          # alt helt under dette er tomt/terreng
TECH_X = 142.0         # teknisk rom: øst for denne x-verdien

S = 4                  # rasteroppløsning: piksler per enhet
W, H = 400 * S, 150 * S


def P(p):
    return ((p[0] + 200) * S, (p[2] + 75) * S)


def raster(face_idx, tri, width=None):
    img = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(img)
    for i in face_idx:
        pts = [P(p) for p in tri[i]]
        if width:
            d.line(pts + [pts[0]], fill=255, width=width)
        else:
            d.polygon(pts, fill=255)
    return np.array(img) > 0


mesh = list(trimesh.load(SRC).geometry.values())[0]

# ---------- 1. fotavtrykk: tak-flatene, største sammenhengende område ----------
tri = mesh.triangles
fn = mesh.face_normals
yc = tri[:, :, 1].mean(1)
roof = np.where((fn[:, 1] > 0.8) & (yc > 23.0))[0]
foot = ndimage.binary_closing(raster(roof, tri), iterations=8)
foot = ndimage.binary_fill_holes(foot)
# fjern smale utstikkere (hevede rørbruer o.l.) fra omrisset
foot = ndimage.binary_opening(foot, iterations=int(2.5 * S))
lab, n = ndimage.label(foot)
sizes = ndimage.sum(foot, lab, range(1, n + 1))
foot = lab == (np.argmax(sizes) + 1)
foot = ndimage.binary_dilation(foot, iterations=int(1.5 * S))

cx = ((tri[:, :, 0].mean(1) + 200) * S).astype(int).clip(0, W - 1)
cz = ((tri[:, :, 2].mean(1) + 75) * S).astype(int).clip(0, H - 1)
inside = foot[cz, cx]
# hele deler som stikker vesentlig ut av bygget (ytre rørledninger, master) fjernes
labels = trimesh.graph.connected_component_labels(mesh.face_adjacency, node_count=len(mesh.faces))
frac_in = np.bincount(labels, weights=inside) / np.bincount(labels)
keep = inside & (frac_in[labels] >= 0.75) & (tri[:, :, 1].max(1) > GROUND)
mesh = mesh.submesh([np.where(keep)[0]], append=True)
print("etter fotavtrykk:", len(mesh.faces))

# ---------- 2. kutt rett over karene ----------
mesh = trimesh.intersections.slice_mesh_plane(
    mesh, plane_normal=[0, -1, 0], plane_origin=[0, CUT, 0], cap=False
)
print("etter kutt:", len(mesh.faces))

# ---------- 3. støy ----------
tri = mesh.triangles
fn = mesh.face_normals
labels = trimesh.graph.connected_component_labels(mesh.face_adjacency, node_count=len(mesh.faces))
nc = labels.max() + 1
mins = np.full((nc, 3), np.inf)
maxs = np.full((nc, 3), -np.inf)
for k in range(3):
    np.minimum.at(mins[:, k], labels, tri[:, :, k].min(1))
    np.maximum.at(maxs[:, k], labels, tri[:, :, k].max(1))
ext = np.sort(maxs - mins, axis=1)
tiny = ext[:, 2] < 0.35
# himlinger og mesaniner: store vannrette flater over romhøyde (rendringen viser
# én etasje, åpen ovenfra), samt alt vannrett helt oppe ved kuttet
ceiling = (fn[:, 1] > 0.8) & (
    ((tri[:, :, 1].mean(1) > 23.5) & (mesh.area_faces > 6.0)) | (tri[:, :, 1].mean(1) > CUT - 0.6)
)
print("himlingsflater fjernet:", int(ceiling.sum()))
keep = ~tiny[labels] & (fn[:, 1] > -0.9) & ~ceiling
mesh = mesh.submesh([np.where(keep)[0]], append=True)
print("etter støyfjerning:", len(mesh.faces))

# ---------- 4. klassifisering ----------
tri = mesh.triangles
fn = mesh.face_normals
area = mesh.area_faces
F = len(mesh.faces)
yc = tri[:, :, 1].mean(1)
ymin = tri[:, :, 1].min(1)
ymax = tri[:, :, 1].max(1)
xc = tri[:, :, 0].mean(1)
cx = ((xc + 200) * S).astype(int).clip(0, W - 1)
cz = ((tri[:, :, 2].mean(1) + 75) * S).astype(int).clip(0, H - 1)
up = fn[:, 1] > 0.8
vert = np.abs(fn[:, 1]) < 0.35

# karvegger som barriere for oppfylling fra karsentrene
wall_faces = np.where(vert & (ymax > 18.0) & (ymin < 24.0) & ((ymax - ymin) > 0.4))[0]
barrier = ndimage.binary_dilation(raster(wall_faces, tri, width=2), iterations=1)
free_lab, _ = ndimage.label(~barrier)

tanks = []  # (x, z, fallback-radius, gruppe)
for x in (-92.5, -72.5, -52.0, -31.25, -11.25, 9.5, 29.5, 50.0):
    for z in (-8.0, 12.5):
        tanks.append((x, z, 9.5, "grow"))
for x in (78.75, 95.0, 112.0, 128.75):
    for z in (-5.0, 12.5):
        tanks.append((x, z, 7.6, "round"))
for x in (-169.5, -124.75):
    for z in (-26.0, -7.0):
        tanks.append((x, z, 8.5, "smolt"))
for x in (-167.75, -133.5):
    for z in (11.25, 27.25):
        tanks.append((x, z, 6.5, "smolt"))
for x in (-120.0, -108.1):
    for z in (9.8, 19.9):
        tanks.append((x, z, 4.8, "square"))

EXPECTED = {"grow": 240, "round": 120, "smolt": 100, "square": 80}
yy, xx = np.mgrid[0:H, 0:W]
pools = []
for (x, z, r, g) in tanks:
    px, pz = int((x + 200) * S), int((z + 75) * S)
    disk = (xx - px) ** 2 + (yy - pz) ** 2 <= (r * S) ** 2
    best = None
    for k in np.unique(free_lab[max(pz - 10, 0):pz + 10, max(px - 10, 0):px + 10]):
        if k == 0:
            continue
        reg = free_lab == k
        a = reg.sum() / S ** 2
        if 4 <= a <= 450 and (best is None or a > best[1]):
            best = (reg, a)
    if best is None:
        mask = disk & ~barrier
    elif best[1] < EXPECTED[g]:
        mask = best[0] | (disk & ~barrier)
    else:
        mask = best[0]
    pools.append((x, z, g, mask))

LANES = (75.5, 100.5, 22.0, 44.3)  # kanalbassenget under de runde karene (x0, x1, z0, z1)
if LANES:
    x0, x1, z0, z1 = LANES
    rect = np.zeros((H, W), bool)
    rect[int((z0 + 75) * S):int((z1 + 75) * S), int((x0 + 200) * S):int((x1 + 200) * S)] = True
    pools.append(((x0 + x1) / 2, (z0 + z1) / 2, "lanes", rect))

water_mask = np.zeros((H, W), bool)
for *_, mk in pools:
    water_mask |= mk
in_pool = water_mask[cz, cx]

# rør: avlange biter med rundt tverrsnitt
labels = trimesh.graph.connected_component_labels(mesh.face_adjacency, node_count=F)
nc = labels.max() + 1
mins = np.full((nc, 3), np.inf)
maxs = np.full((nc, 3), -np.inf)
for k in range(3):
    np.minimum.at(mins[:, k], labels, tri[:, :, k].min(1))
    np.maximum.at(maxs[:, k], labels, tri[:, :, k].max(1))
size = maxs - mins
ext = np.sort(size, axis=1)
counts = np.bincount(labels, minlength=nc)
offaxis = np.abs(fn).max(1) < 0.97
round_frac = np.bincount(labels, weights=area * offaxis, minlength=nc) / np.maximum(
    np.bincount(labels, weights=area, minlength=nc), 1e-9
)
elong = (counts >= 6) & (ext[:, 2] > 2.0) & (ext[:, 1] > 0.08) & (ext[:, 1] < 1.6) & (
    ext[:, 2] / np.maximum(ext[:, 1], 0.05) > 4
)
# rund form: flatenormalene sprer seg i et plan (to store egenverdier), mens en
# flat, skråstilt plate bare har ±n (én egenverdi)
cov = np.zeros((nc, 3, 3))
for a_ in range(3):
    for b_ in range(3):
        cov[:, a_, b_] = np.bincount(labels, weights=area * fn[:, a_] * fn[:, b_], minlength=nc)
cov /= np.maximum(np.bincount(labels, weights=area, minlength=nc), 1e-9)[:, None, None]
spread = np.linalg.eigvalsh(cov)[:, 1]  # nest største egenverdi
rounded = (round_frac > 0.45) & (spread > 0.2)
pipe = elong & rounded
# beholdere: runde, stående, grove
hmax = np.maximum(size[:, 0], size[:, 2])
vessel = rounded & (counts >= 16) & (size[:, 1] > 1.5) & (hmax <= 6.0) & (
    np.minimum(size[:, 0], size[:, 2]) > 1.0
) & (np.abs(size[:, 0] - size[:, 2]) < 0.35 * hmax)
axis = np.argmax(size, axis=1)  # 0 = langs x, 1 = stående, 2 = langs z
in_tech = ((mins[:, 0] + maxs[:, 0]) / 2) > TECH_X

pipe_color = np.full(nc, "", dtype=object)
pipe_color[pipe & in_tech & (axis == 0)] = "pipe_green"
pipe_color[pipe & in_tech & (axis == 2)] = "pipe_blue"
pipe_color[pipe & in_tech & (axis == 1)] = "pipe_yellow"
pipe_color[vessel & in_tech] = "vessel_red"
pipe_color[pipe & ~in_tech] = "pipe"

cls = np.full(F, "detail", dtype=object)
cls[vert] = "wall"
cls[up] = "floor"
cls[up & (yc > CUT - 1.2)] = "wall_top"
cls[up & in_pool & (yc < CUT - 1.0)] = "tank_floor"
pc = pipe_color[labels]
cls[pc != ""] = pc[pc != ""]

# ---------- 5. vannflater ----------
wverts, wfaces = [], []
for (x, z, g, mk) in pools:
    inner = ndimage.binary_erosion(mk, iterations=2) if g != "lanes" else mk
    pts = np.argwhere(inner)[:, ::-1].astype(float) + 0.5
    if len(pts) < 10:
        continue
    hull = pts[ConvexHull(pts).vertices]
    poly = np.column_stack([hull[:, 0] / S - 200, hull[:, 1] / S - 75])
    # vannstand: like under kanten, målt fra veggene rundt bassenget
    ring = ndimage.binary_dilation(mk, iterations=6) & ~ndimage.binary_erosion(mk, iterations=2)
    rim_faces = ring[cz, cx] & vert
    inside = mk[cz, cx] & up & (yc < CUT - 1.0)
    floor_y = np.median(yc[inside]) if inside.any() else 21.5
    rims = ymax[rim_faces & (ymin < floor_y + 1.5)]
    rim = np.percentile(rims, 90) if len(rims) > 5 else floor_y + 2.5
    wy = min(rim - 0.45, CUT - 0.6)
    print(f"  {g:7s} ({x:7.1f},{z:6.1f}) bunn {floor_y:5.1f} kant {rim:5.1f} vann {wy:5.1f}")
    c = poly.mean(0)
    base = len(wverts)
    wverts.append([c[0], wy, c[1]])
    wverts.extend([[vx, wy, vz] for (vx, vz) in poly])
    k = len(poly)
    wfaces.extend([[base, base + 1 + j, base + 1 + (j + 1) % k] for j in range(k)])
water = trimesh.Trimesh(vertices=np.array(wverts), faces=np.array(wfaces), process=False)

scene = trimesh.Scene()
for name in sorted(set(cls)):
    idx = np.where(cls == name)[0]
    scene.add_geometry(mesh.submesh([idx], append=True), geom_name=name, node_name=name)
    print(f"{name:12s} {len(idx):7d}")
scene.add_geometry(water, geom_name="water", node_name="water")
print(f"{'water':12s} {len(water.faces):7d}")
scene.export(OUT)
