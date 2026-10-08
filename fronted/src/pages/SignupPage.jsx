import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignupPage.css";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
  password: "",
  confirmPassword: "",
};

const validate = (form) => {
  const errors = {};
  const phone = form.phoneNumber.replace(/[\s\-+()]/g, "").replace(/^91/, "");
  if (form.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phoneNumber = "Enter a valid 10-digit mobile number.";
  }
  if (!form.gender) errors.gender = "Select an option.";
  if (form.address.trim().length < 5) {
    errors.address = "Enter your house number and street.";
  }
  if (form.city.trim().length < 2) errors.city = "Enter your city.";
  if (!form.state) errors.state = "Select your state.";
  if (!/^[1-9]\d{5}$/.test(form.zipCode)) {
    errors.zipCode = "Enter a valid 6-digit PIN code.";
  }
  if (form.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = "Include at least one letter and one number.";
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
};

const passwordStrength = (password) => {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  return {
    score,
    label: ["Too weak", "Weak", "Fair", "Good", "Strong"][score],
  };
};

function Field({ name, label, error, fullWidth = false, children }) {
  return (
    <div
      className={`input-group ${fullWidth ? "full-width" : ""} ${error ? "has-error" : ""}`}
    >
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });

  const maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    .toISOString()
    .split("T")[0];
  const strength = passwordStrength(form.password);

  const updateField = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "zipCode" ? value.replace(/\D/g, "").slice(0, 6) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage({ error: "", success: "" });
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setMessage({ error: "Please fix the highlighted fields.", success: "" });
      return;
    }

    setLoading(true);
    try {
      const signupData = { ...form };
      delete signupData.confirmPassword;
      await signup({
        ...signupData,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.replace(/[\s\-()]/g, ""),
        address: form.address.trim(),
        addressLine2: form.addressLine2.trim(),
      });
      setMessage({
        error: "",
        success: "🎉 Account created and login successful! Redirecting...",
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage({
        error:
          error?.response?.data?.message ||
          "Network error or email already registered. Please try again.",
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const input = (name, options = {}) => (
    <input
      id={name}
      name={name}
      value={form[name]}
      onChange={updateField}
      required={options.required !== false}
      {...options}
    />
  );

  return (
    <div className="full-screen-container">
      <div className="signup-container">
        <header className="signup-title">
          <h1>Create Account</h1>
          <p>Your E-commerce Adventure Starts Here</p>
        </header>

        {message.error && (
          <div className="error-message" role="alert">
            {message.error}
          </div>
        )}
        {message.success && (
          <div className="success-message" role="status">
            {message.success}
          </div>
        )}

        <form onSubmit={submit} className="signup-grid" noValidate>
          <h2 className="section-heading">Personal details</h2>
          <Field name="name" label="Full Name" error={errors.name} fullWidth>
            {input("name", {
              autoComplete: "name",
              placeholder: "Rajesh Kumar",
            })}
          </Field>
          <Field name="email" label="Email Address" error={errors.email}>
            {input("email", {
              type: "email",
              autoComplete: "email",
              placeholder: "rajesh.kumar@example.com",
            })}
          </Field>
          <Field
            name="phoneNumber"
            label="Mobile Number"
            error={errors.phoneNumber}
          >
            {input("phoneNumber", {
              type: "tel",
              autoComplete: "tel",
              placeholder: "+91 98765 43210",
            })}
          </Field>
          <Field name="gender" label="Gender" error={errors.gender}>
            <select
              name="gender"
              id="gender"
              value={form.gender}
              onChange={updateField}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>

          <h2 className="section-heading">Delivery address</h2>
          <Field
            name="address"
            label="Address Line 1"
            error={errors.address}
            fullWidth
          >
            {input("address", {
              autoComplete: "address-line1",
              placeholder: "House no., building, street",
            })}
          </Field>
          <Field
            name="addressLine2"
            label={
              <>
                Address Line 2 <span className="optional">(optional)</span>
              </>
            }
            fullWidth
          >
            {input("addressLine2", {
              autoComplete: "address-line2",
              placeholder: "Area, landmark",
              required: false,
            })}
          </Field>
          <Field name="city" label="City" error={errors.city}>
            {input("city", {
              autoComplete: "address-level2",
              placeholder: "Mumbai",
            })}
          </Field>
          <Field name="state" label="State / UT" error={errors.state}>
            <select
              name="state"
              id="state"
              value={form.state}
              onChange={updateField}
              required
            >
              <option value="">Select state</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field name="zipCode" label="PIN Code" error={errors.zipCode}>
            {input("zipCode", {
              inputMode: "numeric",
              autoComplete: "postal-code",
              placeholder: "400001",
            })}
          </Field>
          <Field name="country" label="Country">
            {input("country", { readOnly: true, className: "readonly" })}
          </Field>

          <h2 className="section-heading">Security</h2>
          <Field name="password" label="Password" error={errors.password}>
            <div className="password-wrapper">
              {input("password", {
                type: showPassword ? "text" : "password",
                autoComplete: "new-password",
                placeholder: "At least 8 characters",
              })}
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {form.password && (
              <div className="strength" aria-live="polite">
                <div className="strength-bar">
                  <span
                    className={`strength-fill level-${strength.score}`}
                    style={{ width: `${strength.score * 25}%` }}
                  />
                </div>
                <small>{strength.label}</small>
              </div>
            )}
          </Field>
          <Field
            name="confirmPassword"
            label="Confirm Password"
            error={errors.confirmPassword}
          >
            {input("confirmPassword", {
              type: showPassword ? "text" : "password",
              autoComplete: "new-password",
              placeholder: "Re-enter password",
            })}
          </Field>

          <div className="signup-button-wrapper">
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
