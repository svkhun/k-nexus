import { useLanguage } from "../i18n/LanguageContext";
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Wallet, ShieldCheck, Layers, Users, Database, History, ArrowUpRight, Menu, X, ArrowRight } from 'lucide-react';
import { WEB_APP_URL } from './ProjectUI';
import NexusBrand from './NexusBrand';
const links = [['/', 'ที่มาและโจทย์ปัญหา', Home], ['/personas', 'สถานการณ์และความต้องการ', Users], ['/flowsense', 'FlowSense · แผนเงิน', Wallet], ['/trustgraph', 'TrustGraph · ความเสี่ยง', ShieldCheck], ['/architecture', 'Machine Learning & Data Science', Layers], ['/evolution', 'พัฒนาการจาก feedback', History], ['/dataset', 'ข้อมูลและการประเมิน', Database]];
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
      <div className="sidebar-bottom"><p>{t('จากแนวคิดสู่การนำไปใช้')}</p><a href={WEB_APP_URL} target="_blank" rel="noreferrer" className="sidebar-app-link">{t('เปิด application แยก')}<ArrowUpRight size={17} /></a><div className="sidebar-note"><strong>INDEPENDENT PROTOTYPE</strong><span>{t('ที่มา · ข้อมูล · วิธีคิด · ข้อจำกัด')}<br />{t("ข้อมูลสมมติ · ไม่มีการโอนเงินจริง")}</span></div></div>
    </aside>
  </>;
}
