import React, { useState } from "react";
import "./Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };
  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div>
        <p className="section-kicker">A little note from ORICON</p>
        <h2 id="newsletter-heading">
          Stay Connected With <span>ORICON</span>
        </h2>
        <p>
          Get updates about new collections, handmade stories and special
          offers.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="homepage-email">
          Email address
        </label>
        <input
          id="homepage-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubscribed(false);
          }}
          placeholder="Your email address"
          required
        />
        <button type="submit">
          Subscribe <i className="bx bx-right-arrow-alt" />
        </button>
        {subscribed && <small>Thanks, you are on the list.</small>}
      </form>
    </section>
  );
}

export default Newsletter;
