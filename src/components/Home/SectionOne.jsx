import FeaturedProducts from "./FeaturedProducts";
import { PiGreaterThan } from "react-icons/pi";
// img exports
const vishnu = "../src/assets/vishnu-828x1024.png";
const img_1 = "../src/assets/section-2/img-1.jpg";
const img_2 = "../src/assets/section-2/img-2.jpg";
const img_3 = "../src/assets/section-2/img-3.jpg";

const SectionOne = () => {
  return (
    <>
      <div className="navbar container-fluid">
        <section className="container">
          <div className="section-1 row align-items-center px-5 pb-0">
            {/* LEFT CONTENT */}
            <div className="col-md-6 mb-md-5">
              <hr className="section-divider" />
              <h4 className="fw-semibold pt-2 ">
                Celebrating Tradition Through Craft
              </h4>
              <h1 className="fw-bold display-5 pt-2">Exquisite </h1>
              <h1 className="fw-bold display-5 pt-2">Craftsmanship,</h1>
              <h1 className="fw-bold display-5 pt-2">Timeless Traditions!!</h1>

              <p className="mt-3 w-75">
                Celebrating the rich legacy of Tanjore paintings and traditional
                Indian crafts, honored with prestigious national awards.
              </p>

              <button className="btn-in px-4 py-2 mt-3">Get Started <span><PiGreaterThan/></span></button>
            </div>
            {/* RIGHT IMAGE */}
            <div className="col-md-6 text-center">
              <img
                src={vishnu}
                alt="art"
                className="img-fluid p-0 m-0"
                style={{
                  maxHeight: "650px",
                  position: "relative",
                  right: "20px",
                  top: "10px",
                }}
              />
            </div>
          </div>
        </section>
      </div>
      {/* section 2 starts here */}

      <div className="section-1 container py-5 my-5">
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <div>
                <img src={img_1} className="desgn-img" alt="" />
              </div>
              <span className="mt-2">Most Loved Designs</span>
              <h5 className="text-center w-75 fw-bold">
                Ganesha(Vinayagar) Tanjore Painting
              </h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <span className="mt-2">Design of the Week</span>
              <h5 className="text-center w-75 fw-bold">
                Lord Balaji Tanjore Painting
              </h5>
              <div>
                <img src={img_2} className="desgn-img" alt="" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
              <div>
                <img src={img_3} className="desgn-img" alt="" />
              </div>
              <span className="mt-2">
                A Divine Creation, Crafted to Inspire
              </span>
              <h5 className="text-center w-75 fw-bold">
                Thiruchendur Murugan Tanjore Painting.
              </h5>
            </div>
          </div>
        </div>
      </div>
      {/* section -3 starts here */}
      <FeaturedProducts />
    </>
  );
};

export default SectionOne;
