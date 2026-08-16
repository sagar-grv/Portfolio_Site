export const profile = {
  name: "Sagar Gurav",
  handle: "sagar-grv",
  role: "AI / ML Engineer",
  headline: "I build AI systems that move from experiment to useful product.",
  summary:
    "AI & ML engineering, agentic workflows, computer vision and data products—built with clear evidence, reliable software and thoughtful interfaces.",
  about:
    "I enjoy building systems where the model is only one part of the product. My work combines applied AI, data, backend engineering and clear interfaces so people can understand and use the result.",
  location: "Shirpur, India",
  availability: "Open to internships & collaborations",
  email: "sagargurav1812@gmail.com",
  socials: {
    github: "https://github.com/sagar-grv",
    linkedin: "https://www.linkedin.com/in/sagargrv/",
    medium: "https://medium.com/@sagargurav1812",
    email: "mailto:sagargurav1812@gmail.com",
  },
};

export const featuredProjects = [
  {
    id: "ai-testpilot-x",
    title: "AI TestPilot X",
    shortTitle: "AI TestPilot X",
    description:
      "Autonomous QA platform and CLI that turns a plain-English user story into a 10-agent test pipeline.",
    detail:
      "Generates test cases, executes browser workflows, analyses bugs and produces a release decision through a published Python package, CLI and Streamlit dashboard.",
    stack: ["Python", "LangGraph", "Playwright", "Pytest", "Streamlit"],
    proof: ["10-agent pipeline", "Published on PyPI", "Live dashboard + docs"],
    preview: "pipeline",
    links: [
      { label: "Live app", href: "https://ai-testpilot-x.streamlit.app/" },
      { label: "GitHub", href: "https://github.com/sagar-grv/ai-testpilot-x" },
    ],
  },
  {
    id: "healthvault",
    title: "HealthVault",
    shortTitle: "HealthVault",
    description:
      "AI-powered medical record management with 12-language interpretation and secure doctor sharing.",
    detail:
      "Patients can scan reports, receive plain-language explanations and share selected records through a Health ID, QR flow and access controls.",
    stack: ["Next.js", "Supabase", "Gemini", "PostgreSQL"],
    proof: ["12 Indian languages", "Patient + doctor flows", "RLS and audit logging"],
    preview: "health",
    links: [
      { label: "GitHub", href: "https://github.com/sagar-grv/healthvault" },
    ],
  },
  {
    id: "privatevoice-docs",
    title: "PrivateVoice Docs",
    shortTitle: "PrivateVoice Docs",
    description:
      "Local-first document intelligence for grounded chat with visible source excerpts.",
    detail:
      "The web PWA keeps documents in IndexedDB, performs retrieval locally and sends only selected excerpts to a user-chosen model. An Android client establishes the offline storage foundation.",
    stack: ["PWA", "IndexedDB", "Local retrieval", "Android"],
    proof: ["Local document index", "Visible source excerpts", "No project backend"],
    preview: "docs",
    links: [
      { label: "Live PWA", href: "https://sagar-grv.github.io/privatevoice-docs/" },
      { label: "GitHub", href: "https://github.com/sagar-grv/privatevoice-docs" },
    ],
  },
  {
    id: "clinical-trial-intelligence",
    title: "Clinical Trial Intelligence",
    shortTitle: "Clinical Trial Intelligence",
    description:
      "Human-in-the-loop clinical trial risk analysis with evidence-backed agentic assistance.",
    detail:
      "Combines deterministic quality rules, role-based views and AI-assisted explanations, comparison and drafting without replacing clinical judgment.",
    stack: ["Python", "Gemini", "SQLAlchemy", "Plotly"],
    proof: ["Evidence-backed rules", "Human approval gates", "Cross-study comparison"],
    preview: "clinical",
    links: [
      {
        label: "Live app",
        href: "https://agens-clinical-trial-intelligence-nest20.streamlit.app/",
      },
      {
        label: "GitHub",
        href: "https://github.com/sagar-grv/clinical-trial-intelligence-nest2.0",
      },
    ],
  },
  {
    id: "siamese-person-reid",
    title: "Siamese Person Re-ID",
    shortTitle: "Siamese Person Re-ID",
    description:
      "EfficientNet-B0 comparison of triplet and contrastive loss using 512-dimensional embeddings.",
    detail:
      "A Streamlit interface compares both models side by side, with GPU acceleration and automatic mixed precision for training and inference experiments.",
    stack: ["PyTorch", "OpenCV", "Streamlit", "AMP"],
    proof: ["Triplet vs contrastive loss", "512-D embeddings", "EfficientNet-B0"],
    preview: "reid",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/sagar-grv/Siamese-Person-ReID",
      },
    ],
  },
  {
    id: "uidai-analytics",
    title: "UIDAI Analytics",
    shortTitle: "UIDAI Analytics",
    description:
      "Forensic Aadhaar analytics using Benford's Law, Gini analysis and demand forecasting.",
    detail:
      "An interactive Streamlit command centre explores behavioural patterns, anomaly signals, infrastructure concentration and Random Forest demand forecasts.",
    stack: ["Python", "Streamlit", "Random Forest", "Plotly"],
    proof: ["Benford forensic audit", "Gini load analysis", "Demand simulator"],
    preview: "analytics",
    links: [
      { label: "GitHub", href: "https://github.com/sagar-grv/uidai-analytics" },
    ],
  },
];

