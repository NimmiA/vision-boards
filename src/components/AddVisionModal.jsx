import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddVisionModal.css';

const AddVisionModal = ({ onClose, onAdd }) => {
  const [vision, setVision] = useState({
    title: '',
    type: 'text',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(vision);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVision({ ...vision, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add New Vision</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={vision.title}
              onChange={e => setVision({ ...vision, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={vision.type}
              onChange={e => setVision({ ...vision, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          {vision.type === 'image' && (
            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Vision</button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddVisionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default AddVisionModal; 