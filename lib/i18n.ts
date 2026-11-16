export const locales = ["no", "en", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "no";

export type HotspotId =
  | "intake"
  | "smolt"
  | "grow"
  | "filter"
  | "purge"
  | "processing"
  | "energy";

export interface HotspotText {
  title: string;
  body: string;
}

export interface Dict {
  langName: string;
  meta: { title: string; description: string };
  nav: { story: string; facility: string; sustainability: string; contact: string };
  hero: {
    kicker: string;
    title: string;
    sub: string;
    exploreCta: string;
    storyCta: string;
    scroll: string;
  };
  chapters: {
    heading: string;
    items: { num: string; title: string; body: string; alt: string }[];
  };
  welfare: {
    kicker: string;
    heading: string;
    intro: string;
    items: { title: string; body: string }[];
  };
  facility: {
    kicker: string;
    title: string;
    intro: string;
    hint: string;
    reset: string;
    loading: string;
    webglFallback: string;
    fallbackAlt: string;
    hotspotListHeading: string;
    close: string;
    canvasLabel: string;
    markerLabel: string; // "{title}" interpolated
    placeholderNote: string;
    hotspots: Record<HotspotId, HotspotText>;
  };
  specs: { heading: string; items: { value: string; label: string }[] };
  sustain: { heading: string; items: { title: string; body: string }[] };
  cta: { heading: string; body: string; button: string };
  footer: { facilityLabel: string; salesLabel: string; rights: string };
}

const no: Dict = {
  langName: "Norsk",
  meta: {
    title: "Hima Trout – sashimi-kvalitet fra Rjukan",
    description:
      "Regnbueørret av sashimi-kvalitet, oppdrettet i kaldt, morenefiltrert fjellvann i verdens største landbaserte RAS-anlegg. Utforsk anlegget i 3D.",
  },
  nav: { story: "Historien", facility: "Anlegget", sustainability: "Bærekraft", contact: "Kontakt" },
  hero: {
    kicker: "Hima Seafood · Rjukan, Telemark",
    title: "Hima Trout",
    sub: "Regnbueørret av sashimi-kvalitet fra Rjukan, oppdrettet på land i kaldt, morenefiltrert fjellvann, med fiskevelferd og bærekraft som førsteprioritet.",
    exploreCta: "Utforsk anlegget i 3D",
    storyCta: "Historien",
    scroll: "Bla nedover",
  },
  chapters: {
    heading: "Fra skyggenes dal",
    items: [
      {
        num: "01",
        title: "Fisken",
        body: "Hima Trout stammer fra Osland-stammen fra Høyanger i Sognefjorden – en av Norges eldste ørretstammer. Kaldt vann gir en mager fisk med korte muskelfibre: fast, ren og naturlig rød. Som sashimi, gravet, røkt eller stekt.",
        alt: "Hender som skjærer til en rød ørretfilet",
      },
      {
        num: "02",
        title: "Vannet",
        body: "Grunnvannet hentes fra et enormt reservoar i Vestfjorddalen, naturlig filtrert gjennom tykke morener fra høyfjellet i Telemark. Kaldt, rent og stabilt – vann som smakes i fisken.",
        alt: "Elv som renner gjennom morenelandskap, sett ovenfra",
      },
      {
        num: "03",
        title: "Stedet",
        body: "Rjukan ligger i skyggenes dal, der høye fjell gjemmer sola i fem måneder i året og en lav tåke – hima – legger seg som et kaldt vern over dalen. Her har det umulige blitt gjort før.",
        alt: "Fjell i Telemark omkranset av skyer",
      },
    ],
  },
  welfare: {
    kicker: "Fiskevelferd",
    heading: "Fisk som har det godt, smaker bedre",
    intro:
      "Hele anlegget er bygd rundt én idé: at ørreten skal ha stabile, rolige og rene forhold fra rogn til slakt. Det er god dyrevelferd, og det er grunnlaget for en premium fisk.",
    items: [
      {
        title: "Kaldt, rent vann",
        body: "Grunnvannet holder sjelden mer enn 20 grader og er naturlig filtrert gjennom morener. Kaldt vann gir rolig, jevn vekst og en fast, mager fisk.",
      },
      {
        title: "Stabile forhold",
        body: "RAS-teknologien gir full kontroll på vannkvalitet, temperatur og oksygen, hver dag, hele året. Stabilitet er den viktigste enkeltfaktoren for fiskehelse.",
      },
      {
        title: "Ingen lakselus",
        body: "Anlegget ligger på land og bruker grunnvann. Lusa kommer aldri inn, og fisken trenger aldri avlusing.",
      },
      {
        title: "Ingen rømming",
        body: "Et lukket anlegg på land betyr null rømming og null påvirkning på ville bestander.",
      },
    ],
  },
  facility: {
    kicker: "Anlegget",
    title: "Se anlegget innenfra",
    intro: "Åpenhet er en del av produktet. For deg som vil se hvordan fisken lever: trykk på punktene og fly inn i delene av RAS-anlegget, fra vanninntak til ferdig pakket fisk.",
    hint: "Dra for å rotere · rull for å zoome · to fingre for å panorere",
    reset: "Vis hele anlegget",
    loading: "Laster anlegget …",
    webglFallback: "Nettleseren din støtter ikke 3D-visning. Her er anlegget i stillbilde – forklaringene finner du under.",
    fallbackAlt: "Dalen i Rjukan der anlegget ligger",
    hotspotListHeading: "Delene av anlegget",
    close: "Lukk",
    canvasLabel: "Interaktiv 3D-modell av anlegget på Rjukan",
    markerLabel: "Vis forklaring: {title}",
    placeholderNote: "Foreløpig modell – erstattes av CAD-modellen av anlegget.",
    hotspots: {
      intake: {
        title: "Vanninntak",
        body: "Grunnvann fra Vestfjorddalen pumpes opp fra brønner rett under anlegget – naturlig filtrert gjennom morener, aldri varmere enn 20 °C.",
      },
      smolt: {
        title: "Smoltavdeling",
        body: "Her klekkes rogn fra Osland-stammen, og yngelen vokser i mindre kar til den er klar for påvekstavdelingen.",
      },
      grow: {
        title: "Påvekstkar",
        body: "I de store karene vokser ørreten i 17 måneder til en snittvekt på rundt 4 kilo – i kaldt, kontinuerlig renset vann.",
      },
      filter: {
        title: "RAS-filtrering",
        body: "Trommelfiltre og biofiltre renser og gjenbruker vannet kontinuerlig. RAS-teknologien fra EYVI gir lavt vannforbruk og full kontroll på vannkvaliteten.",
      },
      purge: {
        title: "Purge",
        body: "Før slakting står fisken i rent, kaldt vann uten fôr. Det gir en ren, frisk smak – klar for sashimi.",
      },
      processing: {
        title: "Prosessering",
        body: "Fisken slaktes og pakkes skånsomt som HOG (head-on-gutted) med 16 dagers holdbarhet – kort vei fra vann til marked.",
      },
      energy: {
        title: "Energisenter",
        body: "Anlegget gjenbruker spillvarme fra Green Mountains datasenter, og fôr og fisk transporteres med utslippsfrie hydrogenlastebiler.",
      },
    },
  },
  specs: {
    heading: "Tallene",
    items: [
      { value: "8 000", label: "tonn HOG i året" },
      { value: "~4 kg", label: "snittvekt ved slakt" },
      { value: "17", label: "måneder fra yngel til slakt" },
      { value: "16", label: "dagers holdbarhet (HOG)" },
      { value: "20 mill.", label: "middager i året" },
    ],
  },
  sustain: {
    heading: "Bærekraft uten omveier",
    items: [
      {
        title: "Resirkulert vann",
        body: "RAS-teknologien gjenbruker vannet kontinuerlig, med minimalt forbruk og regulert avfallshåndtering.",
      },
      {
        title: "Spillvarme",
        body: "Varme fra naboens datasenter varmer anlegget – energien brukes to ganger.",
      },
      {
        title: "Hydrogentransport",
        body: "Fôr inn og fisk ut går med utslippsfrie hydrogenlastebiler.",
      },
      {
        title: "Kortreist",
        body: "Produsert på land, nær markedet – ferskere fisk med mindre fotavtrykk.",
      },
    ],
  },
  cta: {
    heading: "Smak selv",
    body: "Hima Trout leveres som HOG av sashimi-kvalitet til utvalgte kunder. Ta kontakt for pris og tilgjengelighet.",
    button: "Ta kontakt",
  },
  footer: {
    facilityLabel: "Anlegg",
    salesLabel: "Salgskontor",
    rights: "Alle rettigheter forbeholdt.",
  },
};

const en: Dict = {
  langName: "English",
  meta: {
    title: "Hima Trout – sashimi grade from Rjukan",
    description:
      "Sashimi-grade rainbow trout, raised in cold, moraine-filtered mountain water in the world's largest land-based RAS facility. Explore the facility in 3D.",
  },
  nav: { story: "The story", facility: "The facility", sustainability: "Sustainability", contact: "Contact" },
  hero: {
    kicker: "Hima Seafood · Rjukan, Telemark",
    title: "Hima Trout",
    sub: "Sashimi-grade rainbow trout from Rjukan, raised on land in cold, moraine-filtered mountain water, with fish welfare and sustainability as the first priority.",
    exploreCta: "Explore the facility in 3D",
    storyCta: "The story",
    scroll: "Scroll down",
  },
  chapters: {
    heading: "From the valley of shadows",
    items: [
      {
        num: "01",
        title: "The fish",
        body: "Hima Trout descends from the Osland strain of Høyanger in the Sognefjord – one of Norway's oldest trout strains. Cold water makes a lean fish with short muscle fibres: firm, clean and naturally red. As sashimi, cured, smoked or pan-fried.",
        alt: "Hands trimming a red trout fillet",
      },
      {
        num: "02",
        title: "The water",
        body: "The groundwater is drawn from a vast reservoir in Vestfjorddalen, naturally filtered through thick moraines from the Telemark highlands. Cold, pure and stable – water you can taste in the fish.",
        alt: "River running through moraine landscape, seen from above",
      },
      {
        num: "03",
        title: "The place",
        body: "Rjukan lies in the valley of shadows, where high mountains hide the sun for five months a year and a low mist – hima – settles over the valley like a cold embrace. The impossible has been done here before.",
        alt: "Mountain in Telemark wreathed in clouds",
      },
    ],
  },
  welfare: {
    kicker: "Fish welfare",
    heading: "Fish that live well taste better",
    intro:
      "The whole facility is built around one idea: that the trout should have stable, calm and clean conditions from roe to harvest. That is good animal welfare, and it is the foundation of a premium fish.",
    items: [
      {
        title: "Cold, clean water",
        body: "The groundwater rarely exceeds 20 degrees and is naturally filtered through moraines. Cold water gives calm, even growth and a firm, lean fish.",
      },
      {
        title: "Stable conditions",
        body: "RAS technology gives full control of water quality, temperature and oxygen, every day, all year. Stability is the single most important factor for fish health.",
      },
      {
        title: "No sea lice",
        body: "The facility is on land and uses groundwater. Lice never get in, and the fish never need delousing.",
      },
      {
        title: "No escapes",
        body: "A closed facility on land means zero escapes and zero impact on wild stocks.",
      },
    ],
  },
  facility: {
    kicker: "The facility",
    title: "See inside the facility",
    intro: "Transparency is part of the product. For those who want to see how the fish actually live: tap the markers and fly into each part of the RAS facility, from water intake to packed fish.",
    hint: "Drag to rotate · scroll to zoom · two fingers to pan",
    reset: "View whole facility",
    loading: "Loading the facility …",
    webglFallback: "Your browser does not support 3D. Here is the facility as a still image – the explanations are below.",
    fallbackAlt: "The Rjukan valley where the facility lies",
    hotspotListHeading: "Parts of the facility",
    close: "Close",
    canvasLabel: "Interactive 3D model of the Rjukan facility",
    markerLabel: "Show explanation: {title}",
    placeholderNote: "Preliminary model – will be replaced by the CAD model of the facility.",
    hotspots: {
      intake: {
        title: "Water intake",
        body: "Groundwater from Vestfjorddalen is pumped from wells directly beneath the facility – naturally filtered through moraines, never warmer than 20 °C.",
      },
      smolt: {
        title: "Smolt department",
        body: "Roe from the Osland strain hatches here, and the fry grow in smaller tanks until ready for the grow-out department.",
      },
      grow: {
        title: "Grow-out tanks",
        body: "In the large tanks the trout grows for 17 months to an average weight of about 4 kilos – in cold, continuously purified water.",
      },
      filter: {
        title: "RAS filtration",
        body: "Drum filters and biofilters clean and recirculate the water continuously. The RAS technology from EYVI gives low water consumption and full control of water quality.",
      },
      purge: {
        title: "Purge",
        body: "Before harvest the fish rests in clean, cold water without feed. The result is a clean, fresh taste – ready for sashimi.",
      },
      processing: {
        title: "Processing",
        body: "The fish is gently harvested and packed as HOG (head-on-gutted) with a 16-day shelf life – a short journey from water to market.",
      },
      energy: {
        title: "Energy centre",
        body: "The facility reuses waste heat from Green Mountain's data centre, and feed and fish travel by zero-emission hydrogen trucks.",
      },
    },
  },
  specs: {
    heading: "The numbers",
    items: [
      { value: "8,000", label: "tonnes HOG per year" },
      { value: "~4 kg", label: "average harvest weight" },
      { value: "17", label: "months from fry to harvest" },
      { value: "16", label: "days of shelf life (HOG)" },
      { value: "20 m", label: "dinners per year" },
    ],
  },
  sustain: {
    heading: "Sustainability without detours",
    items: [
      {
        title: "Recirculated water",
        body: "RAS technology reuses the water continuously, with minimal consumption and regulated waste management.",
      },
      {
        title: "Waste heat",
        body: "Heat from the neighbouring data centre warms the facility – energy used twice.",
      },
      {
        title: "Hydrogen transport",
        body: "Feed in and fish out travel by zero-emission hydrogen trucks.",
      },
      {
        title: "Close to market",
        body: "Raised on land, near the market – fresher fish with a smaller footprint.",
      },
    ],
  },
  cta: {
    heading: "Taste it yourself",
    body: "Hima Trout is delivered as sashimi-grade HOG to selected customers. Get in touch for pricing and availability.",
    button: "Get in touch",
  },
  footer: {
    facilityLabel: "Facility",
    salesLabel: "Sales office",
    rights: "All rights reserved.",
  },
};

const de: Dict = {
  langName: "Deutsch",
  meta: {
    title: "Hima Trout – Sashimi-Qualität aus Rjukan",
    description:
      "Regenbogenforelle in Sashimi-Qualität, aufgezogen in kaltem, moränengefiltertem Bergwasser in der größten landbasierten RAS-Anlage der Welt. Erkunden Sie die Anlage in 3D.",
  },
  nav: { story: "Die Geschichte", facility: "Die Anlage", sustainability: "Nachhaltigkeit", contact: "Kontakt" },
  hero: {
    kicker: "Hima Seafood · Rjukan, Telemark",
    title: "Hima Trout",
    sub: "Regenbogenforelle in Sashimi-Qualität aus Rjukan, an Land aufgezogen in kaltem, moränengefiltertem Bergwasser, mit Fischwohl und Nachhaltigkeit an erster Stelle.",
    exploreCta: "Anlage in 3D erkunden",
    storyCta: "Die Geschichte",
    scroll: "Nach unten scrollen",
  },
  chapters: {
    heading: "Aus dem Tal der Schatten",
    items: [
      {
        num: "01",
        title: "Der Fisch",
        body: "Hima Trout stammt vom Osland-Stamm aus Høyanger am Sognefjord – einem der ältesten Forellenstämme Norwegens. Kaltes Wasser macht einen mageren Fisch mit kurzen Muskelfasern: fest, rein und natürlich rot. Als Sashimi, gebeizt, geräuchert oder gebraten.",
        alt: "Hände beim Zuschneiden eines roten Forellenfilets",
      },
      {
        num: "02",
        title: "Das Wasser",
        body: "Das Grundwasser stammt aus einem riesigen Reservoir im Vestfjorddalen, natürlich gefiltert durch mächtige Moränen des Telemarker Hochgebirges. Kalt, rein und stabil – Wasser, das man im Fisch schmeckt.",
        alt: "Fluss durch Moränenlandschaft, von oben gesehen",
      },
      {
        num: "03",
        title: "Der Ort",
        body: "Rjukan liegt im Tal der Schatten, wo hohe Berge die Sonne fünf Monate im Jahr verbergen und ein tiefer Nebel – hima – sich wie ein kalter Schutz über das Tal legt. Das Unmögliche wurde hier schon einmal möglich gemacht.",
        alt: "Berg in Telemark, von Wolken umgeben",
      },
    ],
  },
  welfare: {
    kicker: "Fischwohl",
    heading: "Fisch, dem es gut geht, schmeckt besser",
    intro:
      "Die gesamte Anlage ist um eine Idee herum gebaut: Die Forelle soll von der Rogenphase bis zur Ernte stabile, ruhige und saubere Bedingungen haben. Das ist gutes Tierwohl, und es ist die Grundlage für einen Premiumfisch.",
    items: [
      {
        title: "Kaltes, reines Wasser",
        body: "Das Grundwasser übersteigt selten 20 Grad und ist natürlich durch Moränen gefiltert. Kaltes Wasser sorgt für ruhiges, gleichmäßiges Wachstum und einen festen, mageren Fisch.",
      },
      {
        title: "Stabile Bedingungen",
        body: "Die RAS-Technologie gibt volle Kontrolle über Wasserqualität, Temperatur und Sauerstoff, jeden Tag, das ganze Jahr. Stabilität ist der wichtigste Einzelfaktor für die Fischgesundheit.",
      },
      {
        title: "Keine Lachsläuse",
        body: "Die Anlage liegt an Land und nutzt Grundwasser. Läuse kommen nie hinein, und der Fisch braucht nie eine Entlausung.",
      },
      {
        title: "Keine Ausbrüche",
        body: "Eine geschlossene Anlage an Land bedeutet null Ausbrüche und null Auswirkungen auf Wildbestände.",
      },
    ],
  },
  facility: {
    kicker: "Die Anlage",
    title: "Die Anlage von innen",
    intro: "Transparenz ist Teil des Produkts. Für alle, die sehen wollen, wie der Fisch lebt: Tippen Sie auf die Punkte und fliegen Sie in die Bereiche der RAS-Anlage, vom Wassereinlauf bis zum verpackten Fisch.",
    hint: "Ziehen zum Drehen · Scrollen zum Zoomen · zwei Finger zum Verschieben",
    reset: "Gesamte Anlage anzeigen",
    loading: "Anlage wird geladen …",
    webglFallback: "Ihr Browser unterstützt kein 3D. Hier ist die Anlage als Standbild – die Erklärungen finden Sie darunter.",
    fallbackAlt: "Das Tal von Rjukan, in dem die Anlage liegt",
    hotspotListHeading: "Die Bereiche der Anlage",
    close: "Schließen",
    canvasLabel: "Interaktives 3D-Modell der Anlage in Rjukan",
    markerLabel: "Erklärung anzeigen: {title}",
    placeholderNote: "Vorläufiges Modell – wird durch das CAD-Modell der Anlage ersetzt.",
    hotspots: {
      intake: {
        title: "Wassereinlauf",
        body: "Grundwasser aus dem Vestfjorddalen wird aus Brunnen direkt unter der Anlage gepumpt – natürlich durch Moränen gefiltert, nie wärmer als 20 °C.",
      },
      smolt: {
        title: "Smolt-Abteilung",
        body: "Hier schlüpft der Rogen des Osland-Stamms, und die Brut wächst in kleineren Becken, bis sie bereit für die Mastabteilung ist.",
      },
      grow: {
        title: "Mastbecken",
        body: "In den großen Becken wächst die Forelle 17 Monate bis zu einem Durchschnittsgewicht von rund 4 Kilo – in kaltem, kontinuierlich gereinigtem Wasser.",
      },
      filter: {
        title: "RAS-Filtration",
        body: "Trommelfilter und Biofilter reinigen das Wasser und führen es kontinuierlich zurück. Die RAS-Technologie von EYVI sorgt für geringen Wasserverbrauch und volle Kontrolle der Wasserqualität.",
      },
      purge: {
        title: "Purge",
        body: "Vor der Ernte ruht der Fisch in klarem, kaltem Wasser ohne Futter. Das ergibt einen reinen, frischen Geschmack – bereit für Sashimi.",
      },
      processing: {
        title: "Verarbeitung",
        body: "Der Fisch wird schonend geschlachtet und als HOG (head-on-gutted) mit 16 Tagen Haltbarkeit verpackt – ein kurzer Weg vom Wasser zum Markt.",
      },
      energy: {
        title: "Energiezentrale",
        body: "Die Anlage nutzt Abwärme aus dem Rechenzentrum von Green Mountain, und Futter und Fisch werden mit emissionsfreien Wasserstoff-Lkw transportiert.",
      },
    },
  },
  specs: {
    heading: "Die Zahlen",
    items: [
      { value: "8.000", label: "Tonnen HOG pro Jahr" },
      { value: "~4 kg", label: "Durchschnittsgewicht bei Ernte" },
      { value: "17", label: "Monate von der Brut bis zur Ernte" },
      { value: "16", label: "Tage Haltbarkeit (HOG)" },
      { value: "20 Mio.", label: "Mahlzeiten pro Jahr" },
    ],
  },
  sustain: {
    heading: "Nachhaltigkeit ohne Umwege",
    items: [
      {
        title: "Rezirkuliertes Wasser",
        body: "Die RAS-Technologie nutzt das Wasser kontinuierlich wieder – mit minimalem Verbrauch und geregelter Abfallbehandlung.",
      },
      {
        title: "Abwärme",
        body: "Wärme aus dem benachbarten Rechenzentrum heizt die Anlage – Energie, zweimal genutzt.",
      },
      {
        title: "Wasserstofftransport",
        body: "Futter hinein und Fisch hinaus – mit emissionsfreien Wasserstoff-Lkw.",
      },
      {
        title: "Marktnah",
        body: "An Land produziert, nah am Markt – frischerer Fisch mit kleinerem Fußabdruck.",
      },
    ],
  },
  cta: {
    heading: "Selbst probieren",
    body: "Hima Trout wird als HOG in Sashimi-Qualität an ausgewählte Kunden geliefert. Kontaktieren Sie uns für Preise und Verfügbarkeit.",
    button: "Kontakt aufnehmen",
  },
  footer: {
    facilityLabel: "Anlage",
    salesLabel: "Vertriebsbüro",
    rights: "Alle Rechte vorbehalten.",
  },
};

const fr: Dict = {
  langName: "Français",
  meta: {
    title: "Hima Trout – qualité sashimi de Rjukan",
    description:
      "Truite arc-en-ciel de qualité sashimi, élevée dans une eau de montagne froide filtrée par les moraines, dans la plus grande installation RAS terrestre au monde. Explorez l'installation en 3D.",
  },
  nav: { story: "L'histoire", facility: "L'installation", sustainability: "Durabilité", contact: "Contact" },
  hero: {
    kicker: "Hima Seafood · Rjukan, Telemark",
    title: "Hima Trout",
    sub: "Truite arc-en-ciel de qualité sashimi de Rjukan, élevée à terre dans une eau de montagne froide filtrée par les moraines, avec le bien-être du poisson et la durabilité comme première priorité.",
    exploreCta: "Explorer l'installation en 3D",
    storyCta: "L'histoire",
    scroll: "Faire défiler",
  },
  chapters: {
    heading: "De la vallée des ombres",
    items: [
      {
        num: "01",
        title: "Le poisson",
        body: "La Hima Trout descend de la souche Osland de Høyanger, dans le Sognefjord – l'une des plus anciennes souches de truite de Norvège. L'eau froide donne un poisson maigre aux fibres musculaires courtes : ferme, pur et naturellement rouge. En sashimi, gravlax, fumé ou poêlé.",
        alt: "Mains parant un filet de truite rouge",
      },
      {
        num: "02",
        title: "L'eau",
        body: "L'eau souterraine provient d'un immense réservoir du Vestfjorddalen, filtrée naturellement par les épaisses moraines des hauts plateaux du Telemark. Froide, pure et stable – une eau qui se goûte dans le poisson.",
        alt: "Rivière traversant un paysage de moraines, vue du ciel",
      },
      {
        num: "03",
        title: "Le lieu",
        body: "Rjukan se trouve dans la vallée des ombres, où de hautes montagnes cachent le soleil cinq mois par an et où une brume basse – hima – se pose sur la vallée comme une étreinte froide. L'impossible y a déjà été accompli.",
        alt: "Montagne du Telemark entourée de nuages",
      },
    ],
  },
  welfare: {
    kicker: "Bien-être du poisson",
    heading: "Un poisson qui vit bien a meilleur goût",
    intro:
      "Toute l'installation est construite autour d'une idée : offrir à la truite des conditions stables, calmes et propres, de l'œuf à la récolte. C'est du bon bien-être animal, et c'est le fondement d'un poisson premium.",
    items: [
      {
        title: "Eau froide et pure",
        body: "L'eau souterraine dépasse rarement 20 degrés et est filtrée naturellement par les moraines. L'eau froide donne une croissance calme et régulière, et un poisson ferme et maigre.",
      },
      {
        title: "Conditions stables",
        body: "La technologie RAS donne un contrôle total de la qualité de l'eau, de la température et de l'oxygène, chaque jour, toute l'année. La stabilité est le facteur le plus important pour la santé du poisson.",
      },
      {
        title: "Pas de poux de mer",
        body: "L'installation est à terre et utilise de l'eau souterraine. Les poux n'entrent jamais, et le poisson n'a jamais besoin de traitement antiparasitaire.",
      },
      {
        title: "Aucune échappée",
        body: "Une installation fermée à terre signifie zéro échappée et zéro impact sur les populations sauvages.",
      },
    ],
  },
  facility: {
    kicker: "L'installation",
    title: "Voir l'installation de l'intérieur",
    intro: "La transparence fait partie du produit. Pour qui veut voir comment vit le poisson : touchez les repères et survolez chaque partie de l'installation RAS, de la prise d'eau au poisson emballé.",
    hint: "Glisser pour pivoter · défiler pour zoomer · deux doigts pour déplacer",
    reset: "Voir toute l'installation",
    loading: "Chargement de l'installation …",
    webglFallback: "Votre navigateur ne prend pas en charge la 3D. Voici l'installation en image fixe – les explications sont ci-dessous.",
    fallbackAlt: "La vallée de Rjukan où se trouve l'installation",
    hotspotListHeading: "Les parties de l'installation",
    close: "Fermer",
    canvasLabel: "Modèle 3D interactif de l'installation de Rjukan",
    markerLabel: "Afficher l'explication : {title}",
    placeholderNote: "Modèle provisoire – sera remplacé par le modèle CAO de l'installation.",
    hotspots: {
      intake: {
        title: "Prise d'eau",
        body: "L'eau souterraine du Vestfjorddalen est pompée depuis des puits situés juste sous l'installation – filtrée naturellement par les moraines, jamais au-dessus de 20 °C.",
      },
      smolt: {
        title: "Unité smolt",
        body: "Les œufs de la souche Osland éclosent ici, et les alevins grandissent dans de petits bassins jusqu'à rejoindre l'unité de grossissement.",
      },
      grow: {
        title: "Bassins de grossissement",
        body: "Dans les grands bassins, la truite grandit pendant 17 mois jusqu'à un poids moyen d'environ 4 kilos – dans une eau froide purifiée en continu.",
      },
      filter: {
        title: "Filtration RAS",
        body: "Filtres à tambour et biofiltres purifient et recyclent l'eau en continu. La technologie RAS d'EYVI assure une faible consommation d'eau et un contrôle total de sa qualité.",
      },
      purge: {
        title: "Purge",
        body: "Avant la récolte, le poisson repose dans une eau pure et froide, sans alimentation. Le résultat : un goût net et frais – prêt pour le sashimi.",
      },
      processing: {
        title: "Transformation",
        body: "Le poisson est récolté avec soin et emballé en HOG (vidé, avec tête) avec 16 jours de conservation – un court trajet de l'eau au marché.",
      },
      energy: {
        title: "Centre énergétique",
        body: "L'installation réutilise la chaleur résiduelle du centre de données de Green Mountain, et l'aliment comme le poisson voyagent en camions à hydrogène zéro émission.",
      },
    },
  },
  specs: {
    heading: "Les chiffres",
    items: [
      { value: "8 000", label: "tonnes HOG par an" },
      { value: "~4 kg", label: "poids moyen à la récolte" },
      { value: "17", label: "mois de l'alevin à la récolte" },
      { value: "16", label: "jours de conservation (HOG)" },
      { value: "20 M", label: "repas par an" },
    ],
  },
  sustain: {
    heading: "La durabilité sans détours",
    items: [
      {
        title: "Eau recyclée",
        body: "La technologie RAS réutilise l'eau en continu, avec une consommation minimale et une gestion contrôlée des déchets.",
      },
      {
        title: "Chaleur résiduelle",
        body: "La chaleur du centre de données voisin chauffe l'installation – une énergie utilisée deux fois.",
      },
      {
        title: "Transport à hydrogène",
        body: "L'aliment entre et le poisson sort en camions à hydrogène zéro émission.",
      },
      {
        title: "Circuit court",
        body: "Élevé à terre, près du marché – un poisson plus frais, une empreinte plus légère.",
      },
    ],
  },
  cta: {
    heading: "Goûtez vous-même",
    body: "La Hima Trout est livrée en HOG de qualité sashimi à une clientèle sélectionnée. Contactez-nous pour les prix et la disponibilité.",
    button: "Nous contacter",
  },
  footer: {
    facilityLabel: "Site de production",
    salesLabel: "Bureau commercial",
    rights: "Tous droits réservés.",
  },
};

const dictionaries: Record<Locale, Dict> = { no, en, de, fr };

export function getDict(locale: string): Dict {
  return dictionaries[(locales as readonly string[]).includes(locale) ? (locale as Locale) : defaultLocale];
}
