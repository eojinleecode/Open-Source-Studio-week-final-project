import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* 1. 히어로 섹션: 시선을 사로잡는 메인 문구 */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge-tag">실시간 전기차 충전소 찾기</span>
          <h1>전기차 충전, <br/>이제 더 스마트하게</h1>
          <p>
            내 주변에서 가장 가까운 충전소를 실시간으로 확인하고,<br/>
            자주 방문하는 곳은 관심 목록으로 간편하게 관리하세요.
          </p>
          <div className="hero-btns">
            <button className="primary-button large" onClick={() => navigate("/stations")}>
              지금 충전소 찾기
            </button>
          </div>
        </div>
      </section>

      {/* 2. 특징 섹션: 서비스의 장점 요약 */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>실시간 위치 기반</h3>
          <p>공공 데이터를 활용해 전국 충전소 정보를 정확하게 제공합니다.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>관심 목록 관리</h3>
          <p>자주 가는 충전소는 My Stations에 담아 한눈에 확인하세요.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>지도 및 로드뷰</h3>
          <p>상세 페이지에서 실제 주변 환경을 미리 살펴볼 수 있습니다.</p>
        </div>
      </section>

      {/* 3. 푸터: 프로젝트 정보 */}
      <footer className="home-footer">
        <div className="footer-line"></div>
        <p className="university">Handong Global University</p>
        <p className="team-name">OpenSource Studio Team Project</p>
        <div className="members">
          <span><strong>21900393</strong> Shin, Dahun</span>
          <span><strong>22200543</strong> Lee, Eojin</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
