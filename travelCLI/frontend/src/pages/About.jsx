import React, { useState } from "react";
import '../styles/about.css';
import f1 from '../assets/images/business-travel.png';
import f2 from '../assets/images/travel-agent.png';   
import f3 from '../assets/images/sp.png';    
import f4 from '../assets/images/web.png';     
import anh from '../assets/images/anh.jpg'; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
  {
    question: "Who can become a Daytrip Partner?",
    answer:
      "Anyone involved in transportation services or travel-related experiences — including professional drivers, local tour guides, and sightseeing providers — can become a Daytrip Partner. We welcome individuals and businesses who are passionate about offering quality, safe, and enriching travel experiences to international and domestic travelers alike.",
  },
  {
    question: "What kind of services can I offer?",
    answer:
      "Daytrip supports a wide range of services including intercity transfers, airport pickups, sightseeing stops, and curated experiences along travel routes. You can offer single-day or multi-day tours, multilingual guide services, or even specialized experiences like food tours, hiking trips, or cultural immersions, depending on your region and expertise.",
  },
  {
    question: "How do I register to become a partner?",
    answer:
      "To register, simply visit our official partner portal and complete the application form with your business or personal details. After submission, our team will review your profile and reach out for verification. If you meet the criteria, we will assist you with onboarding, training, and activating your profile on the platform so you can begin receiving bookings.",
  },
  {
    question: "What are the benefits of partnering with Daytrip?",
    answer:
      "As a Daytrip Partner, you'll gain access to a global customer base, reliable payouts, dedicated support, and marketing visibility. Our platform simplifies booking and communication, allowing you to focus on delivering exceptional service. Additionally, you'll receive real-time updates, driver ratings, and performance reports to help you grow sustainably.",
  },
  {
    question: "Do I need to speak English to become a partner?",
    answer:
      "While English proficiency is not mandatory, it is highly recommended, especially for partners interacting directly with international travelers. Daytrip values clear communication for customer satisfaction and safety, and English is the preferred language on our platform. For drivers or guides with limited English, translation support or bilingual assistance may be considered.",
  },
  {
    question: "What kind of vehicle or equipment do I need?",
    answer:
      "For transportation partners, a clean, modern, and well-maintained vehicle is required. Depending on the region, this could be a sedan, van, SUV, or even a minibus. Vehicles must meet safety regulations, be insured, and offer comfort features such as air conditioning. For experience providers, any tools, equipment, or permits needed to operate safely and legally must be in place.",
  },
  {
    question: "How are prices and payments handled?",
    answer:
      "Daytrip uses a transparent pricing model. You set your base rates during onboarding, and Daytrip may apply modest platform fees. Payments from travelers are processed securely through our system and are disbursed to you on a weekly basis. You can track all your transactions, earnings, and payout schedules via your partner dashboard.",
  },
  {
    question: "Can I customize my tour offerings?",
    answer:
      "Absolutely. You can add sightseeing stops, offer optional experiences, or tailor packages for special occasions such as honeymoons, business trips, or family travel. Customization helps you stand out and receive better ratings. Just ensure any additional services are clearly listed with accurate pricing and availability.",
  },
  {
    question: "How does Daytrip ensure safety and quality?",
    answer:
      "We screen all partners during onboarding and conduct regular quality checks based on traveler feedback. Partners are expected to maintain professional conduct, punctuality, and hygiene standards. We also provide safety guidelines and require insurance coverage to ensure a secure and reliable service for every journey.",
  },
  {
    question: "What support is available to partners?",
    answer:
      "Daytrip offers 24/7 partner support via chat and email, covering everything from technical issues to customer-related concerns. We also provide marketing materials, platform tutorials, and account assistance. Our local operations teams may offer on-ground support in major regions to ensure a smooth experience for both you and your guests.",
  },
];


  return (
    <div className="about-page">
      {/* Background banner */}
      <div className="about-container">
        <div className="background-overlay"></div>
        <div className="content">
          <h1>About us</h1>
          <p>We believe traveling to another city should be more than easy.</p>
        </div>
      </div>

      {/* Features */}
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
        <img src={anh} alt="Company timeline" />
      </div>

      {/* Footer description */}
      <div className="footer-description">
        <p>
          With the ability to book a ride in 130+ countries on one platform, Daytrip is the easiest and most convenient way to find transportation...
        </p>
      </div>

      {/* FAQ section */}
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <span className="faq-icon">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
