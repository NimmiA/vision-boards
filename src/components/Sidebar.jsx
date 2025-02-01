import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const sidebarItems = [
    {
      icon: 'fa-solid fa-bars',
      label: 'Note'
    },
    {
      icon: 'fa-solid fa-link',
      label: 'Link'
    },
    {
      icon: 'fa-solid fa-list-check',
      label: 'To-do'
    },
    {
      icon: 'fa-solid fa-pen',
      label: 'Draw'
    },
    {
      icon: 'fa-solid fa-plus',
      label: 'Board'
    }
  ];

  return (
    <div className="sidebar">
      {sidebarItems.map((item, index) => (
        <div key={index} className="sidebar-item">
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 