import { useLanguage } from "../i18n/LanguageContext";
import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageIntro, AppLink, SectionHeading, Note } from '../components/ProjectUI';
export default function SimulatorPage() {
  const {
    t
  } = useLanguage();
  return <div className="page-stack">
    <PageIntro eyebrow={t("ทดลองใช้งาน")} title={t("เริ่มจากเว็บแอปที่ใช้ในโครงการ")}>{t("หน้าหลัก แผนใช้เงิน บัญชี โอน / จ่าย และออมเงิน ใช้งานต่อกันได้ในแอปต้นแบบเดียว")}</PageIntro>
    <section className="app-launch"><div><h2>K-NEXUS</h2><p>{t("เปิดแอปต้นแบบจากโปรเจกต์ k-web-application เพื่อเลือกบัญชีทดลอง ลองตั้งงบ ออม ถอนเงิน และตรวจความเสี่ยงก่อนโอน")}</p><div className="button-row"><AppLink>{t("เปิดเว็บแอปในแท็บใหม่")}</AppLink></div><p className="small-note">{t("เปิดบริการแยกบน Render เวลาเริ่มต้นขึ้นกับสถานะของบริการ")}</p></div><span className="launch-symbol" aria-hidden="true">K</span></section>
    <section><SectionHeading title={t("หรือสำรวจแนวคิดในเว็บไซต์นี้")} kicker={t("ตัวอย่างในเบราว์เซอร์ · ไม่ต้องเชื่อมต่อ API")} /><div className="two-columns equal-columns"><Link to="/flowsense" className="demo-choice"><span className="icon-box mint"><Wallet size={21} /></span><div><h3>{t("ลองวางแผนใช้เงิน")}</h3><p>{t("เปลี่ยนยอด บิล งบรายวัน แล้วลองออม")}</p></div><ArrowRight size={18} /></Link><Link to="/trustgraph" className="demo-choice"><span className="icon-box lilac"><ShieldCheck size={21} /></span><div><h3>{t("ดูเหตุผลก่อนโอน")}</h3><p>{t("เปรียบเทียบการเตือนจากสามสถานการณ์")}</p></div><ArrowRight size={18} /></Link></div></section>
    <Note>{t("ทั้งเว็บแอปและตัวอย่างในหน้านี้ใช้ข้อมูลสมมติ ไม่มีการเชื่อมต่อบัญชีธนาคารหรือโอนเงินจริง")}</Note>
    <details className="technical-details"><summary>{t("เดโมเวอร์ชันก่อนหน้า")}</summary><p>{t("เก็บ simulator เดิมไว้สำหรับเปรียบเทียบพัฒนาการ หน้าตาและกติกาบางส่วนต่างจากเว็บแอปปัจจุบัน")}</p><a className="legacy-link" href="/simulator.html" target="_blank" rel="noreferrer">{t("เปิด simulator เดิม ↗")}</a></details>
  </div>;
}
