import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyStations, deleteMyStation } from "../api/mockapi";

function MyStationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadMyStations = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const list = await fetchMyStations();
      setStations(list);

      if (list.length === 0) {
        setMessage("My Stations에 저장된 충전소가 없습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("My Stations 데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("이 충전소를 My Stations에서 삭제할까요?")) return;
    try {
      await deleteMyStation(id);
      setStations((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadMyStations();
  }, []);

  return (
    <section>
      <h2>My Stations</h2>

      {loading && <p>불러오는 중...</p>}
      {error && <p className="error-text">{error}</p>}
      {message && <p className="info-text">{message}</p>}

      <div className="card-grid">
        {stations.map((s) => (
          <div key={s.id} className="card">
            <h3>{s.stationName}</h3>
            <p className="card-address">{s.address}</p>

            <p>지역: {s.city} {s.district}</p>
            <p>충전기 타입: {s.chargerType}</p>
            <p>급속/완속: {s.chargerPower}</p>
            <p>운영기관: {s.operator}</p>

            <p>
              상태:{" "}
              <span className={s.isAvailable ? "badge badge-success" : "badge badge-danger"}>
                {s.isAvailable ? "이용가능" : "제한"}
              </span>
            </p>

            {s.lat && s.lng && <p>위치: ({s.lat}, {s.lng})</p>}

            <div className="card-actions">
              <button
                onClick={() =>
                  navigate(`/stations/${s.sourceId || s.id}`, {
                    state: {
                      station: {
                        id: s.sourceId || s.id,
                        name: s.stationName,
                        address: s.address,
                        city: s.city,
                        district: s.district,
                        chargerType: s.chargerType,
                        chargerPower: s.chargerPower,
                        operator: s.operator,
                        available: s.isAvailable,
                        lat: s.lat,
                        lng: s.lng,
                      },
                    },
                  })
                }
              >
                상세보기
              </button>

              <button onClick={() => handleRemove(s.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyStationsPage;
