import React from 'react';
import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fab-button"
    >
      <Plus className="fab-icon" />
    </button>
  );
};

export default FloatingActionButton;