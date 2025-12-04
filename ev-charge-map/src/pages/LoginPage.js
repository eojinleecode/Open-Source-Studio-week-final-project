import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [nickname, setNickname] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    login(nickname);
    navigate("/");
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <h2>로그인</h2>
        <p className="login-subtitle">
          회원가입 없이 닉네임만 입력하고 로그인할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            닉네임
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예) Hong GilDong"
            />
          </label>

          <button type="submit" className="primary-button" style={{ width: "100%" }}>
            로그인
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
