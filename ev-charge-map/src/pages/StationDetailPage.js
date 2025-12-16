import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import { createMyStation, deleteMyStation, fetchMyStations } from "../api/mockapi";

// 마커 아이콘 설정
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function StationDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const station = state?.station;
  const roadviewRef = useRef(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  // 1. 페이지 진입 시 로드뷰 및 관심 상태 확인
  useEffect(() => {
    if (!station) return;

    // 네이버 로드뷰 설정
    const { naver } = window;
    if (naver && naver.maps && roadviewRef.current && station.lat && station.lng) {
      const position = new naver.maps.LatLng(station.lat, station.lng);
      new naver.maps.Panorama(roadviewRef.current, {
        position,
        pov: { pan: -135, tilt: 29, fov: 100 },
      });
    }

    const checkFavorite = async () => {
      // 1. 로그인이 안 되어 있으면 체크할 필요도 없이 false
      if (!user) {
        setIsFavorite(false);
        setLoadingFavorite(false);
        return;
      }

      try {
        const myStations = await fetchMyStations();
        const exists = myStations.some(
          (s) => s.stationName === station.name && 
                 s.address === station.address && 
                 s.userId === user.userId // 이 조건이 없으면 모든 유저가 공유하게 됨
        );
        
        setIsFavorite(exists);
      } catch (err) {
        console.error("관심 목록 확인 실패:", err);
      } finally {
        setLoadingFavorite(false);
      }
    };

    checkFavorite();
  }, [station, user]); //

  // 2. 관심 등록 토글 함수
  const toggleFavorite = async () => {
    if (!user) {
      if (window.confirm("로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?")) {
        navigate("/login");
      }
      return;
    }

    try {
      setLoadingFavorite(true);
      if (isFavorite) {
        // [해제 로직] 수정된 mockapi.js에 맞춰 이름 전달
        await deleteMyStation(station.name, user.userId);
        setIsFavorite(false);
        alert("관심 목록에서 제거되었습니다.");
      } else {
        // [등록 로직]
        const res = await createMyStation(station);
        
        if (res.message === "Duplicate") {
          alert("이미 등록된 충전소입니다.");
          setIsFavorite(true);
        } else {
          setIsFavorite(true);
          alert("관심 목록에 추가되었습니다.");
        }
      }
    } catch (err) {
      console.error("관심 처리 중 오류:", err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setLoadingFavorite(false);
    }
  };

  const openNaverMap = () => {
    if (!station.lat || !station.lng) return;
    const url = `https://map.naver.com/v5/directions/-/` + 
                `${station.lng},${station.lat},${encodeURIComponent(station.name)}/-/car`;
    window.open(url, "_blank");
  };

  if (!station) {
    return (
      <section className="container" style={{padding: '50px 0', textAlign: 'center'}}>
        <p>충전소 정보가 없습니다.</p>
        <button onClick={() => navigate("/stations")} className="primary-button">목록으로 돌아가기</button>
      </section>
    );
  }

  const hasLocation = station.lat && station.lng;

  return (
    <section className="detail-page container">
      <div className="detail-nav" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '20px' }}>
        <button onClick={() => navigate(-1)} className="back-button">← 목록으로</button>
        
        {/* 버튼 UI: 상태에 따라 하트 색상 변경 */}
        <button 
          onClick={toggleFavorite} 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          disabled={loadingFavorite}
          style={{ 
            backgroundColor: isFavorite ? '#ff4757' : '#fff',
            color: isFavorite ? '#fff' : '#333',
            border: isFavorite ? 'none' : '1px solid #ddd',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: loadingFavorite ? 'wait' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {loadingFavorite ? "확인 중..." : (isFavorite ? "❤️ 등록됨" : "🤍 관심 등록")}
        </button>
      </div>

      <div className="detail-content-card" style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{station.name}</h2>
        <p className="card-address" style={{ color: '#666', marginBottom: '20px' }}>{station.address}</p>
        
        <button onClick={openNaverMap} className="primary-button" style={{ marginBottom: '30px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
          🚀 네이버 지도 길찾기
        </button>

        <div className="detail-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '25px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <div className="info-group">
            <p style={{ margin: '10px 0' }}><strong>지역:</strong> {station.city} {station.district}</p>
            <p style={{ margin: '10px 0' }}><strong>충전기 타입:</strong> {station.chargerType}</p>
            <p style={{ margin: '10px 0' }}><strong>급속/완속:</strong> {station.chargerPower}</p>
          </div>
          <div className="info-group">
            <p style={{ margin: '10px 0' }}><strong>운영기관:</strong> {station.operator}</p>
            <p style={{ margin: '10px 0' }}><strong>상태:</strong> 
              <span className={`badge ${station.available ? "badge-success" : "badge-danger"}`} style={{ marginLeft: '10px' }}>
                {station.available ? "이용가능" : "제한/점검중"}
              </span>
            </p>
            {hasLocation && <p style={{ margin: '10px 0' }}><strong>좌표:</strong> {station.lat}, {station.lng}</p>}
          </div>
        </div>

        {hasLocation && (
          <div className="media-section" style={{ marginTop: '40px' }}>
            <div className="map-block" style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '15px', color: '#334155' }}>위치 지도</h3>
              <div className="detail-map-wrapper" style={{ height: "400px", borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <MapContainer center={[station.lat, station.lng]} zoom={16} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[station.lat, station.lng]} icon={markerIcon}>
                    <Popup><b>{station.name}</b></Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            <div className="roadview-block">
              <h3 style={{ marginBottom: '15px', color: '#334155' }}>현장 로드뷰</h3>
              <div ref={roadviewRef} className="roadview-wrapper" style={{ height: "400px", borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9' }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default StationDetailPage;
