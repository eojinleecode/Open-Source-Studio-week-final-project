import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStations } from "../api/Openapi";
import { createMyStation, fetchMyStations } from "../api/mockapi"; 
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 마커 아이콘 설정
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function StationListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [myStationNames, setMyStationNames] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 필터 상태 (CSS 레이아웃에 맞춰 4가지 구성)
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    power: "",
    available: ""
  });

  // 1. 내 관심 목록 실시간 동기화 (MockAPI의 'stationName' 필드 사용)
  const loadMyStationStatus = useCallback(async () => {
  if (!user) {
    setMyStationNames([]);
    return;
  }

  try {
    const allStations = await fetchMyStations(); 
    const myOnlyStations = allStations.filter(s => s.userId === user.userId);
    setMyStationNames(myOnlyStations.map(s => s.stationName));
  } catch (err) {
    console.error("관심 목록 로드 실패:", err);
  }
}, [user]);

  // 2. 충전소 목록 로드 및 필터링
  const loadStations = useCallback(async (p) => {
    setLoading(true);
    try {
      const list = await fetchStations({
        page: p,
        city: filters.city,
        chargerType: filters.type
      });

      const finalFiltered = list.filter(s => {
        let matchPower = true;
        if (filters.power === "급속") {
          matchPower = s.chargerPower.includes("급속") || parseInt(s.chargerPower) >= 50;
        } else if (filters.power === "완속") {
          matchPower = s.chargerPower.includes("완속") || (parseInt(s.chargerPower) > 0 && parseInt(s.chargerPower) < 50);
        }
        const matchAvail = !filters.available || (filters.available === "true" ? s.available : !s.available);
        return matchPower && matchAvail;
      });

      setStations(finalFiltered);
      await loadMyStationStatus(); // 새로고침 대비 관심 상태 다시 읽기
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, loadMyStationStatus]);

  useEffect(() => { setPage(1); }, [filters]);
  useEffect(() => { loadStations(page); }, [page, loadStations]);

  // 3. 관심 등록 핸들러
  const handleAddToMyStations = async (station) => {
    if (!user) {
      if (window.confirm("로그인이 필요합니다. 이동하시겠습니까?")) navigate("/login");
      return;
    }

    if (myStationNames.includes(station.name)) {
      alert("이미 등록된 충전소입니다.");
      return;
    }

    try {
      await createMyStation(station, user.userId);
      setMyStationNames(prev => [...prev, station.name]);
      alert("관심 목록에 등록되었습니다!");
    } catch (err) {
      alert("등록에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">전국 충전소 검색</h2>
      <div className="filter-container">
        <select 
          value={filters.city} 
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="">지역 전체</option>
          <option value="서울특별시">서울특별시</option>
          <option value="경기도">경기도</option>
          <option value="인천광역시">인천광역시</option>
          <option value="강원도">강원도</option>
          <option value="충청북도">충청북도</option>
          <option value="충청남도">충청남도</option>
          <option value="전라북도">전라북도</option>
          <option value="전라남도">전라남도</option>
          <option value="경상북도">경상북도</option>
          <option value="경상남도">경상남도</option>
          <option value="대전광역시">대전광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="부산광역시">부산광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="세종특별자치시">세종특별자치시</option>
          <option value="제주특별자치도">제주특별자치도</option>
        </select>

        <select 
          value={filters.type} 
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">충전기 타입 전체</option>
          <option value="DC차데모">DC차데모</option>
          <option value="AC3상">AC3상</option>
          <option value="DC콤보">DC콤보</option>
          <option value="완속">완속</option>
        </select>

        <select 
          value={filters.power} 
          onChange={(e) => setFilters({ ...filters, power: e.target.value })}
        >
          <option value="">충전 속도 전체</option>
          <option value="급속">급속 (50kW 이상)</option>
          <option value="완속">완속 (7kW 이하)</option>
        </select>

        <select 
          value={filters.available} 
          onChange={(e) => setFilters({ ...filters, available: e.target.value })}
        >
          <option value="">상태 전체</option>
          <option value="true">이용 가능</option>
          <option value="false">이용 불가/점검중</option>
        </select>
      </div>

      {loading ? (
        <div className="status-msg">충전소 데이터를 불러오는 중...</div>
      ) : (
        <div className="card-grid">
          {stations.map((s) => {
            const isFav = myStationNames.includes(s.name);
            
            return (
              <div key={s.id} className="card">
                <div className="card-map-wrapper">
                  <MapContainer center={[s.lat, s.lng]} zoom={15} zoomControl={false} dragging={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[s.lat, s.lng]} icon={markerIcon} />
                  </MapContainer>
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{s.name}</h3>
                    <span className={`badge ${s.available ? "badge-success" : "badge-danger"}`}>
                      {s.available ? "이용가능" : "점검중"}
                    </span>
                  </div>
                  <p className="card-address">{s.address}</p>
                  <div className="card-actions">
                    <button className="secondary-button" onClick={() => navigate(`/stations/${s.id}`, { state: { station: s } })}>상세보기</button>
                    <button 
                      className={`primary-button ${isFav ? "active" : ""}`} 
                      onClick={() => handleAddToMyStations(s)}
                      disabled={isFav} 
                      style={{ 
                      backgroundColor: isFav ? "#ff4757" : "#f1f5f9", 
                      color: isFav ? "#ffffff" : "#475569",          
                      border: isFav ? "none" : "1px solid #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                      }}
                    >
                      {isFav ? (
                        <>
                          <span style={{ color: "#ffffff" }}>🤍</span> 
                          <span style={{ fontWeight: "bold" }}>등록됨</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: "#ff4757" }}>❤️</span> 
                          <span>관심등록</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- 페이지네이션 --- */}
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '40px 0' }}>
        <button 
          disabled={page === 1} 
          onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
          className="page-button"
        >
          이전
        </button>
        <span className="page-number" style={{ fontWeight: 'bold' }}>{page}</span>
        <button 
          onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
          className="page-button"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default StationListPage;
