import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <section>
        <h1>00000000 Da hun Sin</h1>
        <h1>22200543 Eo Jin Lee</h1>
        <h1>Team Project</h1>
      <h2>EV Charge Map</h2>
      <p>
        This service helps EV drivers find nearby charging stations and manage
        their own favorite station list.
      </p>
      <p>
        We use a public Open API for real EV charging station data and a REST
        API (MockAPI) for CRUD operations.
      </p>
      <button className="primary-button" onClick={() => navigate("/stations")}>
        Find Charging Stations
      </button>
    </section>
  );
}

export default HomePage;
