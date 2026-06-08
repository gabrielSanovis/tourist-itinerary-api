// ─────────────────────────────────────────────
// overpassService.ts
// Busca pontos de interesse turístico próximos
// via Overpass API (OpenStreetMap)
// ─────────────────────────────────────────────

const OVERPASS_BASE = "https://overpass-api.de/api/interpreter";

// ─── Tipos ────────────────────────────────────

export interface PointOfInterest {
  id: number;
  name: string | null;
  type: PoiType;
  category: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  tags: Record<string, string>;
}

export type PoiType =
  | "natural"
  | "tourism"
  | "leisure"
  | "historic"
  | "waterway";

export interface OverpassResult {
  pois: PointOfInterest[];
  totalFound: number;
  radiusMeters: number;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// ─── Configuração de categorias ───────────────

const POI_FILTERS: Array<{ osm_key: string; osm_values: string[]; type: PoiType; label: string }> = [
  {
    osm_key: "tourism",
    osm_values: ["attraction", "viewpoint", "museum", "artwork", "zoo", "theme_park"],
    type: "tourism",
    label: "Atração turística",
  },
  {
    osm_key: "natural",
    osm_values: ["waterfall", "beach", "cave_entrance", "peak", "spring", "hot_spring", "geyser"],
    type: "natural",
    label: "Atração natural",
  },
  {
    osm_key: "leisure",
    osm_values: ["nature_reserve", "park", "marina"],
    type: "leisure",
    label: "Lazer / parque",
  },
  {
    osm_key: "historic",
    osm_values: ["monument", "ruins", "castle", "archaeological_site", "memorial"],
    type: "historic",
    label: "Patrimônio histórico",
  },
  {
    osm_key: "waterway",
    osm_values: ["waterfall"],
    type: "waterway",
    label: "Curso d'água",
  },
];

// ─── Função principal ─────────────────────────

export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  radiusMeters = 5000,
  limit = 20
): Promise<OverpassResult> {
  const query = buildQuery(lat, lng, radiusMeters);

  const res = await fetch(OVERPASS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as OverpassResponse;

  const pois = data.elements
    .map((el) => toPointOfInterest(el, lat, lng))
    .filter((p): p is PointOfInterest => p !== null)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);

  return {
    pois,
    totalFound: data.elements.length,
    radiusMeters,
  };
}

// ─── Overpass QL ──────────────────────────────

function buildQuery(lat: number, lng: number, radius: number): string {
  const around = `(around:${radius},${lat},${lng})`;

  const blocks = POI_FILTERS.flatMap(({ osm_key, osm_values }) =>
    osm_values.flatMap((val) => [
      `node["${osm_key}"="${val}"]${around};`,
      `way["${osm_key}"="${val}"]${around};`,
    ])
  ).join("\n  ");

  return `
[out:json][timeout:14];
(
  ${blocks}
);
out center;
  `.trim();
}

// ─── Normalização ─────────────────────────────

function toPointOfInterest(
  el: OverpassElement,
  originLat: number,
  originLng: number
): PointOfInterest | null {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;

  if (!lat || !lon) return null;

  const tags = el.tags ?? {};
  const name = tags.name ?? tags["name:pt"] ?? null;

  if (!name) return null;

  const { type, category } = resolveCategory(tags);

  return {
    id: el.id,
    name,
    type,
    category,
    lat,
    lng: lon,
    distanceMeters: Math.round(haversine(originLat, originLng, lat, lon)),
    tags,
  };
}

function resolveCategory(
  tags: Record<string, string>
): { type: PoiType; category: string } {
  for (const { osm_key, osm_values, type, label } of POI_FILTERS) {
    const val = tags[osm_key];
    if (val && osm_values.includes(val)) {
      return { type, category: label };
    }
  }
  return { type: "tourism", category: "Ponto de interesse" };
}

// ─── Haversine ────────────────────────────────

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
