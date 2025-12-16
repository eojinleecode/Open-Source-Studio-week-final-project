import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import StationListPage from "./pages/StationListPage";
import StationDetailPage from "./pages/StationDetailPage";
import MyStationsPage from "./pages/MyStationsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stations" element={<StationListPage />} />
          <Route path="/stations/:id" element={<StationDetailPage />} />
          <Route path="/mystations" element={<MyStationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
