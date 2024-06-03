import React, { useState } from 'react';
import axios from 'axios';
import './PlayListForm.css';

const PlaylistForm = ({ fetchPlaylists }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      is_public: isPublic,
    };

    // Debugging statement
    console.log('Sending data:', data);

    try {
      const response = await axios.post('http://localhost:8000/api/playlists/', data, {
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
    } catch (error) {
      // Debugging statement
      console.error('Error response:', error.response);
      alert('Failed to create playlist');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="background">
            <div>
                <label>
                    Playlist Name:
                    <input 
                        className="input-field"
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
                        className="input-field" 
                        type="checkbox" 
                        checked={isPublic} 
                        onChange={(e) => setIsPublic(e.target.checked)} 
                    />
                </label>
            </div>
            <button className="submit-btn" type="submit">Create Playlist</button> 
        </div>
    </form>
  );
};

export default PlaylistForm;
