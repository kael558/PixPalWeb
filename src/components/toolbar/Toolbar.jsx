import { useState, useEffect } from 'react';
import Tokens from './TokensBar';

import { useAuth } from '../../hooks/useAuth';
import { Button, Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";

function Toolbar({ showLoginUI, showTokensPanel, streamManager, setMessages }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, isAnonymous } = useAuth();

  const handleLogout = () => {
    if (isAuthenticated() && isAnonymous()) {
      setOpen(true);
      return;
    }

    doLogout();
  };

  const resetMessages = () => {
    // delete messages from localstorage
    localStorage.removeItem('messages');
    setMessages([]);
  }

  const doLogout = () => {
    logout();
    setMenuOpen(false);
  };


  const [menuOpen, setMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(streamManager.isMuted());

  useEffect(() => {
    streamManager.setMuted(isMuted);
  }, [isMuted, streamManager]);

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
      <div style={{ margin: '10px', cursor: 'pointer', color: "white", fontSize: "32px" }} onClick={() => streamManager.stop()}>
        ⏸️
      </div>
      <div style={{ margin: '10px', cursor: 'pointer', color: "white", fontSize: "32px" }} onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? '🔇' : '🔊'}
      </div>
      <div style={{ margin: '10px', cursor: 'pointer', color: "white", fontSize: "32px" }} onClick={toggleMenu}>
        ☰
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        getPersistentElements={() => document.querySelectorAll(".Toastify")}
        backdrop={<div className="backdrop" />}
        className="dialog"
      >
        <DialogHeading className="heading">Warning</DialogHeading>
        <p className="description">
          You are currently logged in as a guest. You will lose all your data if you log out. Are you sure you want to log out?
        </p>
        <div className="buttons">
          <Button className="button" onClick={doLogout}>
            Logout
          </Button>
          <DialogDismiss className="button secondary">Cancel</DialogDismiss>
        </div>
      </Dialog>

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
          {isAuthenticated() && (
              <button
              onClick={handleLogout}
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
          )}

          {(!isAuthenticated() || isAnonymous()) && (
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

          <button onClick={resetMessages} style={{ marginTop: '10px', padding: '8px 20px', borderRadius: '5px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}>
            Reset Messages
          </button>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
