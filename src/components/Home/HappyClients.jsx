// import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

const HappyClients = () => {
  const testimonials = [
    {
      name: "Diana Burnwood",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Lectus, nonummy et. Occaecat delectus erat, minima dapibus ornare nunc, autem.",
    },
    {
      name: "John Carter",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Outstanding service. Clear communication and excellent delivery.",
    },
    {
      name: "Sophia Lee",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Very professional experience from start to finish.",
    },
  ];
  const client_img1 = "../src/assets/client_img/cli-1.png";
  const client_img2 = "../src/assets/client_img/cli-2.png";
  const client_img3 = "../src/assets/client_img/cli-3.png";
  const client_img4 = "../src/assets/client_img/cli-4.png";
  const client_img5 = "../src/assets/client_img/cli-5.png";
  return (
    <>
      <div className="section-1 container my-5 py-5 ">
        {/* Header */}
        <h2 className="section-1 text-center fs-1 fw-bold mb-2">
          Our Happy Clients!
        </h2>
        <hr className="section-divider mx-auto mb-5" />

        {/* Testimonials */}
        <div className="section-1 container my-5 py-5 ">
          <div className="row g-4 justify-content-center">
            {testimonials.map((item, index) => (
              <div key={index} className="col-12 col-md-4">
                <div className="section-1 card border-0 shadow-sm rounded-5 h-100 p-4">
                  <Typography
                    component="legend"
                    sx={{ fontSize: 13, color: "inherit" }}
                  />

                   <Rating name="disabled" disabled />

                  <p className="mt-3 mb-4">“{item.text}”</p>

                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="rounded-circle"
                      width="56"
                      height="56"
                    />
                    <h6 className="mb-0 fw-semibold">{item.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Featured In  */}
        <div className="d-md-flex align-items-center justify-content-between client-logos">
            <h5 className="section-1 fw-bold">Featured In:</h5>
          <img src={client_img1} alt="client 1" />
          <img src={client_img2} alt="client 2" />
          <img src={client_img3} alt="client 3" />
          <img src={client_img4} alt="client 4" />
          <img src={client_img5} alt="client 5" />
        </div>
      </div>
    </>
  );
};

export default HappyClients;
