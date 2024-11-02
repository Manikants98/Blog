import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import signupValidator from "../validators/signupValidator";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialFormError = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = signupValidator({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (
      errors.name ||
      errors.email ||
      errors.password ||
      errors.confirmPassword
    ) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        // API request
        const requestBody = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
        const response = await axios.post("/auth/signup", requestBody);
        const data = response.data;

        // Show success toast
        toast.success(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000, // Closes after 3 seconds (you can adjust)
        });

        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
        navigate("/login")
      } catch (error) {
        setloading(false);
        setFormError(initialFormError);
        const response = error.response;
        const data = response ? response.data : { message: "An error occurred" };

        // Show error toast
        toast.error(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="form-container">
      <form className="inner-container" onSubmit={handleSubmit}>
        <h2 className="form-title">Signup Form</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Ravi Sharma"
            value={formData.name}
            onChange={handleChange}
          />
          {formError.name && <p className="error">{formError.name}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            placeholder="abc@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {formError.email && <p className="error">{formError.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="***********"
            value={formData.password}
            onChange={handleChange}
          />
          {formError.password && <p className="error">{formError.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm password</label>
          <input
            className="form-control"
            type="password"
            name="confirmPassword"
            placeholder="***********"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formError.confirmPassword && (
            <p className="error">{formError.confirmPassword}</p>
          )}
        </div>

        <div className="form-group">
          <input
            className="button"
            type="submit"
            value={`${loading ? "Saving..." : "Signup"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;