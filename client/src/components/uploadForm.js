import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UploadForm = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setUploading(true);

    try {
      const { data } = await axios.post('/api/gallery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`, // ✅ Send token
        },
      });

      alert('✅ Image uploaded successfully!');
      onUploadSuccess(); // ✅ Refresh gallery
    } catch (error) {
      console.error('❌ Upload Error:', error);
      alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
      setImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
