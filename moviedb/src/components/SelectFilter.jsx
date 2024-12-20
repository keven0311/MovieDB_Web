import React from "react";

const SelectFilter = ({ currentFilter, setCurrentFilter }) => {
  return (
    <div className="select-container">
      <select
        className="filter-select"
        value={currentFilter}
        onChange={(e) => setCurrentFilter(e.target.value)}
      >
        <option value="popular">Popular</option>
        <option value="now_playing">Now Playing</option>
        <option value="top_rated">Top Rated</option>
        <option value="upcoming">Upcoming</option>
      </select>
    </div>
  );
};

export default SelectFilter;
