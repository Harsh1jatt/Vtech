import Link from "next/link";

export default function QuickAction({ href, title, description, icon: Icon }) {
  return <Link href={href} className="quickAction"><span className="quickIcon"><Icon size={18} /></span><span><strong>{title}</strong><small>{description}</small></span><span className="quickArrow" aria-hidden="true">-&gt;</span></Link>;
}