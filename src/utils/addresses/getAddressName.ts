import axios from "axios";
export const reverseGeocode = async (lat: number, lng: number) => {
  const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
  const res = await axios.get(BASE_URL, {
    params: {
      latlng: `${lat},${lng}`,
      key: process.env.PLACES_API,
    },
  });

  if (res.data.status !== "OK") {
    throw new Error(res.data.error_message || res.data.status);
  }

  return res.data.results[0].formatted_address;
};
