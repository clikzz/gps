import { AddressComponents } from "@/types/find";

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<AddressComponents> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const url = `https://api.mapbox.com/search/geocode/v6/reverse`
    + `?longitude=${encodeURIComponent(lng)}`
    + `&latitude=${encodeURIComponent(lat)}`
    + `&limit=1`
    + `&language=es`
    + `&access_token=${token}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding error: ${res.statusText}`);
  }

  const data = await res.json();
  const feat = data.features?.[0];
  if (!feat) return { full_address: "" };

  const props = feat.properties || {};
  const ctx = props.context || {};

  return {
    full_address: props.full_address || "",
    address:    ctx.address?.name || "",
    street:     ctx.street?.name || "",
    city:       ctx.place?.name || "",
    region:     ctx.region?.name || "",
    postcode:   ctx.postcode?.name || "",
    country:    ctx.country?.name || "",
  };
}