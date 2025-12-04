
import axios from "axios";

const MOCK_API_BASE_URL =
  "https://69306a16778bbf9e00714569.mockapi.io/stations";


export async function createMyStation(station) {
  const payload = {
   
    sourceId: station.id,
    stationName: station.name,
    address: station.address,
    city: station.city,
    district: station.district,
    chargerType: station.chargerType,
    chargerPower: station.chargerPower,
    operator: station.operator,
    isAvailable: station.available,
    lat: station.lat,
    lng: station.lng,
    favorite: true,
  };

  const res = await axios.post(MOCK_API_BASE_URL, payload);
  return res.data;
}


export async function fetchMyStations() {
  const res = await axios.get(MOCK_API_BASE_URL);
  return res.data || [];
}


export async function deleteMyStation(id) {
  await axios.delete(`${MOCK_API_BASE_URL}/${id}`);
}
