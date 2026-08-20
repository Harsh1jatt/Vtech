"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { openWhatsAppMessage } from "@/lib/whatsapp";

import Reveal from "@/components/ui/Reveal/Reveal";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/config/site";

import styles from "./Contact.module.css";

const courseOptions = [
  "Web Development",
  "DCA",
  "ADCA",
  "Python",
  "Digital Marketing",
  "Graphic Design",
  "Advanced Excel",
  "Tally",
];

const initialState = {
  name: "",
  phone: "",
  email: "",
  course: "",
  message: "",
};

const contactOptions = [
  {
    icon: Phone,
    label: "Call Us",
    title: "Speak with our team",
    value: `+91 ${CONTACT_PHONE}`,
    href: `tel:+91${CONTACT_PHONE}`,
  },
  {
    icon: Mail,
    label: "Email Us",
    title: "Send an enquiry",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: MapPin,
    label: "Visit Us",
    title: "Find VTech in Ludhiana",
    value: ADDRESS,
    href: "/contact#location",
  },
  {
    icon: MessageCircle,
    label: "Course Enquiry",
    title: "Get course guidance",
    value: "Ask about available courses",
    href: "#enquiry",
  },
];

const reasons = [
  {
    icon: GraduationCap,
    title: "Course Guidance",
    text: "Not sure which course is right for you? Tell us about your goals and we can help you choose a suitable learning path.",
  },
  {
    icon: BookOpen,
    title: "Admission Information",
    text: "Ask about course details, learning options, timings and the next steps for joining VTech.",
  },
  {
    icon: Users,
    title: "Learning Support",
    text: "Have questions about practical training or what you can learn? Our team is here to help.",
  },
];

