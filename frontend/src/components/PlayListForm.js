import React, { useState } from 'react';
import axios from 'axios';

const PlaylistForm = ({ fetchPlaylists }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:8000/api/playlists/', {
      name,
      is_public: isPublic,
    }, {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });

    if (response.status === 201) {
      alert('Playlist created successfully');
      fetchPlaylists(); // Refresh playlists
    } else {
      alert('Failed to create playlist');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Playlist Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Public:
          <input 
            type="checkbox" 
            checked={isPublic} 
            onChange={(e) => setIsPublic(e.target.checked)} 
          />
        </label>
      </div>
      <button type="submit">Create Playlist</button>
    </form>
  );
};

export default PlaylistForm;
