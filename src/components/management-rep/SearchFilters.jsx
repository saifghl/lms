import React, { useEffect, useState } from "react";
import RepSidebar from "./RepSidebar";
// import { managementAPI } from "../../services/api"; // Search API not fully Impl yet
import "./SearchFilters.css";

const SearchFilters = () => {
  // const [results, setResults] = useState([]);
  const [results] = useState([]); // Fixed: Removed unused setResults

  useEffect(() => {
    // managementAPI.searchData().then((res) => setResults(res.data));
  }, []);

  return (
    <div className="search-filters-container">
      <RepSidebar />
      <main className="search-filters-content">
        <h2>Search Results</h2>

        <table className="results-table">
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SearchFilters;
