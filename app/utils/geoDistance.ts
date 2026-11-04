/** Great-circle distance between two points, in metres. */
export function distanceInMeters(a: { lat: number, lng: number }, b: { lat: number, lng: number }): number {
  const toRad = (deg: number) => deg * (Math.PI / 180)
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}
