import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-left">
        <span className="nav-brand">EV Charge Map</span>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/stations" className="nav-link">
          Stations
        </NavLink>
        <NavLink to="/mystations" className="nav-link">
          My Stations
        </NavLink>
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">👤 {user.name}</span>
            <button className="nav-button" onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">
            로그인
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;
