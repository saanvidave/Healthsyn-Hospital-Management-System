import React, { useState } from 'react';
import './NotificationBell.css';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotification = (type) => {
    switch (type) {
      case 'yellow':
        setNotification('Request of appointment pending');
        break;
      case 'red':
        setNotification('Appointment rejected due to unavailability of doctor');
        break;
      case 'green':
        setNotification('Appointment Accepted');
        break;
      default:
        setNotification('');
    }
  };

  return (
    <div className="notification-container">
      <div className="bell-icon" onClick={toggleDropdown}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-buttons">
            <button 
              className="notification-btn yellow" 
              onClick={() => handleNotification('yellow')}
            ></button>
            <button 
              className="notification-btn red" 
              onClick={() => handleNotification('red')}
            ></button>
            <button 
              className="notification-btn green" 
              onClick={() => handleNotification('green')}
            ></button>
          </div>
          
          <div className="notification-content">
            {notification && <p>{notification}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;