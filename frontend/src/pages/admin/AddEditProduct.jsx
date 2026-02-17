import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        image: "",
        price: "",
        description: "",
        stock: 0,
        rating: 0,
        sizes: [], // Array of { dimension, originalPrice, salePrice }
    });

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            const product = res.data;
            // Ensure sizes is an array
            setFormData({
                ...product,
                sizes: product.sizes || [],
            });
        } catch (error) {
            alert("Failed to fetch product details");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Size Changes
    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = value;
        setFormData({ ...formData, sizes: newSizes });
    };

    // ✅ Add New Size Row
    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { dimension: "", originalPrice: "", salePrice: "" }],
        });
    };

    // ✅ Remove Size Row
    const removeSize = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Auto-calculate display price from lowest size price if sizes exist
        let payload = { ...formData };
        if (payload.sizes && payload.sizes.length > 0) {
            // Find lowest sale price
            const lowestPrice = Math.min(...payload.sizes.map(s => Number(s.salePrice) || Infinity));
            if (lowestPrice !== Infinity) {
                payload.price = lowestPrice;
            }
        }

        try {
            if (isEditMode) {
                await api.put(`/admin/products/${id}`, payload);
                alert("Product updated successfully");
            } else {
                await api.post("/admin/products", payload);
                alert("Product created successfully");
            }
            navigate("/admin/products");
        } catch (error) {
            alert("Failed to save product");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0">
                        <div className="card-body p-5">
                            <h3 className="section-1 fw-bold mb-4">
                                {isEditMode ? "Edit Product" : "Add New Product"}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Base Price (₹) <small className="text-muted">(Auto-updated from sizes)</small></label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* ✅ SIZE MANAGEMENT SECTION */}
                                <div className="mb-4 border p-3 rounded bg-light">
                                    <label className="form-label fw-bold">Product Sizes & Pricing</label>
                                    {formData.sizes.map((size, index) => (
                                        <div key={index} className="row g-2 align-items-end mb-2">
                                            <div className="col-md-3">
                                                <label className="small text-muted">Dimensions</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 12x12"
                                                    className="form-control form-control-sm"
                                                    value={size.dimension}
                                                    onChange={(e) => handleSizeChange(index, "dimension", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="small text-muted">Original Price</label>
                                                <input
                                                    type="number"
                                                    placeholder="₹"
                                                    className="form-control form-control-sm"
                                                    value={size.originalPrice}
                                                    onChange={(e) => handleSizeChange(index, "originalPrice", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="small text-muted">Sale Price</label>
                                                <input
                                                    type="number"
                                                    placeholder="₹"
                                                    className="form-control form-control-sm"
                                                    value={size.salePrice}
                                                    onChange={(e) => handleSizeChange(index, "salePrice", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm w-100"
                                                    onClick={() => removeSize(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm mt-2"
                                        onClick={addSize}
                                    >
                                        + Add Size Variant
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        className="form-control"
                                        value={formData.image}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={formData.stock}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Rating</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            className="form-control"
                                            value={formData.rating}
                                            onChange={handleChange}
                                            min="0"
                                            max="5"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    {isEditMode ? "Update Product" : "Create Product"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditProduct;
