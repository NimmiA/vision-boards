import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <i className="fas fa-bars"></i>
        <span>Note</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-link"></i>
        <span>Link</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-tasks"></i>
        <span>To-do</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-pen"></i>
        <span>Draw</span>
      </div>
      <div className="sidebar-item">
        <i className="fas fa-plus"></i>
        <span>Board</span>
      </div>
    </div>
  );
}

export default Sidebar; 