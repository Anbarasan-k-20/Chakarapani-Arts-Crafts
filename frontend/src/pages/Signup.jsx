import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signup", formData);

      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
