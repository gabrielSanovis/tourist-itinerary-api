// ─────────────────────────────────────────────
// nominatimService.ts
// Reverse geocoding via OpenStreetMap / Nominatim
// ─────────────────────────────────────────────

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

const USER_AGENT = "location-explorer/1.0 (seu-email@exemplo.com)";

// ─── Tipos ────────────────────────────────────

export interface NominatimResult {
  displayName: string;
  locationType: string;
  country: string | null;
  state: string | null;
  city: string | null;
  district: string | null;
  raw: NominatimResponse;
}

interface NominatimResponse {
  display_name: string;
  type: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    neighbourhood?: string;
    municipality?: string;
    [key: string]: string | undefined;
  };
}

// ─── Função principal ─────────────────────────

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<NominatimResult> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "json",
    addressdetails: "1",
    zoom: "14",
  });

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as NominatimResponse;

  return normalize(data);
}

// ─── Normalização ─────────────────────────────

function normalize(data: NominatimResponse): NominatimResult {
  const addr = data.address;

  return {
    displayName: data.display_name,
    locationType: data.type,
    country: addr.country ?? null,
    state: addr.state ?? null,
    city:
      addr.city ??
      addr.town ??
      addr.village ??
      addr.municipality ??
      null,
    district:
      addr.suburb ??
      addr.neighbourhood ??
      null,
    raw: data,
  };
}
