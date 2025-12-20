import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMyStationsClick = (e) => {
    if (!user) {
      e.preventDefault(); // 기본 이동 막기
      if (window.confirm("로그인이 필요한 메뉴입니다. 로그인 페이지로 이동할까요?")) {
        navigate("/login");
      }
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">EV Charge Map</Link>
      <div className="nav-menu">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
        <Link to="/stations" className={`nav-link ${location.pathname === "/stations" ? "active" : ""}`}>Stations</Link>
        
        {/* onClick 핸들러 추가 */}
        <Link 
          to="/mystations" 
          onClick={handleMyStationsClick} 
          className={`nav-link ${location.pathname === "/mystations" ? "active" : ""}`}
        >
          My Stations
        </Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.nickname}님</span>
            <button className="nav-button" onClick={logout}>로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="nav-button">로그인</Link>
        )}  
      </div>
    </nav>
  );
}

export default Navbar;
