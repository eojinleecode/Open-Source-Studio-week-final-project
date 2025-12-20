import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(u => u.userId === userId && u.password === password);

    if (foundUser) {
      login(foundUser); // 닉네임으로 로그인 세션 유지
      navigate("/");
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="아이디" value={userId} onChange={e => setUserId(e.target.value)} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="primary-button" style={{width: '100%'}}>로그인</button>
          <p style={{textAlign:'center', marginTop: '16px', fontSize: '14px'}}>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
