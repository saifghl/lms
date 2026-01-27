import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { addProject, getProjectLocations } from "../../services/api";
import { indianCities } from "../../utils/indianLocations";
import "./AddProject.css";

const AddProject = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    project_name: "",
    location: "",
    address: "",
    project_type: "",
    total_floors: "",
    total_project_area: "",
    description: "",
  });

  const [locations, setLocations] = useState([]);
  const [image, setImage] = useState(null);

  /* ================= FETCH DATA ================= */
  useState(() => {
    const fetchLocations = async () => {
      try {
        const response = await getProjectLocations();
        // Seed with all Indian cities from utility
        const fetched = response.data || [];
        const unique = [...new Set([...indianCities, ...fetched])].sort();
        setLocations(unique);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        // Fallback to just Indian cities if API fails
        setLocations(indianCities);
      }
    };
    fetchLocations();
  }, []);



  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isOtherLocation, setIsOtherLocation] = useState(false);

  const handleLocationChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsOtherLocation(true);
      setFormData(prev => ({ ...prev, location: "" }));
    } else {
      setIsOtherLocation(false);
      setFormData(prev => ({ ...prev, location: val }));
    }
  };

  /* ================= HANDLE IMAGE ================= */
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const [submitMessage, setSubmitMessage] = useState('');

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // append image only if selected
      if (image) {
        data.append("image", image);
      }

      await addProject(data);

      setSubmitMessage('Project created successfully');
      setTimeout(() => navigate("/admin/projects"), 2000);
    } catch (error) {
      console.error("Add project error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to add project";
      alert(`Failed to add project: ${errorMessage}`);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <div className="add-project-container">
          <div className="project-form-card">

            {/* HEADER */}
            <div className="form-header">
              <div className="header-titles">
                <h2>Add New Project</h2>
                <p>Enter the details for the new lease project.</p>
              </div>
              <Link to="/admin/projects" className="close-btn">✕</Link>
            </div>

            {/* FORM */}
            <form className="project-form" onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  {!isOtherLocation ? (
                    <select
                      className="form-control" // Assuming basic styling or inherit input styles
                      value={locations.includes(formData.location) ? formData.location : "Other"}
                      onChange={handleLocationChange}
                      required
                    >
                      <option value="" disabled>Select Location</option>
                      {locations.map((loc, index) => (
                        <option key={index} value={loc}>{loc}</option>
                      ))}
                      <option value="Other">Other...</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter custom location"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsOtherLocation(false)}
                        style={{ padding: '0 10px', whiteSpace: 'nowrap', border: '1px solid #ccc', background: '#f1f1f1', cursor: 'pointer', borderRadius: '4px' }}
                      >
                        Back to List
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="RETAIL/SHOP">RETAIL/SHOP</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed Use">Mixed Use</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Floors</label>
                  <input
                    type="number"
                    name="total_floors"
                    value={formData.total_floors}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Total Project Area</label>
                  <input
                    type="text"
                    name="total_project_area"
                    value={formData.total_project_area}
                    onChange={handleChange}
                    placeholder="sqft"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div className="upload-section">
                <label>Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {submitMessage && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', fontWeight: '500' }}>
                  {submitMessage}
                </div>
              )}

              <div className="form-footer">
                <button type="submit" className="create-btn">
                  + Create Project
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProject;
