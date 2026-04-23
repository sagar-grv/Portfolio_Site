import React, { useState } from "react";
import { profile } from "../data/mock";
import { Github, Linkedin, Mail, Instagram, BookOpen, Send, ArrowRight } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in your name, email and message.",
      });
      return;
    }
    setSubmitting(true);
    // Save to localStorage as mock persistence
    const stored = JSON.parse(localStorage.getItem("sg_messages") || "[]");
    stored.push({ ...form, at: new Date().toISOString() });
    localStorage.setItem("sg_messages", JSON.stringify(stored));

    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Message sent",
        description: "Thanks for reaching out! I'll get back within 24h.",
      });
    }, 700);
  };

  return (
    <section id="contact" className="section border-t border-[var(--border)]">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="section-eyebrow">
              <span className="w-6 h-px bg-[var(--accent)]" /> 06 / Contact
            </div>
            <h2 className="section-title">
              Got an idea, role or research you want to talk about?
            </h2>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed max-w-md">
              I&apos;m currently open to internships, freelance Shopify /
              full-stack builds and AI research collaborations. Drop a note and
              I&apos;ll get back within a day.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={profile.socials.email}
                className="card p-4 flex items-center gap-3 group hover:border-[var(--accent)]/60"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
                  <Mail size={16} />
                </span>
                <div className="flex-1">
                  <div className="text-xs text-[var(--text-dim)]">Email</div>
                  <div className="text-sm text-[var(--text)]">
                    {profile.email}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-[var(--text-dim)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition"
                />
              </a>

              <div className="flex gap-2 flex-wrap">
                <SocialPill
                  href={profile.socials.github}
                  icon={Github}
                  label="GitHub"
                />
                <SocialPill
                  href={profile.socials.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                />
                <SocialPill
                  href={profile.socials.medium}
                  icon={BookOpen}
                  label="Medium"
                />
                <SocialPill
                  href={profile.socials.instagram}
                  icon={Instagram}
                  label="Instagram"
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 card p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Your name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@domain.com"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-mono text-[var(--text-dim)] mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project, role or idea..."
                className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition resize-none"
              />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-[var(--text-dim)] font-mono">
                Your message stays in this browser (mock). Wire the API up next.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={15} />
                {submitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs font-mono text-[var(--text-dim)] mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] transition"
    />
  </div>
);

const SocialPill = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
  >
    <Icon size={14} /> {label}
  </a>
);

export default Contact;
