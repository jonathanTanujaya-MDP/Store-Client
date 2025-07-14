import React from 'react';
import './Card.css';

const Card = ({ title, value, icon: Icon, onClick }) => {
  return (
    <div className="card-container" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div>
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
      </div>
      <div className="card-icon-wrapper">
        <Icon className="card-icon" />
      </div>
    </div>
  );
};

export default Card;