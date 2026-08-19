import Hero from "@/components/home/Hero";
import CourseStrip from "@/components/home/CourseStrip";
import Courses from "@/components/home/Courses/Courses";
import SkillPath from "@/components/home/SkillPath/SkillPath";
import About from "@/components/home/About/About";
import Facilities from "@/components/home/Facilities/Facilities";
import Experience from "@/components/home/Experience/Experience";
import Testimonials from "@/components/home/Testimonials/Testimonials";
import Stats from "@/components/home/Stats/Stats";
import CTA from "@/components/home/CTA/CTA";
import Contact from "@/components/home/Contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <CourseStrip />
      <Courses />
      <SkillPath />
      <About />
      <Facilities />
      <Experience />
      <Testimonials />
      <Stats />
      <CTA />
      <Contact />
    </>
  );
}