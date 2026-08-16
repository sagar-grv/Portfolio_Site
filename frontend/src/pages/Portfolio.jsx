import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const Portfolio = () => (
  <div className="portfolio-page">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Header />
    <main id="main-content">
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </main>
    <Footer />
    <Chatbot />
  </div>
);

export default Portfolio;
