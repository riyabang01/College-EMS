import { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gallery`);
        console.log('✅ Fetched Gallery Data:', data);
        setImages(data.images);
      } catch (error) {
        console.error('❌ Failed to fetch gallery:', error);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div>
      <h2>Gallery</h2>
      <div>
        {images.length > 0 ? (
          images.map((image) => (
            <img key={image._id} src={`${process.env.REACT_APP_BACKEND_URL}${image.imageUrl}`} alt="Gallery" />
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
