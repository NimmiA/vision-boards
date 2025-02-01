import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './VisionCard.css';

const VisionCard = ({ title, image, type, backgroundColor, onRemove }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className={`vision-card ${type}`} 
      style={{ backgroundColor: backgroundColor }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      
      {showControls && (
        <div className="card-controls">
          <button 
            className="remove-button" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );
};

VisionCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  type: PropTypes.oneOf(['image', 'quote', 'text']).isRequired,
  backgroundColor: PropTypes.string,
  onRemove: PropTypes.func.isRequired
};

VisionCard.defaultProps = {
  backgroundColor: '#ffffff'
};

export default VisionCard; 