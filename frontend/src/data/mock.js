// Mock data for Sagar Gurav's portfolio
// This file centralizes all content so backend integration is seamless later.

export const profile = {
  name: "Sagar Gurav",
  handle: "sagar-grv",
  role: "AI / ML Engineer",
  tagline: "Building intelligent systems that solve real problems.",
  summary:
    "Innovative AI and Machine Learning Engineer with a passion for web development. I build predictive models, computer-vision pipelines and GenAI agents using Python and TensorFlow, and ship fast, user-friendly web experiences that turn data into decisions.",
  location: "Shirpur, India",
  availability: "Open to internships & collaborations",
  email: "sagargurav1812@gmail.com",
  resumeUrl: "#",
  socials: {
    github: "https://github.com/sagar-grv",
    linkedin: "https://www.linkedin.com/in/sagargrv/",
    instagram: "https://www.instagram.com/sagar_grv/",
    medium: "https://medium.com/@sagargurav1812",
    email: "mailto:sagargurav1812@gmail.com",
  },
};

export const stats = [
  { label: "Projects shipped", value: "12+" },
  { label: "Students mentored", value: "200+" },
  { label: "Model accuracy peak", value: "89%" },
  { label: "Workshops organised", value: "4" },
];

export const skills = [
  {
    category: "Machine Learning",
    items: [
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "PyTorch",
      "CNN",
      "NLP",
      "Computer Vision",
      "Generative AI",
      "OpenCV",
    ],
  },
  {
    category: "Languages",
    items: ["Python", "JavaScript", "C++", "R", "SQL", "HTML5", "CSS3", "Liquid"],
  },
  {
    category: "Data & Analytics",
    items: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Plotly",
      "Power BI",
      "EDA",
      "MySQL",
      "Neo4j",
    ],
  },
  {
    category: "Tools & Cloud",
    items: [
      "Git",
      "GitHub",
      "Streamlit",
      "VS Code",
      "Google Cloud",
      "Firebase",
      "Vercel",
      "Render",
      "Docker",
    ],
  },
];

export const projects = [
  {
    id: "person-reid",
    title: "Person Re-Identification System",
    kind: "Deep Learning · Computer Vision",
    period: "Mar 2026 — Apr 2026",
    description:
      "Deep learning pipeline that extracts 512-dimensional embeddings and matches people across camera feeds with 89% accuracy. Ships with a real-time web app processing 30+ frames per second.",
    highlights: [
      "89% re-identification accuracy",
      "512-D feature embeddings",
      "Real-time web app @ 30+ FPS",
    ],
    stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "React"],
    repo: "https://github.com/sagar-grv",
    demo: "#",
    accent: "lime",
  },
  {
    id: "bankassist",
    title: "BankAssist Enterprise",
    kind: "GenAI · Multi-Agent Systems",
    period: "Feb 2026 — Mar 2026",
    description:
      "A smart banking chatbot built on Google Gemini that automates 85% of routine customer support queries. Agent orchestration + caching reduced API calls by 66% and wait times by 40%.",
    highlights: [
      "85% queries automated",
      "66% reduction in API calls",
      "40% faster response time",
    ],
    stack: ["Python", "Gemini API", "LangChain", "FastAPI", "Streamlit"],
    repo: "https://github.com/sagar-grv",
    demo: "#",
    accent: "amber",
  },
  {
    id: "deepfake",
    title: "Deepfake Detection System",
    kind: "Computer Vision · CNN",
    period: "Oct 2025 — Nov 2025",
    description:
      "CNN-based detector trained on 10,000+ media files to spot manipulated images and videos with 85% accuracy. Surfaces frame-level anomalies and confidence scores.",
    highlights: [
      "85% detection accuracy",
      "10,000+ training samples",
      "Frame-level anomaly maps",
    ],
    stack: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy"],
    repo: "https://github.com/sagar-grv",
    demo: "#",
    accent: "cyan",
  },
  {
    id: "ayush-synapse",
    title: "Ayush Synapse",
    kind: "Healthcare AI · Data Integration",
    period: "Sep 2025 — Oct 2025",
    description:
      "Bridges traditional AYUSH medicine data with modern EHR systems for 500+ patient profiles. Integrates NAMASTE and ICD-11 coding standards for safe cross-database sharing.",
    highlights: [
      "500+ patient profiles linked",
      "NAMASTE + ICD-11 mapping",
      "FHIR-ready exchange",
    ],
    stack: ["Python", "Flask", "MongoDB", "Neo4j", "HTML5"],
    repo: "https://github.com/sagar-grv/ayush-synapse",
    demo: "#",
    accent: "rose",
  },
];

export const experience = [
  {
    role: "Shopify Web Developer Intern",
    org: "Freelance / Agency",
    period: "Dec 2025 — Feb 2026",
    points: [
      "Built and optimised e-commerce storefronts that load 40% faster and run smoother on mobile.",
      "Used analytics to help 5+ online stores improve Google ranking and retain customers.",
      "Implemented custom Liquid sections, performance budgets and A/B variants.",
    ],
  },
  {
    role: "Google Student Ambassador — College Coordinator",
    org: "Google",
    period: "Jul 2025 — Jul 2026",
    points: [
      "Taught 200+ students the fundamentals of Google Cloud, Gemini and modern AI tooling.",
      "Organised 4 major workshops and hackathons around GenAI and cloud.",
      "Led a campus-wide tech community with weekly builder sessions.",
    ],
  },
];

export const education = [
  {
    school: "SVKM'S NMIMS MPSTME, Shirpur",
    degree: "B.Tech, Artificial Intelligence & Machine Learning",
    period: "Jul 2023 — Present",
    detail: "CGPA 2.89 / 4.0 · Class of 2027",
  },
  {
    school: "Indirapuram Public School",
    degree: "Senior Secondary (Class XII)",
    period: "Apr 2022 — Apr 2023",
    detail: "82.83% — Science stream",
  },
  {
    school: "Indirapuram Public School",
    degree: "Secondary (Class X)",
    period: "Apr 2020 — Apr 2021",
    detail: "87.20%",
  },
];

export const certifications = [
  {
    name: "AI Agents Intensive Course",
    issuer: "Kaggle × Google",
    year: "2025",
  },
  {
    name: "Generative AI Mastermind",
    issuer: "Outskill",
    year: "2025",
  },
  {
    name: "SIH 2025 — Internal Hackathon Finalist",
    issuer: "Smart India Hackathon",
    year: "2025",
  },
  {
    name: "EY Techathon 6.0 — Certificate of Appreciation",
    issuer: "Ernst & Young",
    year: "2025",
  },
];

export const achievements = [
  "SIH 2025 Internal Hackathon — Finalist Team",
  "89% accuracy in Person Re-Identification benchmark",
  "Automated 85% of routine support queries with GenAI agents",
  "Mentored 200+ students on Google Cloud & AI",
  "Organised 4 major workshops and hackathons",
  "Trained a deepfake detector on 10,000+ media files",
];

// Terminal code block used in the Hero section
export const heroTerminal = {
  title: "~/sagar/about.py",
  lines: [
    { t: "comment", v: "# whoami" },
    { t: "code", v: "engineer = {" },
    { t: "code", v: '  "name": "Sagar Gurav",' },
    { t: "code", v: '  "focus": ["GenAI", "Computer Vision", "Web"],' },
    { t: "code", v: '  "stack": ["Python", "TensorFlow", "React"],' },
    { t: "code", v: '  "status": "building",' },
    { t: "code", v: "}" },
    { t: "comment", v: "# run(engineer)  →  ships shippable AI" },
  ],
};
