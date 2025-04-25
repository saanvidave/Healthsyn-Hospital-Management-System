import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
          In 2025, our team embarked on a mission to revolutionize healthcare management by
          developing a comprehensive Hospital Management System (HMS) utilizing the MERN
          stack—MongoDB, Express.js, React, and Node.js.
          Our objective is to streamline hospital operations,
          enhance patient care, and improve administrative efficiency through innovative technology.
          </p>
          <p>We are all in 2025!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
          We believe that coding is not just a profession 
          but a passion that drives innovation. 
          Through our dedication to technology and healthcare, 
          we aspire to create solutions that not only meet the current demands of hospital management 
          but also anticipate future challenges in the healthcare industry.
          </p>
          <p>Have a great day ahead!</p>
          <p>Coding is fun!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
