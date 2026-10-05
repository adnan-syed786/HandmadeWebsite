import React from 'react';
import { Link } from 'react-router-dom';
import './CraftStory.css';

function CraftStory() {
  return (
    <section className="craft-story" aria-labelledby="story-heading">
      <div className="craft-story-image"><img src="/Images/update.jpg" alt="Artisan arranging handmade crafts" loading="lazy" /></div>
      <div className="craft-story-copy">
        <p className="section-kicker">Made with meaning</p>
        <h2 id="story-heading">The Story Behind <span>ORION</span></h2>
        <p>ORICON brings handmade craftsmanship into a modern shopping experience, making it easier to find objects with a story and a sense of place.</p>
        <ul>
          <li><i className="bx bx-check" /> Traditional techniques, thoughtfully carried forward</li>
          <li><i className="bx bx-check" /> Artisan stories behind every collection</li>
          <li><i className="bx bx-check" /> Materials chosen for beauty and everyday use</li>
        </ul>
        <Link to="/about" className="story-button">Discover Our Story <i className="bx bx-right-arrow-alt" /></Link>
      </div>
    </section>
  );
}

export default CraftStory;
