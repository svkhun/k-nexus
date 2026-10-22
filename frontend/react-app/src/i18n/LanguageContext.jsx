import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import { translate } from './translate.mjs';
const LanguageContext = createContext(null);
export const LANGUAGE_STORAGE_KEY = 'flowsense-showcase-language';
export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'th'; }
    catch { return 'th'; }
  });
  const setLanguage = useCallback(next => {
    if (next !== 'th' && next !== 'en') return;
    updateLanguage(next);
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, next); } catch { /* Preferences remain usable without storage. */ }
  }, []);
  const t = useCallback((text, params) => translate(text, language, params), [language]);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'th'
      ? 'K-NEXUS Showcase | ที่มา ข้อมูล และ Machine Learning'
      : 'K-NEXUS Showcase | Problem, Data & Machine Learning';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = language === 'th'
      ? 'เบื้องหลัง K-NEXUS: ปัญหาที่เป็นจุดเริ่มต้น ข้อมูลและโมเดลของ FlowSense / TrustGraph วิธีแก้ปัญหา พัฒนาการจาก feedback และขอบเขตของหลักฐาน'
      : 'Behind K-NEXUS: the starting problem, FlowSense and TrustGraph data and models, solution design, feedback-driven evolution and evidence boundaries.';
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}
