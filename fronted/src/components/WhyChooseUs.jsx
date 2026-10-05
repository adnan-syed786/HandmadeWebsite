import React from 'react';
import './WhyChooseUs.css';

const reasons = [
  ['bx bx-hand', '100% Handmade', 'Crafted with care'],
  ['bx bx-group', 'Artisan Crafted', 'Supporting skilled makers'],
  ['bx bx-sparkles', 'Unique Designs', 'No two pieces are exactly alike'],
  ['bx bx-badge-check', 'Thoughtful Quality', 'Selected with care']
];

function WhyChooseUs() {
  return (
    <section className="why-section" aria-labelledby="why-heading">
      <div className="why-heading"><p className="section-kicker">The orion difference</p><h2 id="why-heading">Why Choose <span>ORION?</span></h2></div>
      <div className="why-grid">
        {reasons.map(([icon, title, text]) => <article className="why-card" key={title}><i className={icon} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}

export default WhyChooseUs;
