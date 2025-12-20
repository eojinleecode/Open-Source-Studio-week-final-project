import axios from "axios";

const MOCK_API_BASE_URL = "https://69306a16778bbf9e00714569.mockapi.io/stations";

// 1. 등록할 때 userId를 인자로 받아서 payload에 추가
export async function createMyStation(station, userId) {
  const payload = {
    userId: userId, 
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

// 2. 전체 목록 가져오기 (필터링은 호출하는 페이지에서 수행)
export async function fetchMyStations() {
  const res = await axios.get(MOCK_API_BASE_URL);
  return res.data || [];
}

// 3. 삭제 시 이름과 유저 ID를 모두 확인하여 본인 것만 삭제
export const deleteMyStation = async (stationName, userId) => {
  try {
    const res = await axios.get(MOCK_API_BASE_URL);
    // 내 아이디가 등록한 해당 이름의 충전소 찾기
    const target = res.data.find(
      (s) => s.stationName === stationName && s.userId === userId
    );

    if (target) {
      await axios.delete(`${MOCK_API_BASE_URL}/${target.id}`);
    }
  } catch (err) {
    console.error("삭제 실패:", err);
    throw err;
  }
};
