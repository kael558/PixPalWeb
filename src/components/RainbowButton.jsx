import React from 'react';

import styles from './RainbowButton.module.css';


const RainbowButton = ({ text, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
};


export default RainbowButton;
