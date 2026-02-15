import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCartBackend } from "../redux/cartSlice"; // ✅ UPDATED

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
import ProductGrid from "../components/Productgrid";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get auth state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const payment_img = "../src/assets/Payment_img/payment-methods.png";

  // ✅ Dynamic size selection
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const [tabValue, setTabValue] = useState("1");
  const details = productDetails[0];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ✅ Handle size selection
  const handleSizeSelect = (sizeOption) => {
    setSelectedSize(sizeOption);
    setCurrentPrice({
      original: sizeOption.originalPrice,
      sale: sizeOption.salePrice,
    });
  };

  // For img hover effects
  const handleZoom = (e) => {
    const img = e.currentTarget.querySelector(".zoom-img");
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(2)";
  };

  const resetZoom = (e) => {
    const img = e.currentTarget.querySelector(".zoom-img");
    img.style.transformOrigin = "center center";
    img.style.transform = "scale(1)";
  };

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`products/${id}`);
        setProduct(res.data);

        // ✅ Auto-select first size
        if (res.data.sizes && res.data.sizes.length > 0) {
          const defaultSize = res.data.sizes[0];
          setSelectedSize(defaultSize);
          setCurrentPrice({
            original: defaultSize.originalPrice,
            sale: defaultSize.salePrice,
          });
        }
      } catch (err) {
        setError("Failed to load product: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Fetch related products
  useEffect(() => {
    const fetchRelatedProd = async () => {
      try {
        const relProd = await api.get("/products");
        setRelatedProduct(relProd.data);
      } catch (error) {
        console.log("Error fetching related products:", error.message);
      }
    };
    fetchRelatedProd();
  }, []);

  // ✅ Handle Add to Cart - Sends to BACKEND
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setAddingToCart(true);

    try {
      // ✅ Dispatch async thunk to add to backend
      await dispatch(
        addToCartBackend({
          productId: product._id,
          selectedSize: {
            dimension: selectedSize.dimension,
            originalPrice: selectedSize.originalPrice,
            salePrice: selectedSize.salePrice,
          },
          qty: 1,
        }),
      ).unwrap();

      alert(`✅ Added "${product.title}" (${selectedSize.dimension}) to cart!`);
    } catch (error) {
      alert(`❌ ${error}`);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!product) return <p className="text-center">Product not found</p>;

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center mb-5">
        <div className="col-md-6">
          <div
            className="zoom-container rounded shadow-sm"
            onMouseMove={handleZoom}
            onMouseLeave={resetZoom}
          >
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid zoom-img"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="section-1 mb-5">
            <h2>{product.title}</h2>
            <p className="text-muted">{product.category}</p>

            {/* ✅ Show current pricing */}
            {currentPrice && (
              <div className="d-flex gap-2 align-items-center">
                <h3 className="fw-bold my-3 text-muted text-decoration-line-through">
                  <span>
                    <FaRupeeSign />
                  </span>
                  {currentPrice.original.toLocaleString("en-IN")}
                </h3>
                <span>
                  <FaMinus />
                </span>
                <h3 className="fw-bold my-3 text-success">
                  <span>
                    <FaRupeeSign />
                  </span>
                  {currentPrice.sale.toLocaleString("en-IN")}
                </h3>
                <span>
                  <LuAmpersand />
                  <span> Free Shipping</span>
                </span>
              </div>
            )}

            {/* ✅ Show savings */}
            {currentPrice && (
              <p className="text-success fw-bold">
                You save: ₹
                {(currentPrice.original - currentPrice.sale).toLocaleString(
                  "en-IN",
                )}
              </p>
            )}

            <p>{product.description}</p>

            {/* ✅ Size selection */}
            <div className="my-3">
              <h6 className="mb-2 fw-bold">Select Frame Size:</h6>
              {product.sizes &&
                product.sizes.map((sizeOption, ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => handleSizeSelect(sizeOption)}
                    className={`btn btn-sm me-3 px-3 mb-2 ${
                      selectedSize?.dimension === sizeOption.dimension
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {sizeOption.dimension}
                  </button>
                ))}
            </div>

            {/* ✅ Selected size info */}
            {selectedSize && (
              <div className="alert alert-info py-2">
                <small>
                  <strong>Selected Size:</strong> {selectedSize.dimension} |
                  <strong> Price:</strong> ₹
                  {selectedSize.salePrice.toLocaleString("en-IN")}
                </small>
              </div>
            )}

            {/* ✅ Action buttons */}
            <button
              className="btn-in px-4 py-2"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            {/* <button >Buy Now</button> */}
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
          <TabList
            onChange={handleTabChange}
            sx={{
              // Default tab styling
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                color: "#555",
                transition: "all 0.3s ease",

                // 🔥 Hover effect
                "&:hover": {
                  color: "#852b28",
                  backgroundColor: "rgba(133,43,40,0.08)",
                },
              },

              // ✅ Active tab
              "& .Mui-selected": {
                color: "#852b28 !important",
              },

              // 📌 Indicator (underline)
              "& .MuiTabs-indicator": {
                backgroundColor: "#852b28",
                height: "3px",
                borderRadius: "3px",
              },
            }}
          >
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

        {/* Additional Info */}
        <TabPanel value="2">
          <div className="container mt-4">
            <h4 className="fw-bold mb-3">Available Sizes & Pricing</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="bg-light">Dimension</th>
                  <th className="bg-light">Original Price</th>
                  <th className="bg-light">Sale Price</th>
                  <th className="bg-light">You Save</th>
                </tr>
              </thead>
              <tbody>
                {product.sizes &&
                  product.sizes.map((size, ind) => (
                    <tr key={ind}>
                      <td className="fw-bold">{size.dimension}</td>
                      <td className="text-muted text-decoration-line-through">
                        ₹{size.originalPrice.toLocaleString("en-IN")}
                      </td>
                      <td className="text-success fw-bold">
                        ₹{size.salePrice.toLocaleString("en-IN")}
                      </td>
                      <td className="text-danger fw-bold">
                        ₹
                        {(size.originalPrice - size.salePrice).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

        {/* REVIEWS TAB */}
        <TabPanel value="3">
          <div className="card section-1 p-5">
            <form action="">
              <div className="row section-1">
                <div className="col-md-6">
                  <h4>Be the first to review "{product.title}"</h4>
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
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Save my name, email, and website in this browser for the
                      next time I comment.
                    </label>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="btn-in mt-3 py-1 px-4 fw-bold"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </TabPanel>
      </TabContext>

      <div>
        <h1 className="fw-bold section-1">Related Products</h1>
        <ProductGrid products={relatedProduct} limit={3} />
      </div>
    </div>
  );
};

export default ProductDetail;
