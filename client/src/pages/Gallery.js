import { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);

  const baseURL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/gallery`);
        setImages(data.images);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      }
    };

    fetchGallery();
  }, [baseURL]);

  return (
    <div>
      <h2>Gallery</h2>
      <div>
        {images.length > 0 ? (
          images.map((image) => (
            <img 
              key={image._id} 
              src={`${baseURL}${image.imageUrl.startsWith('/uploads') ? image.imageUrl : `/uploads/\${image.imageUrl}`}`} 
              alt="Gallery" 
            />
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
