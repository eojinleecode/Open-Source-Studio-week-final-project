import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyStations, deleteMyStation } from "../api/mockapi";
import { useAuth } from "../context/AuthContext";

function MyStationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인된 유저 정보 가져오기

  // 1. 내 아이디에 해당하는 충전소만 불러오기
  const loadMyStations = useCallback(async () => {
    if (!user) {
      setStations([]);
      return;
    }

    setLoading(true);
    try {
      const allList = await fetchMyStations();
      const myOnlyList = allList.filter((s) => s.userId === user.userId);
      
      setStations(myOnlyList);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. 관심 목록에서 삭제 (이름과 유저 ID를 대조하여 안전하게 삭제)
  const handleRemove = async (station) => {
    if (!window.confirm(`'${station.stationName}'을(를) 관심 목록에서 삭제하시겠습니까?`)) return;
    
    try {
      // mockapi.js의 수정된 로직에 따라 (이름, 유저ID) 전달
      await deleteMyStation(station.stationName, user.userId);
      
      // 삭제 후 화면 갱신 (이미 가져온 상태값에서 해당 항목만 제외)
      setStations((prev) => prev.filter((s) => s.id !== station.id));
      alert("삭제되었습니다.");
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadMyStations();
  }, [loadMyStations]);

  return (
    <section className="container">
      <div className="page-header" style={{ marginBottom: '30px', marginTop: '20px' }}>
        <h2 className="page-title">내 관심 충전소</h2>
        <p className="page-subtitle" style={{ color: '#64748b' }}>
          {user 
            ? `안녕하세요, ${user.nickname || user.userId}님! 저장하신 충전소 목록입니다.` 
            : "로그인이 필요한 서비스입니다."}
        </p>
      </div>

      {loading && <div className="status-msg">데이터를 불러오는 중입니다...</div>}
      
      {!loading && stations.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '100px 0', background: '#f8fafc', borderRadius: '16px' }}>
          <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '20px' }}>등록된 관심 충전소가 없습니다.</p>
          <button className="primary-button" onClick={() => navigate("/stations")}>
            충전소 찾으러 가기
          </button>
        </div>
      )}

      <div className="card-grid">
        {stations.map((s) => (
          <div key={s.id} className="card">
            <div className="card-content">
              <div className="card-header">
                <h3>{s.stationName}</h3>
                <span className={`badge ${s.isAvailable ? "badge-success" : "badge-danger"}`}>
                  {s.isAvailable ? "이용가능" : "제한/점검중"}
                </span>
              </div>
              <p className="card-address">{s.address}</p>
              
              <div className="card-info-summary" style={{ fontSize: '13px', color: '#64748b', margin: '10px 0' }}>
                <span>{s.chargerType}</span> • <span>{s.chargerPower}</span>
              </div>
              
              <div className="card-actions">
                <button
                  className="secondary-button"
                  onClick={() => navigate(`/stations/${s.sourceId || s.id}`, {
                    state: { 
                      station: { 
                        ...s, 
                        name: s.stationName, 
                        available: s.isAvailable 
                      } 
                    }
                  })}
                >
                  상세보기
                </button>
                <button 
                  className="danger-button" 
                  onClick={() => handleRemove(s)}
                  style={{ backgroundColor: '#fff', color: '#ff4757', border: '1px solid #ff4757' }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyStationsPage;
