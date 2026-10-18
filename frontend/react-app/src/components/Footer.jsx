import { useLanguage } from "../i18n/LanguageContext";
import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer() {
  const {
    t
  } = useLanguage();
  return <footer className="project-footer"><div><strong>K-NEXUS</strong><p>{t("Independent prototype · ไม่ใช่ผลิตภัณฑ์ทางการของ KBank")}</p></div><Link to="/dataset">{t("ที่มาของข้อมูลและข้อจำกัด ↗")}</Link></footer>;
}
