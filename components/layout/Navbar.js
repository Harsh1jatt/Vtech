"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Internships",
    href: "/internships",
  },
  {
    label: "Verify Certificate",
    href: "/verify-certificate",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`${styles.header} ${
        scrolled ? styles.headerScrolled : ""
      }`}
    >
      <div className={styles.container}>
        <Link
  href="/"
  className={styles.logo}
  aria-label="VTech Computer & Educational Institute - Home"
>
  <div className={styles.logoIconWrap}>
    <Image
      src="/images/logo.png"
      alt=""
      width={42}
      height={42}
      priority
      className={styles.logoIcon}
    />
  </div>

  <div className={styles.logoText}>
    <span className={styles.logoName}>
      VTECH
    </span>

    <span className={styles.logoSubtitle}>
      Computer & Educational Institute
    </span>
  </div>
</Link>

        <nav
          className={styles.desktopNav}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  active ? styles.active : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <Link href="/contact" className={styles.cta}>
            <span>Enquire Now</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <button
            type="button"
            className={`${styles.menuButton} ${
              menuOpen ? styles.menuButtonOpen : ""
            }`}
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuInner}>
          {navItems.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={menuOpen ? 0 : -1}
                className={`${styles.mobileLink} ${
                  active ? styles.mobileLinkActive : ""
                }`}
              >
                <span className={styles.mobileLinkNumber}>
                  0{index + 1}
                </span>

                <span>{item.label}</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            );
          })}

          <Link
            href="/contact"
            tabIndex={menuOpen ? 0 : -1}
            className={styles.mobileCta}
          >
            <span>Start Your Journey</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}