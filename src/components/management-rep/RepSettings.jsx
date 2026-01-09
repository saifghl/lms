import React, { useEffect, useState } from "react";
import RepSidebar from "./RepSidebar";
import { getProfile, updateProfile } from "../../services/managementApi";
import "./RepSettings.css";

const RepSettings = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  const saveProfile = () => {
    updateProfile(profile).then(() => alert("Profile Updated"));
  };

  return (
    <div className="rep-settings-container">
      <RepSidebar />
      <main className="rep-settings-content">
        <input
          value={profile.firstName || ""}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />
        <button onClick={saveProfile}>Save</button>
      </main>
    </div>
  );
};

export default RepSettings;
