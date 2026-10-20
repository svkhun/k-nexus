import { useLanguage } from "../i18n/LanguageContext";
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Wallet, ShieldCheck, Layers, Users, Database, ArrowUpRight, Menu, X, ArrowRight } from 'lucide-react';
import { WEB_APP_URL } from './ProjectUI';
import NexusBrand from './NexusBrand';
const links = [['/', 'ภาพรวมโครงการ', Home], ['/flowsense', 'ใช้เงินและออมเงิน', Wallet], ['/trustgraph', 'ความเสี่ยงก่อนโอน', ShieldCheck], ['/personas', 'ตัวอย่างการใช้งาน', Users], ['/architecture', 'การทำงานของระบบ', Layers], ['/dataset', 'ข้อมูลและการประเมิน', Database]];
export default function Navbar() {
  const {
    t
  } = useLanguage();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return <>
    <div className="mobile-header"><Link to="/" className="mobile-brand"><NexusBrand /><small>SHOWCASE</small></Link><button className="icon-button" aria-label={open ? t("ปิดเมนู") : t("เปิดเมนู")} aria-expanded={open} aria-controls="project-navigation" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div>
    <aside className={'project-sidebar ' + (open ? 'is-open' : '')}>
      <Link className="project-brand" to="/" aria-label={t("K-NEXUS ภาพรวมโครงการ")}><NexusBrand /><span className="brand-caption">SHOWCASE · FlowSense × TrustGraph</span></Link>
      <nav id="project-navigation" aria-label={t("เมนูโครงการ")}>{links.map(([path, label, Icon]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} end={path === '/'} className={({
          isActive
        }) => 'sidebar-link ' + (isActive ? 'active' : '')}><Icon size={19} /><span>{t(label)}</span><ArrowRight className="nav-arrow" size={14} /></NavLink>)}</nav>
      <div className="sidebar-bottom"><p>{t("ลองดูจากหน้าจอจริง")}</p><a href={WEB_APP_URL} target="_blank" rel="noreferrer" className="sidebar-app-link">{t("เปิดเว็บแอป ")}<ArrowUpRight size={17} /></a><div className="sidebar-note"><strong>K-NEXUS</strong><span>{t("โครงการต้นแบบสำหรับ KBTG")}<br />{t("ข้อมูลสมมติ · ไม่มีการโอนเงินจริง")}</span></div></div>
    </aside>
  </>;
}
