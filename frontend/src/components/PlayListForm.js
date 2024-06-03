import React, { useState } from 'react';
import axios from 'axios';
import './PlayListForm.css';

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
      fetchPlaylists(); 
    } else {
      alert('Failed to create playlist');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="background">
        <div>
          <label>
            Playlist Name:
            <input 
              class="input-field"
              type="text" 
              placeholder='playlist name'
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
              class="input-field"
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            />
          </label>
        </div>
        <button class="submit-btn" type="submit">Create Playlist</button>
      </div>
    </form>
  );
};

export default PlaylistForm;
