"""Deler den sammenslåtte anleggsmeshen i navngitte klasser og legger til
vannflater i karene. Skriver en GLB med én mesh per klasse, som
components/facility/Scene.tsx farger via PART_STYLES.

Bruk (krever trimesh, scipy, pillow):
    python3 scripts/colorize-model.py anlegg-raw.glb anlegg-colored.glb
    gltf-transform draco anlegg-colored.glb public/models/anlegg.glb

Kar-sentrene er lest av en plantegning generert fra modellen og gjelder
bare denne eksporten. Rør er funnet som avlange biter med rundt tverrsnitt;
fargene er foreløpige til de matches mot arkitektens rendring."""
import sys, numpy as np, trimesh
from PIL import Image, ImageDraw
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
m = list(trimesh.load(src).geometry.values())[0]
tri = m.triangles; fn = m.face_normals; F = len(m.faces)
yc = tri[:,:,1].mean(1); ymin = tri[:,:,1].min(1); ymax = tri[:,:,1].max(1)
S = 4; W, H = 400*S, 150*S
def P(p): return ((p[0]+200)*S, (p[2]+75)*S)

# ---------- karvegger som barriere ----------
bar = Image.new('L', (W, H), 0); db = ImageDraw.Draw(bar)
vert = np.abs(fn[:,1]) < 0.35
wall = vert & (ymax > 18.0) & (ymin < 24.0) & ((ymax - ymin) > 0.4)
for i in np.where(wall)[0]:
    pts = [P(p) for p in tri[i]]
    db.line(pts + [pts[0]], fill=255, width=2)
barrier = ndimage.binary_dilation(np.array(bar) > 0, iterations=1)
lab, _ = ndimage.label(~barrier)

# ---------- kar-sentre lest av plantegningen (raw x, z, fallback-radius, gruppe) ----------
tanks = []
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

yy, xx = np.mgrid[0:H, 0:W]
EXPECTED = {"grow": 240, "round": 120, "smolt": 100}
tank_masks = []
for (x, z, r, g) in tanks:
    px, pz = int((x+200)*S), int((z+75)*S)
    disk = (xx - px)**2 + (yy - pz)**2 <= (r*S)**2
    cand = np.unique(lab[max(pz-10,0):pz+10, max(px-10,0):px+10])
    best = None
    for k in cand:
        if k == 0: continue
        reg = lab == k
        a = reg.sum() / S**2
        if 30 <= a <= 450:
            if best is None or a > best[1]: best = (reg, a)
    if best is None:
        mask = disk & ~barrier; how = "disk"
    elif best[1] < EXPECTED[g]:
        # karet er delt av rør/stag inni: fyll ut med sirkel rundt senteret
        mask = best[0] | (disk & ~barrier); how = "region+disk"
    else:
        mask = best[0]; how = "region"
    tank_masks.append((x, z, g, mask))
    print(g, x, z, how, round(mask.sum() / S**2))
water_mask = np.zeros((H, W), bool)
for *_, mk in tank_masks:
    water_mask |= mk

# ---------- klassifisering per flate ----------
cx = ((tri[:,:,0].mean(1) + 200) * S).astype(int).clip(0, W-1)
cz = ((tri[:,:,2].mean(1) + 75) * S).astype(int).clip(0, H-1)
in_tank = water_mask[cz, cx]
up = fn[:,1] > 0.8

# rør: avlange komponenter med rundt tverrsnitt
labels = trimesh.graph.connected_component_labels(m.face_adjacency, node_count=F)
n = labels.max() + 1
mins = np.full((n, 3), np.inf); maxs = np.full((n, 3), -np.inf)
for k in range(3):
    np.minimum.at(mins[:, k], labels, tri[:, :, k].min(1))
    np.maximum.at(maxs[:, k], labels, tri[:, :, k].max(1))
ext = np.sort(maxs - mins, axis=1)
counts = np.bincount(labels, minlength=n)
area = m.area_faces
offaxis = np.abs(fn).max(1) < 0.97
round_frac = np.bincount(labels, weights=area * offaxis, minlength=n) / np.maximum(np.bincount(labels, weights=area, minlength=n), 1e-9)
elong = (counts >= 6) & (ext[:, 2] > 2.5) & (ext[:, 1] > 0.08) & (ext[:, 1] < 1.6) & (ext[:, 2] / np.maximum(ext[:, 1], 0.05) > 4)
pipe_comp = elong & (round_frac > 0.45)
is_pipe = pipe_comp[labels]
big_pipe = is_pipe & (ext[labels, 1] >= 0.55)
small_pipe = is_pipe & ~big_pipe
print("pipe comps:", int(pipe_comp.sum()), "faces big/small:", int(big_pipe.sum()), int(small_pipe.sum()))

cls = np.full(F, "structure", dtype=object)
cls[vert] = "wall"
cls[up & (yc < 24.5)] = "floor"
cls[up & (yc >= 24.5)] = "roof"
cls[up & in_tank & (yc < 23.5)] = "tank_floor"
cls[ymax < 14.5] = "ground"
cls[big_pipe] = "pipe_large"
cls[small_pipe] = "pipe_small"

# ---------- vannflater: konveks polygon per kar, rett under kanten ----------
from scipy.spatial import ConvexHull
wverts, wfaces = [], []
for (x, z, g, mk) in tank_masks:
    inner = ndimage.binary_erosion(mk, iterations=2)
    pts = np.argwhere(inner)[:, ::-1].astype(float) + 0.5  # (px, pz)
    if len(pts) < 10: continue
    hull = pts[ConvexHull(pts).vertices]
    poly = np.column_stack([hull[:, 0] / S - 200, hull[:, 1] / S - 75])
    sel = up & (yc < 23.5)
    inside = mk[cz, cx] & sel
    floor_y = np.median(yc[inside]) if inside.any() else 21.5
    wy = min(floor_y + 2.1, 24.0)
    c = poly.mean(0)
    base = len(wverts)
    wverts.append([c[0], wy, c[1]])
    for (vx, vz) in poly:
        wverts.append([vx, wy, vz])
    k = len(poly)
    for j in range(k):
        wfaces.append([base, base + 1 + j, base + 1 + (j + 1) % k])
water = trimesh.Trimesh(vertices=np.array(wverts), faces=np.array(wfaces), process=False)
print("water faces:", len(water.faces))

scene = trimesh.Scene()
for name in ["ground", "floor", "wall", "roof", "structure", "tank_floor", "pipe_large", "pipe_small"]:
    idx = np.where(cls == name)[0]
    if len(idx) == 0: continue
    sub = m.submesh([idx], append=True)
    scene.add_geometry(sub, geom_name=name, node_name=name)
    print(f"{name:12s} {len(idx):7d} faces")
scene.add_geometry(water, geom_name="water", node_name="water")
scene.export(out)
