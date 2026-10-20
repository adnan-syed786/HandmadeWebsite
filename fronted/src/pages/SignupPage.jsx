import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignupPage.css";
import { z } from "zod";

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

// Keep all signup validation in one schema so the form and submit handler share the same rules.
const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."),
    phoneNumber: z.string().refine(
      (value) =>
        /^[6-9]\d{9}$/.test(
          value.replace(/[\s\-+()]/g, "").replace(/^91/, "")
        ),
      "Enter a valid 10-digit mobile number."
    ),
    gender: z.string().min(1, "Select an option."),
    address: z.string().trim().min(5, "Enter your house number and street."),
    addressLine2: z.string(),
    city: z.string().trim().min(2, "Enter your city."),
    state: z.string().min(1, "Select your state."),
    zipCode: z
      .string()
      .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code."),
    country: z.string(),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Za-z]/, "Include at least one letter and one number.")
      .regex(/\d/, "Include at least one letter and one number."),
    confirmPassword: z.string().min(1, "Passwords do not match."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: "", success: "" });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: INITIAL_FORM,
    // Zod supplies field errors to React Hook Form through the resolver.
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });
  const password = watch("password", "");
  const strength = passwordStrength(password);

  const submit = async (data) => {
    setMessage({ error: "", success: "" });
    setLoading(true);
    try {
      const signupData = { ...data };
      delete signupData.confirmPassword;
      await signup({
        ...signupData,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: data.phoneNumber.replace(/[\s\-()]/g, ""),
        address: data.address.trim(),
        addressLine2: data.addressLine2.trim(),
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
      {...register(name)}
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

        <form
          onSubmit={handleSubmit(submit, () =>
            setMessage({ error: "Please fix the highlighted fields.", success: "" })
          )}
          className="signup-grid"
          noValidate
        >
          <h2 className="section-heading">Personal details</h2>
          <Field name="name" label="Full Name" error={errors.name?.message} fullWidth>
            {input("name", {
              autoComplete: "name",
              placeholder: "Rajesh Kumar",
            })}
          </Field>
          <Field name="email" label="Email Address" error={errors.email?.message}>
            {input("email", {
              type: "email",
              autoComplete: "email",
              placeholder: "rajesh.kumar@example.com",
            })}
          </Field>
          <Field
            name="phoneNumber"
            label="Mobile Number"
            error={errors.phoneNumber?.message}
          >
            {input("phoneNumber", {
              type: "tel",
              autoComplete: "tel",
              placeholder: "+91 98765 43210",
            })}
          </Field>
          <Field name="gender" label="Gender" error={errors.gender?.message}>
            <select
              id="gender"
              {...register("gender")}
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
            error={errors.address?.message}
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
          <Field name="city" label="City" error={errors.city?.message}>
            {input("city", {
              autoComplete: "address-level2",
              placeholder: "Mumbai",
            })}
          </Field>
          <Field name="state" label="State / UT" error={errors.state?.message}>
            <select
              id="state"
              {...register("state")}
            >
              <option value="">Select state</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>
          <Field name="zipCode" label="PIN Code" error={errors.zipCode?.message}>
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
          <Field name="password" label="Password" error={errors.password?.message}>
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
            {password && (
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
            error={errors.confirmPassword?.message}
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
