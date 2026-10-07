import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  subscribeUpdates: false
};

// Returns { score: 0-4, label }
const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: pw ? labels[score] : '' };
};

const validate = (f) => {
  const errors = {};

  if (f.name.trim().length < 2) errors.name = 'Enter your full name.';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'Enter a valid email address.';

  const digits = f.phoneNumber.replace(/[\s\-+()]/g, '').replace(/^91/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phoneNumber = 'Enter a valid 10-digit mobile number.';

  if (!f.dateOfBirth) {
    errors.dateOfBirth = 'Select your date of birth.';
  } else {
    const dob = new Date(f.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old.';
    if (age > 120) errors.dateOfBirth = 'Enter a valid date of birth.';
  }

  if (!f.gender) errors.gender = 'Select an option.';

  if (f.address.trim().length < 5) errors.address = 'Enter your house number and street.';
  if (f.city.trim().length < 2) errors.city = 'Enter your city.';
  if (!f.state) errors.state = 'Select your state.';
  if (!/^[1-9]\d{5}$/.test(f.zipCode)) errors.zipCode = 'Enter a valid 6-digit PIN code.';

  if (f.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  } else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) {
    errors.password = 'Include at least one letter and one number.';
  }

  if (f.password !== f.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  if (!f.acceptTerms) errors.acceptTerms = 'Accept the terms to continue.';

  return errors;
};

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const strength = getPasswordStrength(formData.password);

  // Latest date a user can select (must be 18+)
  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = type === 'checkbox' ? checked : value;

    // Keep numeric fields clean
    if (name === 'zipCode') next = next.replace(/\D/g, '').slice(0, 6);

    setFormData((prev) => ({ ...prev, [name]: next }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fix the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.replace(/[\s\-()]/g, ''),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address.trim(),
        addressLine2: formData.addressLine2.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        password: formData.password,
        subscribeUpdates: formData.subscribeUpdates
      });

      setSuccess('🎉 Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Network error or email already registered. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name, extra = '') =>
    `input-group ${extra} ${fieldErrors[name] ? 'has-error' : ''}`.trim();

  const FieldError = ({ name }) =>
    fieldErrors[name] ? <span className="field-error">{fieldErrors[name]}</span> : null;

  return (
    <div className="full-screen-container">
      <div className="signup-container">
        <div className="signup-title">
          <h1>Create Account</h1>
          <p>Your E-commerce Adventure Starts Here</p>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}
        {success && <div className="success-message" role="status">{success}</div>}

        <form onSubmit={handleSubmit} className="signup-grid" noValidate>
          {/* ---------- Personal details ---------- */}
          <h2 className="section-heading">Personal details</h2>

          <div className={fieldClass('name', 'full-width')}>
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" autoComplete="name" value={formData.name}
              onChange={handleChange} required placeholder="Rajesh Kumar" />
            <FieldError name="name" />
          </div>

          <div className={fieldClass('email')}>
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" name="email" autoComplete="email" value={formData.email}
              onChange={handleChange} required placeholder="rajesh.kumar@example.com" />
            <FieldError name="email" />
          </div>

          <div className={fieldClass('phoneNumber')}>
            <label htmlFor="phoneNumber">Mobile Number</label>
            <input id="phoneNumber" type="tel" name="phoneNumber" autoComplete="tel" value={formData.phoneNumber}
              onChange={handleChange} required placeholder="+91 98765 43210" />
            <FieldError name="phoneNumber" />
          </div>

          <div className={fieldClass('dateOfBirth')}>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" type="date" name="dateOfBirth" autoComplete="bday" max={maxDob}
              value={formData.dateOfBirth} onChange={handleChange} required />
            <FieldError name="dateOfBirth" />
          </div>

          <div className={fieldClass('gender')}>
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            <FieldError name="gender" />
          </div>

          {/* ---------- Delivery address ---------- */}
          <h2 className="section-heading">Delivery address</h2>

          <div className={fieldClass('address', 'full-width')}>
            <label htmlFor="address">Address Line 1</label>
            <input id="address" name="address" autoComplete="address-line1" value={formData.address}
              onChange={handleChange} required placeholder="House no., building, street" />
            <FieldError name="address" />
          </div>

          <div className={fieldClass('addressLine2', 'full-width')}>
            <label htmlFor="addressLine2">Address Line 2 <span className="optional">(optional)</span></label>
            <input id="addressLine2" name="addressLine2" autoComplete="address-line2" value={formData.addressLine2}
              onChange={handleChange} placeholder="Area, landmark" />
          </div>

          <div className={fieldClass('city')}>
            <label htmlFor="city">City</label>
            <input id="city" name="city" autoComplete="address-level2" value={formData.city}
              onChange={handleChange} required placeholder="Mumbai" />
            <FieldError name="city" />
          </div>

          <div className={fieldClass('state')}>
            <label htmlFor="state">State / UT</label>
            <select id="state" name="state" autoComplete="address-level1" value={formData.state}
              onChange={handleChange} required>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <FieldError name="state" />
          </div>

          <div className={fieldClass('zipCode')}>
            <label htmlFor="zipCode">PIN Code</label>
            <input id="zipCode" name="zipCode" inputMode="numeric" autoComplete="postal-code"
              value={formData.zipCode} onChange={handleChange} required placeholder="400001" />
            <FieldError name="zipCode" />
          </div>

          <div className="input-group">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" value={formData.country} readOnly className="readonly" />
          </div>

          {/* ---------- Security ---------- */}
          <h2 className="section-heading">Security</h2>

          <div className={fieldClass('password')}>
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input id="password" type={showPassword ? 'text' : 'password'} name="password"
                autoComplete="new-password" value={formData.password} onChange={handleChange}
                required placeholder="At least 8 characters" />
              <button type="button" className="toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && (
              <div className="strength" aria-live="polite">
                <div className="strength-bar">
                  <span className={`strength-fill level-${strength.score}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }} />
                </div>
                <small>{strength.label}</small>
              </div>
            )}
            <FieldError name="password" />
          </div>

          <div className={fieldClass('confirmPassword')}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type={showPassword ? 'text' : 'password'} name="confirmPassword"
              autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange}
              required placeholder="Re-enter password" />
            <FieldError name="confirmPassword" />
          </div>
          <div className="signup-button-wrapper">
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;