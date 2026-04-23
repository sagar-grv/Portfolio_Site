import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Achievements from "../components/Achievements";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import AIBand from "../components/AIBand";
import Reveal from "../components/Reveal";

const Portfolio = () => {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <main>
        <Hero />
        <AIBand />
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Skills />
        </Reveal>
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Achievements />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Portfolio;