const faqs = [
  {
    question: "Which courses can I enquire about?",
    answer:
      "You can enquire about Web Development, DCA, ADCA, Python, Digital Marketing, Graphic Design, Advanced Excel and Tally.",
  },
  {
    question: "Can beginners join VTech?",
    answer:
      "Yes. VTech offers learning paths that can help beginners build computer fundamentals and gradually develop practical digital skills.",
  },
  {
    question: "How can I enquire about a course?",
    answer:
      "You can submit the enquiry form on this page, call VTech directly or email the institute with your requirements.",
  },
  {
    question: "Where is VTech located?",
    answer:
      "VTech Institute of Information Technology is located at #1326, Prem Vihar, Main Road, Subhash Nagar, Ludhiana.",
  },
  {
    question: "What should I mention in my enquiry?",
    answer:
      "Mention the course you're interested in and any questions you have about your learning goals, timings or admission.",
  },
];

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  };

  const validate = () => {
    const next = {};

    if (form.name.trim().length < 2) {
      next.name = "Please enter your full name";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!form.course) {
      next.course = "Please select a course";
    }

    if (form.message.trim().length < 5) {
      next.message = "Tell us a little about your enquiry";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    openWhatsAppMessage(`Hello VTech Institute,\n\nI would like to enquire about your courses.\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nCourse: ${form.course}\nMessage: ${form.message}\n\nPlease contact me regarding my enquiry.`);
    window.setTimeout(() => setStatus("idle"), 1200);
  };

  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGridPattern} />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <Reveal>
              <span className={styles.eyebrow}>LET&apos;S CONNECT</span>

              <h1>
                Have a Question?
                <span>Let&apos;s Talk.</span>
              </h1>

              <p>
                Whether you are exploring your first computer course, looking
                to upgrade your skills or simply need guidance about a
                programme, we are here to help you take the next step.
              </p>

              <div className={styles.heroActions}>
                <a
                  href={`tel:+91${CONTACT_PHONE}`}
                  className={styles.primaryButton}
                >
                  <Phone size={17} />
                  Call VTech
                </a>

                <Link href="#enquiry" className={styles.secondaryButton}>
                  Send an Enquiry
                  <ArrowRight size={17} />
                </Link>
              </div>
            </Reveal>

            <Reveal className={styles.heroSide} delay={120}>
              <div className={styles.heroImage}>
                <Image
                  src="/images/instructor-teaching.png"
                  alt="Students learning at VTech Institute"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 45vw"
                />

                <div className={styles.heroImageOverlay} />

                <div className={styles.heroImageCard}>
                  <Sparkles size={18} />
                  <div>
                    <strong>Start with a conversation.</strong>
                    <span>Find the right learning path.</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT */}
      <section className={styles.quickContact}>
        <div className={styles.container}>
          <div className={styles.quickGrid}>
            {contactOptions.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.label}
                  delay={index * 70}
                  className={styles.quickCard}
                >
                  <div className={styles.quickIcon}>
                    <Icon size={20} />
                  </div>

                  <div className={styles.quickContent}>
                    <span>{item.label}</span>
                    <h2>{item.title}</h2>

                    {item.href.startsWith("/") ||
                    item.href.startsWith("#") ? (
                      <Link href={item.href}>
                        {item.value}
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <a href={item.href}>
                        {item.value}
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN ENQUIRY */}
      <section className={styles.enquiry} id="enquiry">
        <div className={styles.container}>
          <div className={styles.enquiryGrid}>
            <Reveal className={styles.enquiryInfo}>
              <span className={styles.eyebrow}>ENQUIRY</span>

              <h2>
                Tell Us What
                <span>You&apos;re Looking For.</span>
              </h2>

              <p>
                Choosing a course is an important decision. Share a few
                details with us and let&apos;s start with what you actually
                want to learn.
              </p>

              <div className={styles.infoPoints}>
                <div>
                  <span>
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <strong>Tell us your goal</strong>
                    <p>Career, skill upgrade, academics or personal learning.</p>
                  </div>
                </div>

                <div>
                  <span>
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <strong>Select your course</strong>
                    <p>Choose the programme you are interested in.</p>
                  </div>
                </div>

                <div>
                  <span>
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <strong>We&apos;ll take it from there</strong>
                    <p>Our team can help you with the next step.</p>
                  </div>
                </div>
              </div>

              <div className={styles.directContact}>
                <span>Prefer to contact us directly?</span>

                <div>
                  <a href={`tel:+91${CONTACT_PHONE}`}>
                    <Phone size={15} />
                    +91 {CONTACT_PHONE}
                  </a>

                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail size={15} />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal
              as="form"
              delay={120}
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.formHeader}>
                <div>
                  <span className={styles.formEyebrow}>ENQUIRY FORM</span>
                  <h3>Start Your Enquiry</h3>
                </div>

                <span className={styles.formIcon}>
                  <Send size={19} />
                </span>
              </div>

              <div className={styles.formRow}>
                <div
                  className={`${styles.field} ${
                    errors.name ? styles.invalid : ""
                  }`}
                >
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  <span className={styles.err}>{errors.name}</span>
                </div>

                <div
                  className={`${styles.field} ${
                    errors.phone ? styles.invalid : ""
                  }`}
                >
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                  />
                  <span className={styles.err}>{errors.phone}</span>
                </div>
              </div>

              <div
                className={`${styles.field} ${
                  errors.email ? styles.invalid : ""
                }`}
              >
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                <span className={styles.err}>{errors.email}</span>
              </div>

              <div
                className={`${styles.field} ${
                  errors.course ? styles.invalid : ""
                }`}
              >
                <label htmlFor="contact-course">Course Interested In</label>

                <select
                  id="contact-course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                >
                  <option value="">Choose a course</option>

                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                <span className={styles.err}>{errors.course}</span>
              </div>

              <div
                className={`${styles.field} ${
                  errors.message ? styles.invalid : ""
                }`}
              >
                <label htmlFor="contact-message">Message</label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about what you want to learn..."
                  rows={5}
                />

                <span className={styles.err}>{errors.message}</span>
              </div>

              <button
                type="submit"
                className={styles.submit}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    Opening WhatsApp...
                    <span className={styles.spinner} />
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {status === "loading" && (
                <div className={styles.success} role="status">
                  <CheckCircle2 size={20} />

                  <div>
                    <strong>Opening WhatsApp to send your enquiry...</strong>
                    <span>
                      Your message is ready to send.
                    </span>
                  </div>
                </div>
              )}

            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY CONTACT */}
      <section className={styles.reasons}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>WHY REACH OUT</span>

            <h2>
              Not Sure Where
              <span>to Start?</span>
            </h2>

            <p>
              You don&apos;t need to have everything figured out before
              contacting us. Start with a question and we can help you
              understand your options.
            </p>
          </Reveal>

          <div className={styles.reasonsGrid}>
            {reasons.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  delay={index * 90}
                  className={styles.reasonCard}
                >
                  <div className={styles.reasonTop}>
                    <span className={styles.reasonIcon}>
                      <Icon size={21} />
                    </span>

                    <span className={styles.reasonNumber}>
                      0{index + 1}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className={styles.location} id="location">
        <div className={styles.container}>
          <div className={styles.locationGrid}>
            <Reveal className={styles.locationVisual}>
              <Image
                src="/images/facility-classroom.png"
                alt="VTech Institute classroom in Ludhiana"
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
              />

              <div className={styles.locationOverlay} />

              <div className={styles.locationBadge}>
                <MapPin size={17} />
                <span>Ludhiana, Punjab</span>
              </div>
            </Reveal>

            <Reveal className={styles.locationContent} delay={120}>
              <span className={styles.eyebrow}>VISIT VTECH</span>

              <h2>
                Come In,
                <span>Let&apos;s Talk.</span>
              </h2>

              <p>
                If you prefer a face-to-face conversation, visit VTech in
                Ludhiana and talk to us about your learning goals and course
                options.
              </p>

              <div className={styles.addressBlock}>
                <span className={styles.addressIcon}>
                  <MapPin size={19} />
                </span>

                <div>
                  <strong>Our Address</strong>
                  <span>{ADDRESS}</span>
                </div>
              </div>

              <div className={styles.hoursBlock}>
                <span className={styles.addressIcon}>
                  <Clock3 size={19} />
                </span>

                <div>
                  <strong>Opening Hours</strong>
                  <span>Mon – Sat, 9:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className={styles.locationActions}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ADDRESS
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryButton}
                >
                  Get Directions
                  <ArrowRight size={17} />
                </a>

                <a
                  href={`tel:+91${CONTACT_PHONE}`}
                  className={styles.phoneLink}
                >
                  <Phone size={16} />
                  Call VTech
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>COMMON QUESTIONS</span>

            <h2>
              Before You
              <span>Get in Touch.</span>
            </h2>

            <p>
              A few quick answers to common questions about contacting VTech
              and choosing a course.
            </p>
          </Reveal>

          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <Reveal
                as="details"
                key={item.question}
                className={styles.faqItem}
                delay={index * 60}
              >
                <summary>
                  <span>
                    <small>0{index + 1}</small>
                    {item.question}
                  </span>

                  <span className={styles.faqPlus}>+</span>
                </summary>

                <p>{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />

        <div className={styles.container}>
          <Reveal className={styles.ctaInner}>
            <span className={styles.ctaEyebrow}>TAKE THE NEXT STEP</span>

            <h2>
              Your Next Step Can
              <span>Start With a Conversation.</span>
            </h2>

            <p>
              Tell us what you want to learn. We&apos;ll help you understand
              where to begin.
            </p>

            <div className={styles.ctaActions}>
              <Link href="#enquiry" className={styles.ctaPrimary}>
                Send an Enquiry
                <ArrowRight size={18} />
              </Link>

              <Link href="/courses" className={styles.ctaSecondary}>
                Explore Courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
