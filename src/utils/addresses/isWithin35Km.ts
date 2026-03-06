type calculateDistParams = {
  addr1: {
    lat1: number;
    lon1: number;
  };
  addr2: {
    lat2: number;
    lon2: number;
  };
};
/**
 * Checks whether the distance between two coordinates
 * is within 35 kilometers using the Haversine formula.
 */
export const isWithin35Km = ({ addr1, addr2 }: calculateDistParams) => {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Destructure latitude and longitude from both addresses
  const { lat1, lon1 } = addr1;
  const { lat2, lon2 } = addr2;

  // Convert latitude and longitude differences from degrees to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  // Calculates the central angle between two points on a sphere
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  // Angular distance in radians
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance between the two points in kilometers
  const dist = R * c;

  // Return true if distance is within 35 km, otherwise false
  return dist <= 35;
};
