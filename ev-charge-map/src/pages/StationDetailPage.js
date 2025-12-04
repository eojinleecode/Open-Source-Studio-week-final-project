import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const station = state?.station;

  const roadviewRef = useRef(null);

  useEffect(() => {
    if (!station || !station.lat || !station.lng) return;

    const { naver } = window;
    if (!naver || !naver.maps) {
      console.error("Naver Maps JS SDK가 로드되지 않았습니다.");
      return;
    }

    const position = new naver.maps.LatLng(station.lat, station.lng);

    new naver.maps.Panorama(roadviewRef.current, {
      position,
      pov: { pan: -135, tilt: 29, fov: 100 },
    });
  }, [station]);

  if (!station) {
    return (
      <section>
        <p>충전소 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/stations")}>목록으로 돌아가기</button>
      </section>
    );
  }

  const hasLocation = station.lat && station.lng;

  return (
    <section className="detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← 목록으로
      </button>

      <h2>{station.name}</h2>
      <p className="card-address">{station.address}</p>

      <div className="detail-info">
        <p>
          <strong>지역:</strong> {station.city} {station.district}
        </p>
        <p>
          <strong>충전기 타입:</strong> {station.chargerType}
        </p>
        <p>
          <strong>급속/완속:</strong> {station.chargerPower}
        </p>
        <p>
          <strong>운영기관:</strong> {station.operator}
        </p>
        <p>
          <strong>상태:</strong>{" "}
          <span
            className={
              station.available ? "badge badge-success" : "badge badge-danger"
            }
          >
            {station.available ? "이용가능" : "제한"}
          </span>
        </p>
        {hasLocation && (
          <p>
            <strong>좌표:</strong> ({station.lat}, {station.lng})
          </p>
        )}
      </div>

      {hasLocation && (
        <>
          {/* 🔵 상단 지도 */}
          <div className="detail-map-block">
            <h3>지도에서 위치 보기</h3>
            <MapContainer
              center={[station.lat, station.lng]}
              zoom={16}
              style={{
                height: "320px",
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                marginTop: "8px",
              }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[station.lat, station.lng]} icon={markerIcon}>
                <Popup>
                  <b>{station.name}</b>
                  <br />
                  {station.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* 🟢 하단 로드뷰 */}
          <div className="detail-roadview-block">
            <h3>네이버 로드뷰</h3>
            <div
              ref={roadviewRef}
              style={{
                width: "100%",
                height: "320px",
                marginTop: "8px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default StationDetailPage;