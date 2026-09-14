import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChooseImg = () => {
    inputRef.current.click();
  };

  return (
    <div className="d-flex justify-content-center mb-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="d-none"
      />

      {!previewUrl ? (
        <div className="position-relative">
          <div
            className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-secondary"
            style={{ width: '80px', height: '80px' }}
          >
            <LuUser size={40} />
          </div>
          <button
            type="button"
            className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '30px', height: '30px' }}
            onClick={handleChooseImg}
          >
            <LuUpload size={15} className="text-white" />
          </button>
        </div>
      ) : (
        <div className="position-relative">
          <img
            src={previewUrl}
            alt="profile"
            className="rounded-circle object-fit-cover border"
            style={{ width: '80px', height: '80px' }}
          />
          <button
            type="button"
            className="btn btn-danger rounded-circle position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '30px', height: '30px' }}
            onClick={handleRemoveImage}
          >
            <LuTrash size={15} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;