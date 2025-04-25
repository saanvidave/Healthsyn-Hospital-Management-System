import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Bell } from "lucide-react";
import "./NotificationBell.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();
  const goToLogin = () => navigateTo("/login");

  const handleNotificationClick = (color) => {
    if (color === "yellow") {
      setNotificationMessage("Request of appointment pending");
    } else if (color === "red") {
      setNotificationMessage("Appointment rejected due to unavailability of doctor");
    } else if (color === "green") {
      setNotificationMessage("Appointment Accepted");
    }
  };

  return (
    <>
      <nav className="container">
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>

        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to="/" onClick={() => setShow(false)}>Home</Link>
            <Link to="/appointment" onClick={() => setShow(false)}>Appointment</Link>
            <Link to="/about" onClick={() => setShow(false)}>About Us</Link>
          </div>

          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>LOGOUT</button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>LOGIN</button>
          )}

          <div className="notification-wrapper">
            <Bell className="bell-icon" onClick={() => setDropdownVisible(!dropdownVisible)} />

            {dropdownVisible && (
              <div className="notification-dropdown">
                <div className="notification-buttons">
                  <button className="notification-btn yellow" onClick={() => handleNotificationClick("yellow")}></button>
                  <button className="notification-btn red" onClick={() => handleNotificationClick("red")}></button>
                  <button className="notification-btn green" onClick={() => handleNotificationClick("green")}></button>
                </div>
                <div className="notification-content">
                  {notificationMessage ? (
                    <p>{notificationMessage}</p>
                  ) : (
                    <p>Select a notification type</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;