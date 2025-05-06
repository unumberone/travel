import React from "react";
import '../styles/about.css';
import f1 from '../assets/images/business-travel.png';
import f2 from '../assets/images/travel-agent.png';   
import f3 from '../assets/images/sp.png';    
import f4 from '../assets/images/web.png';     


const About = () => {
  return (
  <div className="about-page">
    <div className="about-container">
    <div className="background-overlay"></div> {/* Ảnh nền */}
    
    <div className="content">
      <h1>About us</h1>
      <p>We believe traveling to another city should be more than easy.</p>
    </div>
    </div>
    {/* Feature icons */}
    <div className="features">
        <div className="feature">
          <img src={f1} alt="Convenient" />
          <h4>Convenient</h4>
          <p>Door-to-door service</p>
        </div>
        <div className="feature">
          <img src={f2} alt="Friendly" />
          <h4>Friendly</h4>
          <p>English-speaking drivers</p>
        </div>
        <div className="feature">
          <img src={f3} alt="Enriching" />
          <h4>Enriching</h4>
          <p>Sightseeing stops</p>
        </div>
        <div className="feature">
          <img src={f4} alt="Comfortable" />
          <h4>Comfortable</h4>
          <p>Clean & modern cars</p>
        </div>
      </div>

      {/* Description */}
      <div className="description">
        <p>
          Daytrip was founded in 2015 because we knew there had to be a better way to travel between cities than public transport. 
          So we came up with a better option: door-to-door rides in a private car with professional, English-speaking drivers...
        </p>
        <p>
          Over the years, our network of 10k+ drivers has helped over 1m+ people transform their travel day into a holiday...
        </p>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat highlight">4.9/5<span>Overall customer rating</span></div>
        <div className="stat">Endless<span>Cities and sights</span></div>
        <div className="stat">1m+<span>Happy travelers</span></div>
        <div className="stat">24/7<span>Customer support</span></div>
        <div className="stat">10k+<span>Helpful drivers</span></div>
        <div className="stat">130+<span>Countries around the globe</span></div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        <img src="/images/timeline.png" alt="Company timeline" />
      </div>

      {/* Footer description */}
      <div className="footer-description">
        <p>
          With the ability to book a ride in 130+ countries on one platform, Daytrip is the easiest and most convenient way to find transportation...
        </p>
      </div>
  </div>
  
  );
};

export default About;
