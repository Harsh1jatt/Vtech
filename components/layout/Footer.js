import React from 'react';
import Link from 'next/link'; // Replace with standard <a> tags if not using Next.js

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topGrid}>
          {/* Brand Column */}
          <div style={styles.brandCol}>
            <Link href="#home" style={styles.logo}>
              <span style={styles.logoMark}>
                VTECH<span style={styles.logoDot}></span>
              </span>
              <span style={styles.logoSub}>Institute of Information Technology</span>
            </Link>
            <p style={styles.brandTagline}>
              Practical computer courses, industry projects, and hands-on career guidance built for real skill.
            </p>
            
            {/* Social Icons */}
            <div style={styles.socialRow}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" style={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2H7.5v3H10V21h3.5z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="17.2" cy="6.8" r="1" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={styles.socialLink}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M6.94 5a2 2 0 11-4-.002 2 2 0 014 .002zM3.5 8.5h3.9V21H3.5V8.5zm6.6 0h3.7v1.7h.05c.52-.98 1.78-2 3.66-2 3.9 0 4.63 2.57 4.63 5.9V21h-3.9v-5.4c0-1.3-.02-2.97-1.8-2.97-1.8 0-2.08 1.4-2.08 2.87V21h-3.9V8.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Links Column */}
          <div style={styles.linksCol}>
            <h5 style={styles.colHeading}>Navigation</h5>
            <ul style={styles.linkList}>
              <li><Link href="#home" style={styles.link}>Home</Link></li>
              <li><Link href="#courses" style={styles.link}>Courses</Link></li>
              <li><Link href="#about" style={styles.link}>About Us</Link></li>
              <li><Link href="#facilities" style={styles.link}>Facilities</Link></li>
              <li><Link href="#reviews" style={styles.link}>Student Reviews</Link></li>
            </ul>
          </div>

          {/* Courses Column */}
          <div style={styles.linksCol}>
            <h5 style={styles.colHeading}>Key Courses</h5>
            <ul style={styles.linkList}>
              <li><Link href="#courses" style={styles.link}>Web Development</Link></li>
              <li><Link href="#courses" style={styles.link}>DCA / ADCA</Link></li>
              <li><Link href="#courses" style={styles.link}>Python Programming</Link></li>
              <li><Link href="#courses" style={styles.link}>Tally &amp; Accounting</Link></li>
              <li><Link href="#courses" style={styles.link}>Graphic Design</Link></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div style={styles.linksCol}>
            <h5 style={styles.colHeading}>Contact</h5>
            <ul style={styles.linkList}>
              <li style={styles.contactItem}>
                <span style={styles.contactLabel}>Address</span>
                <span style={styles.contactVal}>Main Market, Ludhiana, Punjab</span>
              </li>
              <li style={styles.contactItem}>
                <span style={styles.contactLabel}>Phone</span>
                <a href="tel:+916280009096" style={styles.contactLink}>+91 62800 09096</a>
              </li>
              <li style={styles.contactItem}>
                <span style={styles.contactLabel}>Email</span>
                <a href="mailto:info@vtechinstitute.in" style={styles.contactLink}>info@vtechinstitute.in</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div style={styles.bottomBar}>
          <span>© {currentYear} VTech Institute of Information Technology. All rights reserved.</span>
          <span style={styles.bottomMuted}>Designed &amp; built for career excellence.</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--color-surface, #ffffff)',
    borderTop: '1px solid var(--color-border, #dce8e0)',
    paddingTop: '64px',
    paddingBottom: '32px',
    color: 'var(--color-foreground, #14221a)',
    fontFamily: 'var(--font-body)',
  },
  container: {
    maxWidth: 'var(--container-width, 1240px)',
    margin: '0 auto',
    padding: '0 24px',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px 32px',
    paddingBottom: '48px',
  },
  brandCol: {
    gridColumn: 'span 1',
    minWidth: '240px',
  },
  logo: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '3px',
    textDecoration: 'none',
  },
  logoMark: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.45rem',
    letterSpacing: '-0.02em',
    color: 'var(--color-foreground, #14221a)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoDot: {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--color-accent, #16a34a)',
    borderRadius: '2px',
    transform: 'rotate(45deg)',
    display: 'inline-block',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--color-muted-foreground, #607067)',
  },
  brandTagline: {
    color: 'var(--color-muted-foreground, #607067)',
    fontSize: '0.9rem',
    lineHeight: '1.55',
    marginTop: '14px',
    maxWidth: '300px',
  },
  socialRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '22px',
  },
  socialLink: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-full, 999px)',
    backgroundColor: 'var(--color-surface-soft, #f0fdf4)',
    color: 'var(--color-primary, #15803d)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-base, 0.25s ease)',
    border: '1px solid var(--color-border, #dce8e0)',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  colHeading: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-primary-dark, #166534)',
    marginBottom: '16px',
    fontWeight: 600,
  },
  linkList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '0.92rem',
    color: 'var(--color-muted-foreground, #607067)',
    transition: 'color var(--transition-base, 0.25s ease)',
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  contactLabel: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-muted-foreground, #607067)',
    fontFamily: 'var(--font-mono)',
  },
  contactVal: {
    fontSize: '0.9rem',
    color: 'var(--color-foreground, #14221a)',
    fontWeight: 500,
  },
  contactLink: {
    fontSize: '0.9rem',
    color: 'var(--color-foreground, #14221a)',
    fontWeight: 500,
    transition: 'color var(--transition-base, 0.25s ease)',
  },
  bottomBar: {
    paddingTop: '24px',
    borderTop: '1px solid var(--color-border, #dce8e0)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '0.82rem',
    color: 'var(--color-muted-foreground, #607067)',
  },
  bottomMuted: {
    fontSize: '0.82rem',
  },
};