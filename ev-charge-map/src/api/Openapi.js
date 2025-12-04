import axios from "axios";

const OPEN_API_BASE_URL =
  "https://api.odcloud.kr/api/15125089/v1/uddi:00dd2278-6e4b-459e-9ad2-b7b3f876513a";

const SERVICE_KEY =
  "bbb1c36f519d9ddb1fdb827c71c39c924ee600e1d66d497a00593d84232e4863";

function normalizeStation(raw, index) {
  let lat = null;
  let lng = null;

  if (raw["위도경도"]) {
    const [latStr, lngStr] = raw["위도경도"].split(",");
    lat = Number(latStr);
    lng = Number(lngStr);
  }

  return {
    id: `${raw["충전소명"] ?? "station"}-${raw["주소"] ?? ""}-${index}`,
    name: raw["충전소명"] || "이름 없음",
    address: raw["주소"] || "",
    city: raw["시도"] || "",
    district: raw["군구"] || "",
    chargerType: raw["충전기타입"] || "",
    chargerPower: raw["급속충전량"] || "",
    facilityLarge: raw["시설구분(대)"] || "",
    facilitySmall: raw["시설구분(소)"] || "",
    operator: raw["운영기관(대)"] || raw["운영기관(소)"] || "",
    available: raw["이용자제한"] === "이용가능",
    lat,
    lng,
  };
}

export async function fetchStations({
  keyword = "",
  chargerType = "",
  page = 1,
  perPage = 50,
} = {}) {
  try {
    const params = {
      page,
      perPage,
      serviceKey: SERVICE_KEY,
    };

    if (keyword) {
      params["cond[주소::LIKE]"] = keyword;
    }

    const res = await axios.get(OPEN_API_BASE_URL, { params });

    const rawList = res.data.data || [];
    let list = rawList.map((row, idx) => normalizeStation(row, idx));

    if (chargerType) {
      const lower = chargerType.toLowerCase();
      list = list.filter((s) =>
        (s.chargerType || "").toLowerCase().includes(lower)
      );
    }

    return list;
  } catch (err) {
    console.error("Error fetching stations:", err);
    throw err;
  }
}
