import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStations } from "../api/Openapi";
import { createMyStation } from "../api/mockapi";

function StationListPage() {
  const [keyword, setKeyword] = useState("");
  const [chargerType, setChargerType] = useState("");
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadStations = useCallback(
    async (overridePage) => {
      const currentPage = overridePage ?? page;

      setLoading(true);
      setError(null);
      setMessage("");

      try {
        const list = await fetchStations({
          keyword,
          chargerType,
          page: currentPage,
        });

        setStations(list);

        if (list.length === 0) {
          setMessage("조건에 맞는 충전소가 없습니다. 검색어/필터를 바꿔보세요.");
        }
      } catch (err) {
        console.error(err);
        setError("충전소 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [keyword, chargerType, page] // loadStations 내부에서 사용하는 state들
  );

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadStations(1);
  };

  const handleAddToMyStations = async (station) => {
    try {
      await createMyStation(station);
      setMessage("My Stations에 추가되었습니다.");
    } catch (err) {
      console.error(err);
      setError("My Stations에 추가하는 도중 오류가 발생했습니다.");
    }
  };

  return (
    <section>
      <h2>전기차 충전소 목록</h2>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="충전소명 또는 주소 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          value={chargerType}
          onChange={(e) => setChargerType(e.target.value)}
        >
          <option value="">충전기 타입 전체</option>
          <option value="DC">DC (급속)</option>
          <option value="AC">AC (완속)</option>
          <option value="DC차데모">DC차데모</option>
          <option value="DC콤보">DC콤보</option>
        </select>
        <button type="submit" className="primary-button">
          검색
        </button>
      </form>

      {loading && <p>불러오는 중...</p>}
      {error && <p className="error-text">{error}</p>}
      {message && <p className="info-text">{message}</p>}

      <div className="card-grid">
        {stations.map((station) => (
          <div key={station.id} className="card">
            <h3>{station.name}</h3>
            <p className="card-address">{station.address}</p>
            <p>
              지역: {station.city} {station.district}
            </p>
            <p>충전기 타입: {station.chargerType}</p>
            <p>급속/완속: {station.chargerPower}</p>
            <p>
              시설: {station.facilityLarge} / {station.facilitySmall}
            </p>
            <p>운영기관: {station.operator}</p>
            <p>
              상태:{" "}
              <span
                className={
                  station.available
                    ? "badge badge-success"
                    : "badge badge-danger"
                }
              >
                {station.available ? "이용가능" : "제한"}
              </span>
            </p>
            {station.lat && station.lng && (
              <p>
                위치: ({station.lat}, {station.lng})
              </p>
            )}

            <div className="card-actions">
              <button
                type="button"
                onClick={() =>
                  navigate(`/stations/${station.id}`, { state: { station } })
                }
              >
                상세보기
              </button>
              <button
                type="button"
                onClick={() => handleAddToMyStations(station)}
              >
                My Stations에 추가
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {stations.length > 0 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            이전
          </button>
          <span style={{ margin: "0 8px" }}>페이지 {page}</span>
          <button onClick={() => setPage((p) => p + 1)}>다음</button>
        </div>
      )}
    </section>
  );
}

export default StationListPage;