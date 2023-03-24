import axios from "axios";

export const getCountryFromLatLong = async (
  lat: number,
  long: number
): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`;
  try {
    const response = await axios.get(url);
    const address = response.data as { country: string };
    return address.country;
  } catch (error: any) {
    console.error(`Error getting country from lat long: ${error.message}`);
    return "Unknown";
  }
};
