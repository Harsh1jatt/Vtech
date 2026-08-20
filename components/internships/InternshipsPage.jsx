import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Check, Code2, Layers3, MessageCircle, Palette, Search, Sparkles, UsersRound } from "lucide-react";
import { CONTACT_PHONE } from "@/config/site";
import { courses } from "@/config/courses";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./InternshipsPage.module.css";

const whatsappMessage = "Hello VTech Institute, I am interested in an internship opportunity. I would like to know more about the available internship programs.";
const whatsappHref = `https://wa.me/91${CONTACT_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

const internshipAreas = [
  { title: "Web Development", description: "Build responsive websites and practical web projects.", icon: Code2, match: ["Web Development", "Web Designing"] },
  { title: "Frontend Development", description: "Strengthen your HTML, CSS and interface-building practice.", icon: Layers3, match: ["Web Development", "HTML & CSS"] },
  { title: "MERN Stack Development", description: "Explore modern JavaScript applications through guided projects.", icon: Code2, match: ["MERN Stack", "Web Development"] },
  { title: "Python", description: "Apply programming logic to useful automation and software projects.", icon: Sparkles, match: ["Python", "Programming"] },
  { title: "Digital Marketing", description: "Learn practical content, social and search marketing workflows.", icon: Search, match: ["Digital Marketing", "Marketing"] },
  { title: "Graphic Design", description: "Create visual work across branding, layouts and digital content.", icon: Palette, match: ["Graphic Design", "Design"] },
].map((area) => ({ ...area, courseSignal: courses.find((course) => area.match.some((term) => `${course.title} ${course.category} ${course.description}`.toLowerCase().includes(term.toLowerCase())))?.shortTitle }));

const benefits = [
  { title: "Practical Learning", text: "Work through hands-on tasks and applied learning that turns concepts into usable skills.", icon: BriefcaseBusiness },
  { title: "Mentorship", text: "Get guidance while working through practical tasks and building confidence step by step.", icon: UsersRound },
  { title: "Industry-Oriented Skills", text: "Focus on tools and workflows that reflect real-world digital work.", icon: Sparkles },
  { title: "Project Experience", text: "Build practical work that gives you something concrete to discuss and demonstrate.", icon: Layers3 },
];

const audience = ["Students", "Freshers", "Beginners", "Aspiring Developers", "Learners looking for practical experience"];

export default function InternshipsPage() {
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.container}><div className={styles.heroGrid}><Reveal className={styles.heroCopy}><span className={styles.eyebrow}>VTech Internship Opportunities</span><h1>Build Real Skills.<br /><span>Gain Real Experience.</span></h1><p>Explore internship opportunities at VTech Institute of Information Technology and gain practical experience through hands-on learning and real-world projects.</p><div className={styles.actions}><a href={whatsappHref} target="_blank" rel="noreferrer" className={styles.primaryButton}>Apply for Internship <MessageCircle size={17} /></a><Link href="/courses" className={styles.secondaryButton}>Explore Courses <ArrowRight size={16} /></Link></div><div className={styles.heroNote}><span className={styles.noteDot} /> Direct conversation with the VTech team on WhatsApp</div></Reveal><Reveal delay={120} className={styles.heroPanel}><div className={styles.panelTop}><span>INTERNSHIP / 01</span><BriefcaseBusiness size={21} /></div><div className={styles.panelRule} /><strong>Learn by doing.</strong><p>Choose an area, discuss your goals and shape a practical learning experience around what you want to build.</p><div className={styles.panelStats}><span><b>06</b><small>focus areas</small></span><span><b>01</b><small>direct application path</small></span></div></Reveal></div></div>
    </section>

    <section className={styles.section}>
      <div className={styles.container}><Reveal className={styles.sectionHeading}><span className={styles.eyebrow}>Choose your direction</span><h2>Internship areas built around practical digital skills.</h2><p>Start with the area that matches your interests and the kind of work you want to explore.</p></Reveal><div className={styles.areaGrid}>{internshipAreas.map(({ title, description, icon: Icon, courseSignal }, index) => <Reveal key={title} delay={index * 55} className={styles.areaCard}><span className={styles.cardIcon}><Icon size={20} /></span><span className={styles.cardIndex}>0{index + 1}</span><h3>{title}</h3><p>{description}</p>{courseSignal && <small>Related VTech learning path: {courseSignal}</small>}</Reveal>)}</div></div>
    </section>

    <section className={`${styles.section} ${styles.softSection}`}>
      <div className={styles.container}><div className={styles.split}><Reveal className={styles.sectionHeading}><span className={styles.eyebrow}>Why VTech</span><h2>A place to practise, ask questions and make progress.</h2><p>Your internship journey should leave you with stronger fundamentals, clearer direction and practical work you can be proud of.</p></Reveal><div className={styles.benefitGrid}>{benefits.map(({ title, text, icon: Icon }, index) => <Reveal key={title} delay={index * 65} className={styles.benefit}><span className={styles.benefitIcon}><Icon size={18} /></span><div><h3>{title}</h3><p>{text}</p></div></Reveal>)}</div></div></div>
    </section>

    <section className={styles.section}><div className={styles.container}><div className={styles.audienceProcess}><Reveal className={styles.audience}><span className={styles.eyebrow}>Who can apply</span><h2>Bring curiosity. We will help you find a starting point.</h2><div className={styles.audienceList}>{audience.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></Reveal><Reveal delay={100} className={styles.process}><span className={styles.eyebrow}>A simple process</span><div className={styles.steps}><div><b>01</b><h3>Contact Us</h3><p>Send an internship request through WhatsApp.</p></div><div><b>02</b><h3>Discuss Your Goals</h3><p>Share your preferred area, background and requirements.</p></div><div><b>03</b><h3>Get Started</h3><p>After discussion and confirmation, begin your internship journey.</p></div></div></Reveal></div></div></section>

    <section className={styles.finalCta}><div className={styles.container}><Reveal className={styles.ctaInner}><div><span className={styles.eyebrow}>Your next practical step</span><h2>Ready to Start Your Internship Journey?</h2><p>Tell us what you want to learn and our team will guide you through the next steps.</p></div><a href={whatsappHref} target="_blank" rel="noreferrer" className={styles.ctaButton}>Apply for Internship on WhatsApp <MessageCircle size={17} /></a></Reveal></div></section>
  </div>;
}
