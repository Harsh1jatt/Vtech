import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Code2,
  Compass,
  GraduationCap,
  Laptop,
  Lightbulb,
  MapPin,
  MonitorCheck,
  PencilRuler,
  Rocket,
  Target,
  Users,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal/Reveal";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/config/site";

import styles from "./AboutPage.module.css";

const approach = [
  {
    number: "01",
    title: "Understand",
    text: 'Strong fundamentals make advanced learning easier. We focus on helping students understand the "why" behind what they learn.',
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Practice",
    text: "Technology is a practical field. Regular hands-on practice helps turn concepts into usable skills.",
    icon: Laptop,
  },
  {
    number: "03",
    title: "Create",
    text: "Projects and practical assignments help students apply what they learn to realistic situations.",
    icon: PencilRuler,
  },
  {
    number: "04",
    title: "Grow",
    text: "Learning does not stop with a course. We encourage students to keep improving and exploring new opportunities.",
    icon: Rocket,
  },
];

const whyVtech = [
  {
    title: "Practical Learning",
    text: "Learn by doing instead of depending only on theoretical lessons.",
    icon: MonitorCheck,
  },
  {
    title: "Step-by-Step Guidance",
    text: "Move from fundamentals toward more advanced concepts through structured learning.",
    icon: Compass,
  },
  {
    title: "Career-Focused Skills",
    text: "Develop useful digital skills for professional, business and technology environments.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Supportive Environment",
    text: "Ask questions, practise concepts and improve with guidance throughout your learning journey.",
    icon: Users,
  },
  {
    title: "Modern Digital Skills",
    text: "Stay connected with the tools and technologies shaping today's digital world.",
    icon: Code2,
  },
  {
    title: "Individual Attention",
    text: "Strengthen your fundamentals, clear doubts and build confidence at your own pace.",
    icon: GraduationCap,
  },
];

const journey = [
  {
    number: "01",
    title: "Discover",
    text: "Understand your interests and choose a learning path that fits your goals.",
  },
  {
    number: "02",
    title: "Learn",
    text: "Build strong foundations through structured classroom training.",
  },
  {
    number: "03",
    title: "Practice",
    text: "Apply concepts through exercises, assignments and regular practical work.",
  },
  {
    number: "04",
    title: "Build",
    text: "Create projects that demonstrate what you have learned.",
  },
  {
    number: "05",
    title: "Prepare",
    text: "Develop the confidence and skills needed for further education, employment or independent work.",
  },
];

const learningAreas = [
  {
    title: "Web Development",
    text: "Learn how modern websites and web applications are planned, designed and developed.",
    icon: Code2,
  },
  {
    title: "DCA / ADCA",
    text: "Build strong computer fundamentals and practical digital skills.",
    icon: MonitorCheck,
  },
  {
    title: "Python Programming",
    text: "Develop programming fundamentals through a versatile and beginner-friendly language.",
    icon: Code2,
  },
  {
    title: "Tally & Accounting",
    text: "Develop practical knowledge of digital accounting and business tools.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Graphic Design",
    text: "Explore visual communication, design principles and creative digital tools.",
    icon: PencilRuler,
  },
  {
    title: "Digital Marketing",
    text: "Understand the digital channels businesses use to reach and engage audiences.",
    icon: Rocket,
  },
  {
    title: "Computer Fundamentals",
    text: "Build the essential computer knowledge needed for today's digital environment.",
    icon: Laptop,
  },
  {
    title: "Office & Productivity",
    text: "Improve everyday productivity through practical digital and office tools.",
    icon: BookOpen,
  },
];

const audience = [
  {
    title: "Students",
    text: "Build computer and technology skills alongside your academic journey.",
    icon: GraduationCap,
  },
  {
    title: "Beginners",
    text: "Start from the basics with structured guidance and practical learning.",
    icon: BookOpen,
  },
  {
    title: "Job Seekers",
    text: "Develop useful digital skills and improve your professional readiness.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Working Professionals",
    text: "Upgrade your existing knowledge and learn tools that can improve your productivity.",
    icon: Target,
  },
];

