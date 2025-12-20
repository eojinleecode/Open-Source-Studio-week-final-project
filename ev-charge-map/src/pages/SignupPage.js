import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({ userId: "", password: "", nickname: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.userId === formData.userId)) return alert("이미 존재하는 아이디입니다.");
    if (users.find(u => u.nickname === formData.nickname)) return alert("이미 존재하는 닉네임입니다.");

    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));
    alert("회원가입이 완료되었습니다! 로그인해주세요.");
    navigate("/login");
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="아이디" required onChange={e => setFormData({...formData, userId: e.target.value})} />
          <input type="password" placeholder="비밀번호" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <input type="text" placeholder="닉네임" required onChange={e => setFormData({...formData, nickname: e.target.value})} />
          <button type="submit" className="primary-button" style={{width: '100%'}}>가입하기</button>
        </form>
      </div>
    </section>
  );
}

export default SignupPage;