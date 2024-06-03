import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <input
        className="input-field"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
      />
      <button className="submit-button" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