const values = [
  {
    number: "01",
    title: "Clarity",
    text: "Complex concepts become easier when they are explained clearly and logically.",
  },
  {
    number: "02",
    title: "Practice",
    text: "Skills grow through consistent application, experimentation and repetition.",
  },
  {
    number: "03",
    title: "Progress",
    text: "Every learner has a different starting point. What matters is continuous improvement.",
  },
  {
    number: "04",
    title: "Responsibility",
    text: "Education should prepare students to use their knowledge confidently and responsibly.",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <Reveal className={styles.heroContent}>
              <span className={styles.eyebrow}>ABOUT VTECH</span>

              <h1>
                Building Skills.
                <br />
                <span>Shaping Careers.</span>
                <br />
                Creating Possibilities.
              </h1>

              <p>
                VTech Institute of Information Technology is focused on
                helping students turn their interest in computers and
                technology into practical, career-ready skills.
              </p>

              <div className={styles.heroActions}>
                <Link href="/courses" className={styles.primaryButton}>
                  Explore Courses
                  <ArrowRight size={18} />
                </Link>

                <Link href="/contact" className={styles.secondaryButton}>
                  Talk to Us
                </Link>
              </div>

              <div className={styles.heroMeta}>
                <span>
                  <span className={styles.metaDot} />
                  Practical computer education
                </span>

                <span>
                  <span className={styles.metaDot} />
                  Career-focused learning
                </span>
              </div>
            </Reveal>

            <Reveal className={styles.heroVisual} delay={140}>
              <div className={styles.heroImageFrame}>
                <Image
                  src="/images/hero-imag.jpeg"
                  alt="Students learning in the VTech classroom"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 52vw"
                  className={styles.heroImage}
                />

                <div className={styles.imageOverlay} />

                <div className={styles.heroFloatingCard}>
                  <span className={styles.floatingIcon}>
                    <MonitorCheck size={20} />
                  </span>

                  <div>
                    <strong>Learn by doing</strong>
                    <span>Concepts → Practice → Projects</span>
                  </div>
                </div>
              </div>

              <div className={styles.visualBadge}>
                <span>VTECH</span>
                <small>Institute of Information Technology</small>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <Reveal className={styles.storyVisual}>
              <div className={styles.storyImage}>
                <Image
                  src="/images/about-training.png"
                  alt="Faculty guiding a student during practical training"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                />
              </div>

              <div className={styles.storyAccent}>
                <span>01</span>
                <strong>Learn</strong>
                <small>with purpose</small>
              </div>
            </Reveal>

            <Reveal className={styles.storyContent} delay={120}>
              <span className={styles.eyebrow}>WHO WE ARE</span>

              <h2>
                More Than a Computer Institute.
                <span>A Place to Build Your Future.</span>
              </h2>

              <p>
                At VTech Institute of Information Technology, we believe that
                learning technology should go beyond memorising concepts and
                completing a syllabus.
              </p>

              <p>
                The digital world is constantly changing, and today's
                students need more than theoretical knowledge. They need
                practical skills, confidence, problem-solving ability and an
                understanding of how technology is actually used.
              </p>

              <p>
                That is why our learning approach combines structured
                teaching with hands-on practice. Students are encouraged to
                understand concepts, ask questions, practise regularly and
                gradually become confident in using their skills independently.
              </p>

              <div className={styles.storyChecklist}>
                {[
                  "Practical sessions",
                  "Project-based learning",
                  "Career-oriented guidance",
                  "Supportive learning environment",
                ].map((item) => (
                  <div key={item}>
                    <span>
                      <Check size={14} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className={styles.approach}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>OUR APPROACH</span>

            <h2>
              Learn the Concept.
              <br />
              <span>Practice the Skill. Build the Confidence.</span>
            </h2>

            <p>
              A simple learning philosophy designed to move students from
              understanding an idea to confidently using it.
            </p>
          </Reveal>

          <div className={styles.approachGrid}>
            {approach.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.number}
                  className={styles.approachCard}
                  delay={index * 90}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardNumber}>
                      {item.number}
                    </span>

                    <span className={styles.cardIcon}>
                      <Icon size={21} />
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

      {/* WHY VTECH */}
      <section className={styles.why}>
        <div className={styles.container}>
          <div className={styles.whyHeader}>
            <Reveal>
              <span className={styles.eyebrow}>WHY VTECH</span>
              <h2>
                Designed Around the Way
                <span>Students Actually Learn.</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p>
                Good education is not only about what is taught. It is also
                about how students experience, practise and apply what they
                learn.
              </p>
            </Reveal>
          </div>

          <div className={styles.whyGrid}>
            {whyVtech.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  className={styles.whyCard}
                  delay={index * 70}
                >
                  <div className={styles.whyIcon}>
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <span className={styles.cardArrow}>
                    <ArrowRight size={17} />
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className={styles.journey}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>YOUR LEARNING JOURNEY</span>

            <h2>
              From Learning
              <span>to Real-World Skills.</span>
            </h2>

            <p>
              Every stage has a purpose — from discovering the right direction
              to developing the confidence to use your skills.
            </p>
          </Reveal>

          <div className={styles.timeline}>
            <div className={styles.timelineLine} />

            {journey.map((item, index) => (
              <Reveal
                key={item.number}
                className={styles.timelineItem}
                delay={index * 80}
              >
                <div className={styles.timelineMarker}>
                  {item.number}
                </div>

                <div className={styles.timelineContent}>
                  <span>STEP {item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING AREAS */}
      <section className={styles.learning}>
        <div className={styles.container}>
          <div className={styles.learningHeader}>
            <Reveal>
              <span className={styles.eyebrow}>WHAT YOU CAN LEARN</span>

              <h2>
                Skills for Today's
                <span>Digital World.</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <Link href="/courses" className={styles.textLink}>
                View all courses
                <ArrowRight size={17} />
              </Link>
            </Reveal>
          </div>

          <div className={styles.learningGrid}>
            {learningAreas.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  className={styles.learningCard}
                  delay={index * 60}
                >
                  <span className={styles.learningIcon}>
                    <Icon size={21} />
                  </span>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>

                  <Link href="/courses" aria-label={`Learn more about ${item.title}`}>
                    <ArrowRight size={17} />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENVIRONMENT */}
      <section className={styles.environment}>
        <div className={styles.container}>
          <div className={styles.environmentGrid}>
            <Reveal className={styles.environmentContent}>
              <span className={styles.eyebrow}>THE LEARNING ENVIRONMENT</span>

              <h2>
                A Learning Environment
                <span>Built for Practice.</span>
              </h2>

              <p>
                Learning becomes more effective when students have the
                opportunity to practise what they are taught. VTech focuses
                on creating a practical environment where students can attend
                structured classes, work on computers, practise their skills
                and receive guidance.
              </p>

              <div className={styles.environmentFeatures}>
                <div>
                  <Laptop size={19} />
                  <span>Computer-Based Practice</span>
                </div>

                <div>
                  <BookOpen size={19} />
                  <span>Focused Classroom Learning</span>
                </div>

                <div>
                  <PencilRuler size={19} />
                  <span>Practical Assignments</span>
                </div>

                <div>
                  <Users size={19} />
                  <span>Instructor Guidance</span>
                </div>
              </div>
            </Reveal>

            <Reveal className={styles.environmentVisual} delay={120}>
              <div className={styles.environmentMainImage}>
                <Image
                  src="/images/facility-lab.png"
                  alt="VTech computer lab"
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
              </div>

              <div className={styles.environmentSmallImage}>
                <Image
                  src="/images/facility-practical.png"
                  alt="VTech practical training session"
                  fill
                  sizes="220px"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className={styles.audience}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeading}>
            <span className={styles.eyebrow}>BUILT FOR DIFFERENT GOALS</span>

            <h2>
              A Learning Path
              <span>for Different Goals.</span>
            </h2>
          </Reveal>

          <div className={styles.audienceGrid}>
            {audience.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  className={styles.audienceCard}
                  delay={index * 80}
                >
                  <div className={styles.audienceIcon}>
                    <Icon size={22} />
                  </div>

                  <span className={styles.audienceNumber}>
                    0{index + 1}
                  </span>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valuesGrid}>
            <Reveal className={styles.valuesIntro}>
              <span className={styles.eyebrow}>OUR VALUES</span>

              <h2>
                The Principles
                <span>Behind Our Teaching.</span>
              </h2>

              <p>
                Our approach is grounded in simple principles that help make
                learning clearer, more practical and more meaningful.
              </p>

              <div className={styles.valuesMark}>
                <Award size={24} />
                <span>Learn with purpose.</span>
              </div>
            </Reveal>

            <div className={styles.valuesList}>
              {values.map((item, index) => (
                <Reveal
                  key={item.number}
                  className={styles.valueItem}
                  delay={index * 80}
                >
                  <span className={styles.valueNumber}>
                    {item.number}
                  </span>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LUDHIANA */}
      <section className={styles.location}>
        <div className={styles.container}>
          <Reveal className={styles.locationCard}>
            <div className={styles.locationPattern} />

            <div className={styles.locationContent}>
              <span className={styles.eyebrow}>OUR LOCATION</span>

              <h2>
                Learn. Grow.
                <span>Build Your Future in Ludhiana.</span>
              </h2>

              <p>
                Located in Ludhiana, VTech Institute of Information Technology
                is committed to making practical computer education accessible
                to students and learners who want to develop useful digital
                skills.
              </p>

              <div className={styles.address}>
                <MapPin size={20} />

                <div>
                  <strong>Visit VTech</strong>
                  <span>{ADDRESS}</span>
                </div>
              </div>

              <div className={styles.locationActions}>
                <Link href="/contact" className={styles.primaryButton}>
                  View Contact
                  <ArrowRight size={18} />
                </Link>

                <a
                  href={`tel:+91${CONTACT_PHONE}`}
                  className={styles.locationPhone}
                >
                  +91 {CONTACT_PHONE}
                </a>
              </div>
            </div>

            <div className={styles.locationVisual}>
              <Image
                src="/images/facility-classroom.png"
                alt="VTech classroom in Ludhiana"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />

        <div className={styles.container}>
          <Reveal className={styles.ctaInner}>
            <span className={styles.ctaEyebrow}>START YOUR JOURNEY</span>

            <h2>
              Your Future Needs Skills.
              <span>Start Building Them Today.</span>
            </h2>

            <p>
              Whether you're taking your first step into the world of computers
              or looking to develop a new professional skill, VTech can help
              you move from curiosity to capability.
            </p>

            <div className={styles.ctaActions}>
              <Link href="/courses" className={styles.ctaPrimary}>
                Explore Courses
                <ArrowRight size={18} />
              </Link>

              <Link href="/contact" className={styles.ctaSecondary}>
                Enquire Now
              </Link>
            </div>

            <div className={styles.ctaContact}>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <span />
              <a href={`tel:+91${CONTACT_PHONE}`}>
                +91 {CONTACT_PHONE}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}