import { useState } from 'react';
import Tokens from './TokensBar';

import { useAuth } from '../../hooks/useAuth';

function Toolbar({ showLoginUI, showTokensPanel }) {
  const auth = useAuth();

  // State to manage the visibility of the hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the menu's visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'flex-end', // Align children to the right
        alignItems: 'center', // Align children vertically in the middle
        padding: '10px',
      }}
    >
     
      <div style={{ margin: '10px', cursor: 'pointer', color: "white", fontSize: "32px" }} onClick={toggleMenu}>
        ☰
      </div>
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
           <Tokens showTokensPanel={showTokensPanel} />
          {auth.is_authenticated ? (
            <button
              onClick={auth.logout}
              style={{
                marginTop: '10px',
                padding: '8px 20px',
                borderRadius: '5px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={showLoginUI}
              style={{
                marginTop: '10px',
                padding: '8px 20px',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Toolbar;
