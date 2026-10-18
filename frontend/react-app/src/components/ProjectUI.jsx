import { useLanguage } from "../i18n/LanguageContext";
import React from 'react';
import { ArrowRight, ArrowUpRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
export const WEB_APP_URL = 'https://k-nexus-app.onrender.com/';
export const money = (value, digits = 0) => new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);
export function PageIntro({
  eyebrow,
  title,
  children
}) {
  const {
    t
  } = useLanguage();
  return <div className="page-intro"><span className="section-kicker">{t(eyebrow)}</span><h1>{t(title)}</h1>{children && <p>{t(children)}</p>}</div>;
}
export function AppLink({
  children,
  secondary = false
}) {
  const {
    t
  } = useLanguage();
  return <a className={secondary ? 'secondary-button' : 'primary-button'} href={WEB_APP_URL} target="_blank" rel="noreferrer">{t(children ?? 'เปิดเว็บแอป')}<ArrowUpRight size={17} /></a>;
}
export function TextLink({
  to,
  children
}) {
  const {
    t
  } = useLanguage();
  return <Link className="text-link" to={to}>{t(children)}<ArrowRight size={16} /></Link>;
}
export function Note({
  children,
  warm = false
}) {
  const {
    t
  } = useLanguage();
  return <div className={'context-note ' + (warm ? 'warm' : '')}><Info size={17} /><p>{t(children)}</p></div>;
}
export function SectionHeading({
  kicker,
  title,
  children
}) {
  const {
    t
  } = useLanguage();
  return <div className="section-heading"><div>{kicker && <span className="section-kicker">{t(kicker)}</span>}<h2>{t(title)}</h2></div>{t(children)}</div>;
}
