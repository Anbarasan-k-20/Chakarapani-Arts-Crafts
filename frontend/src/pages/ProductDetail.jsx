import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//for icons
import { LuAmpersand } from "react-icons/lu";
import { FaMinus, FaRupeeSign } from "react-icons/fa";

// for MUI TabIndex styling
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Rating from "@mui/material/Rating";

// import dummy data

import productDetails from "../dummyData/productData.json";

const ProductDetail = () => {
  const { id } = useParams(); // dynamic product id from URL
  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const payment_img = "../src/assets/Payment_img/payment-methods.png";
  //for Frame size
  const sizes = ['24" x 12"', '20" x 9"'];
  const [selectedSize, setSelectedSize] = useState(null);

  const [tabValue, setTabValue] = useState("1");
  const details = productDetails[0]; // using first product

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProd = async () => {
      try {
        const relProd = await axios.get("https://fakestoreapi.com/products");
        setRelatedProduct(relProd.data);
        console.log(relProd.data);
      } catch (error) {
        console.log("from Fetch related products  ", error.message);
        setError("Error at Related Product fetch" + error.message);
      }
    };
    fetchRelatedProd();
  }, []);
  console.log(productDetails);

  // for related products

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-7">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-5">
          <div className="section-1 mb-5">
            <h2>{product.title}</h2>
            <p className="text-muted">{product.category}</p>
            <div className="d-flex gap-2 align-items-center">
              <h3 className="fw-bold my-3">
                <span>
                  <FaRupeeSign />
                </span>
                {product.price}
              </h3>{" "}
              <span>
                <FaMinus />
              </span>
              <h3 className="fw-bold my-3">
                <span>
                  <FaRupeeSign />
                </span>
                {product.price}
              </h3>
              <span>
                <LuAmpersand />
                <span> Free Shipping</span>
              </span>
            </div>
            <p>{product.description}</p>
            {/* Frame Size Selection */}
            <div className="my-3">
              {sizes.map((el, ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setSelectedSize(el)}
                  className={`btn btn-sm me-3 px-3 ${
                    selectedSize === el ? "btn-dark" : "btn-outline-secondary"
                  }`}
                >
                  {el}
                </button>
              ))}

              {/* Clear Button */}
              {selectedSize && (
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm ms-2"
                  onClick={() => setSelectedSize(null)}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Section */}
            {selectedSize && (
              <div className="d-flex gap-2 align-items-center my-2">
                <h5 className="text-muted text-decoration-line-through mb-0">
                  <FaRupeeSign /> {product.price + 500}
                </h5>
                <h4 className="fw-bold mb-0">
                  <FaRupeeSign /> {product.price}
                </h4>
              </div>
            )}
            {/* <h4>{product.description}</h4> */}
            <button className="btn btn-outline-secondary me-3">
              Add to Cart
            </button>
            <button className="btn-in px-4 py-2">Buy Now</button>
          </div>
          <div className="card">
            <h5 className="text-center fw-bold my-4">
              Guaranteed Safe Checkout
            </h5>
            <img
              src={payment_img}
              alt="Payment Methods"
              className="payment-img"
            />
          </div>
        </div>
      </div>
      <hr />
      {/* Tabs section */}
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange}>
            <Tab label="Description" value="1" />
            <Tab label="Additional Info" value="2" />
            <Tab label="Reviews" value="3" />
          </TabList>
        </Box>

        {/* DESCRIPTION TAB */}
        <TabPanel value="1">
          <div className="section-1">
            <h3 className="fw-bold mb-3">{details.title}</h3>
            <p>{details.description}</p>

            <h3 className="fw-bold mt-4">Features of the Painting</h3>
            <ul className="mt-3">
              {details.features.map((item, index) => (
                <li key={index} className="mb-2">
                  <strong>{item.title}:</strong>
                  <p className="mt-2">{item.description}</p>
                </li>
              ))}
            </ul>

            {/* ADDITIONAL INFO TAB */}

            {/*     {item.description}   */}
            <h3 className="fw-bold">Symbolism & Significance</h3>

            {details.symbolism.map((item, index) => (
              <li key={index} className="mb-2 mx-4">
                <strong>{item.title}:</strong>
                <p className="mt-2">{item.description}</p>
              </li>
            ))}

            <h3 className="fw-bold mt-4">Ideal Placement</h3>
            <ul>
              {details.idealPlacement.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>

            <h3 className="fw-bold mt-4">Care Instructions</h3>
            <ul>
              {details.careInstructions.map((care, index) => (
                <li key={index}>{care}</li>
              ))}
            </ul>
          </div>
        </TabPanel>

        <TabPanel value="2">
          <div className="container mt-4">
            <table className="table table-bordered w-auto">
              <tbody>
                <tr>
                  <th className="bg-light text-start px-4 py-2">Dimensions</th>
                  {sizes.map((el, ind) => (
                    <td key={ind} className="px-4 py-2 section-1">
                      {el}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        {/* REVIEWS / RELATED PRODUCTS TAB */}
        <TabPanel value="3">
          <div className="card section-1 p-5">
            <form action="">
              <div className="row section-1">
                <div className="col-md-6">
                  <h4>
                    Be the first to review “Yanai Lakshmi Tanjore Painting”
                  </h4>
                  <p className="py-2">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <div className="d-flex gap-2">
                    <p>Your Rating*</p>
                    <Rating name="simple-controlled" />
                  </div>
                </div>
                <div>
                  <h5>Your Review</h5>
                  <textarea
                    name="review"
                    id="review"
                    className="form-control w-100"
                    rows={3}
                  />
                </div>
                <div className="col-md-6 my-2">
                  <p className="mt-2">Name</p>
                  <input type="text" className="form-control py-3" />
                </div>
                <div className="col-md-6 my-2">
                  <p className="mt-2">Email</p>
                  <input type="email" className="form-control py-3" />
                </div>
                <div className="col-md-8 mt-3">
                  <div class="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" for="flexCheckDefault">
                      Save my name, email, and website in this browser for the
                      next time I comment.
                    </label>
                  </div>
                  <button onClick={(e)=>{e.preventDefault()}} className="btn-in mt-3 py-1 px-4 fw-bold">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </TabPanel>
      </TabContext>
      <div>
        <h1 className="fw-bold section-1">Related Products</h1>
        <div className="row g-4 my-3">
          {relatedProduct.slice(0, 3).map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-3">
              <div
                className="card h-100 product-card"
                role="button"
                tabIndex={0}
              >
                {/* Badge */}
                <span
                  className="badge bg-light text-dark position-absolute px-2 py-2"
                  style={{ top: "15px", left: "15px", zIndex: 1 }}
                >
                  Sale
                </span>
                {/* Image */}
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = "/fallback.png";
                  }}
                />

                {/* Body */}
                <div className="card-body">
                  <h6 className="card-title text-truncate">{product.title}</h6>

                  <div className="d-flex gap-3 align-items-center">
                    <p className="fw-bold text-muted text-decoration-line-through mb-1">
                      <FaRupeeSign /> {product.price}
                    </p>
                    <p className="fw-bold mb-1">
                      <FaRupeeSign /> {product.price}
                    </p>
                  </div>

                  <button
                    className="btn btn-outline-dark btn-sm mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Added "${product.title}" to cart`);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
