import { useLanguage } from "../i18n/LanguageContext";
import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowRight, Target, ArrowDownLeft, RotateCcw, Send } from 'lucide-react';
import { AppLink, Note, TextLink } from '../components/ProjectUI';
export default function HomePage() {
  const {
    t
  } = useLanguage();
  return <div className="page-stack">
    <section className="overview-hero">
      <div className="hero-copy"><span className="section-kicker">{t("แนวคิดเบื้องหลังเว็บแอป")}</span><h1>{t("รู้ว่าเงินพอใช้แค่ไหน")}<br /><span>{t("ก่อนออม ก่อนโอน")}</span></h1><p>{t("FlowSense ช่วยวางแผนเงินจนถึงวันเงินเดือนออก")}<br className="desktop-break" />{t(" ส่วน TrustGraph ช่วยให้เห็นเหตุผลความเสี่ยงก่อนโอน")}<br className="desktop-break" />{t(" ทั้งสองส่วนอยู่ในประสบการณ์ธนาคารเดียวกัน")}</p><div className="button-row"><AppLink>{t("ลองใช้งานเว็บแอป")}</AppLink><TextLink to="/architecture">{t("ดูวิธีทำงาน")}</TextLink></div><span className="hero-footnote">{t("โครงการต้นแบบ · ใช้ข้อมูลสมมติในการสาธิต")}</span></div>
      <div className="account-preview"><div className="preview-heading"><span>{t("ตัวอย่างจากแนวคิดในแอป")}</span><span>{t("บัญชีทดลอง")}</span></div><div className="preview-wallet"><span>{t("เงินในบัญชีหลัก")}</span><strong>฿24,500<span>.00</span></strong><div className="preview-pockets"><div><span>{t("บิลที่ต้องกันไว้")}</span><b>฿5,650</b></div><div><span>{t("เงินสำรอง")}</span><b>฿5,000</b></div></div></div><div className="preview-actions">{[[Send, t("โอนเงิน"), '/trustgraph'], [ArrowDownLeft, t("ออมเงิน"), '/flowsense'], [RotateCcw, t("ถอนเงินออม"), '/flowsense'], [Target, t("แผนใช้เงิน"), '/flowsense']].map(([Icon, label, to]) => <Link key={label} to={to}><span><Icon size={20} /></span>{t(label)}</Link>)}</div><div className="preview-budget"><div><span>{t("หลังกันบิลและเงินสำรอง")}</span><strong>฿13,850</strong><small>{t("เฉลี่ย ฿989 ต่อวัน สำหรับตัวอย่าง 14 วัน")}</small></div><Link to="/flowsense" className="round-link" aria-label={t("ลองคำนวณแผนใช้เงิน")}><ArrowRight size={21} /></Link></div><p className="preview-caption">{t("ตัวอย่างการคำนวณเพื่ออธิบายแนวคิด ไม่ใช่ยอดบัญชีจริง")}</p></div>
    </section>
    <section className="feature-stories" aria-label={t("สองจังหวะที่อยากช่วยผู้ใช้")}><div className="section-heading"><div><span className="section-kicker">{t("เริ่มจากสิ่งที่คนใช้ธนาคารต้องตัดสินใจ")}</span><h2>{t("เงินก้อนเดียว มีทั้งค่าใช้ชีวิตและความเสี่ยง")}</h2></div></div>
      <article className="feature-story"><span className="story-number">01</span><div className="story-question"><span className="icon-box mint"><Wallet size={22} /></span><h3>{t("“มีเงินในบัญชี")}<br />{' '}{t("แต่ใช้ได้จริงเท่าไร?”")}</h3></div><div className="story-answer"><span className="module-name">{t("FlowSense · แผนใช้เงินและออมเงิน")}</span><p>{t("แยกยอดคงเหลือออกจากเงินที่ต้องเก็บไว้จ่ายบิล ให้ผู้ใช้ลองตั้งงบรายวัน แล้วค่อยตัดสินใจว่าจะออมเท่าไร การออมต้องเปิดเองและถอนกลับได้")}</p><TextLink to="/flowsense">{t("ลองเปลี่ยนงบและยอดเงิน")}</TextLink></div></article>
      <article className="feature-story"><span className="story-number">02</span><div className="story-question"><span className="icon-box lilac"><ShieldCheck size={22} /></span><h3>{t("“ก่อนกดโอน")}<br />{' '}{t("มีอะไรที่ควรรู้?”")}</h3></div><div className="story-answer"><span className="module-name">{t("TrustGraph · ตรวจความเสี่ยงก่อนโอน")}</span><p>{t("ตรวจข้อมูลผู้รับและรูปแบบธุรกรรม แล้วแสดงเหตุผลเมื่อรายการน่าสงสัย ในเว็บแอปมีขั้นตอนทบทวนรายการเสี่ยงและบล็อกผู้รับที่ถูกระบุไว้ในข้อมูลทดลอง")}</p><TextLink to="/trustgraph">{t("ดูตัวอย่างการเตือนก่อนโอน")}</TextLink></div></article>
    </section>
    <section className="reading-strip"><div><span className="section-kicker">{t("สำหรับคนที่อยากดูเบื้องหลัง")}</span><h2>{t("ดูให้ถึงข้อมูลที่ใช้ และสิ่งที่ยังต้องทดสอบ")}</h2><p>{t("มีโมเดลและ API ในต้นแบบ ส่วนผลจากข้อมูลสมมติยังใช้ยืนยันผลกับลูกค้าจริงไม่ได้")}</p></div><TextLink to="/dataset">{t("สำรวจข้อมูลและข้อจำกัด")}</TextLink></section>
    <Note>{t("เว็บไซต์นี้อธิบายโครงการและมีตัวอย่างคำนวณในเบราว์เซอร์ ส่วนปุ่ม “เปิดเว็บแอป” จะพาไปยังแอปต้นแบบในโปรเจกต์ K-NEXUS-Web ซึ่งมีขั้นตอนใช้งานครบกว่า")}</Note>
  </div>;
}