export const experience = [
  {
    role: "Shopify Web Developer Intern",
    org: "Freelance / Agency",
    period: "Dec 2025 — Feb 2026",
    summary:
      "Built and optimized mobile-first storefronts, custom Liquid sections and performance-focused experiments.",
    points: [
      "Improved storefront load performance and mobile usability.",
      "Used analytics and iterative experiments across 5+ online stores.",
    ],
  },
  {
    role: "Google Student Ambassador — College Coordinator",
    org: "Google student community",
    period: "Jul 2025 — Jul 2026",
    summary:
      "Taught 200+ students and organised 4 workshops around Google Cloud, Gemini and practical AI.",
    points: [
      "Led campus sessions that translated AI tools into hands-on learning.",
      "Coordinated workshops, hackathons and recurring builder sessions.",
    ],
  },
];

export const education = [
  {
    school: "SVKM'S NMIMS MPSTME, Shirpur",
    degree: "B.Tech, Artificial Intelligence & Machine Learning",
    period: "Jul 2023 — Present",
    detail: "Class of 2027",
  },
];

export const capabilities = [
  {
    category: "AI Engineering",
    icon: "brain",
    items: ["LLMs & RAG", "Agentic workflows", "Computer vision", "Model evaluation"],
  },
  {
    category: "Data & Analytics",
    icon: "chart",
    items: ["Python & SQL", "Pandas", "Power BI", "Plotly"],
  },
  {
    category: "Product Engineering",
    icon: "code",
    items: ["React", "FastAPI", "Streamlit", "PostgreSQL"],
  },
  {
    category: "Quality & Delivery",
    icon: "shield",
    items: ["Pytest & Playwright", "Docker", "GitHub Actions", "Documentation"],
  },
];

export const highlights = [
  { value: "200+", label: "students taught" },
  { value: "4", label: "workshops organised" },
  { value: "12", label: "Indian languages in HealthVault" },
];

export const certifications = [
  { name: "AI Agents Intensive Course", issuer: "Kaggle × Google", year: "2025" },
  { name: "Generative AI Mastermind", issuer: "Outskill", year: "2025" },
  { name: "SIH 2025 Internal Hackathon Finalist", issuer: "Smart India Hackathon", year: "2025" },
  { name: "EY Techathon 6.0 — Certificate of Appreciation", issuer: "EY", year: "2025" },
];
