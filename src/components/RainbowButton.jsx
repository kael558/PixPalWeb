import React from 'react';
import './RainbowButton.css'; // Assume your styles are saved here

const RainbowButton = ({ text, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
};


export default RainbowButton;
