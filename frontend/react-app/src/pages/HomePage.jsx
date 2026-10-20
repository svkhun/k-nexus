import { useLanguage } from '../i18n/LanguageContext';
import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, ArrowRight, LineChart, ArrowDownLeft, RotateCcw, Send, CircleHelp } from 'lucide-react';
import { AppLink, Note, TextLink, SectionHeading } from '../components/ProjectUI';

export default function HomePage() {
  const { t } = useLanguage();
  return <div className="page-stack">
    <section className="overview-hero">
      <div className="hero-copy">
        <span className="section-kicker">K-NEXUS · FlowSense × TrustGraph</span>
        <h1>{t('จัดเงินให้พอใช้')}<br /><span>{t('ถึงวันเงินเดือน')}</span></h1>
        <p>{t('เห็นเงินหลังหักบิล ลองลดรายจ่าย หรือเลือกถอนเงินออมเมื่อจำเป็น ก่อนโอน ดูทั้งความเสี่ยงผู้รับและเงินที่จะเหลือไว้ใช้ชีวิต')}</p>
        <div className="button-row"><AppLink>{t('ทดลอง K-NEXUS App')}</AppLink><TextLink to="/flowsense">{t('เริ่มจากแผนใช้เงิน')}</TextLink></div>
        <span className="hero-footnote">{t('Showcase อธิบายแนวคิด · App สำหรับทดลองขั้นตอนใช้งาน')}</span>
      </div>
      <div className="product-preview">
        <div className="preview-heading"><span>{t('ภาพประกอบแนวคิดในแอป')}</span><span>{t('บัญชีสมมติ · เมย์')}</span></div>
        <div className="account-preview">
          <div className="preview-wallet"><div className="preview-account-name"><span>{t('บัญชีหลัก')}</span><Wallet size={21} /></div><small>xxx-x-xxx100</small><div className="preview-balance"><span>{t('เงินในบัญชีหลัก')}</span><strong>฿24,500<span>.00</span></strong><Link to="/flowsense">{t('ดูการแบ่งเงิน')}<ArrowRight size={14} /></Link></div></div>
          <div className="preview-actions">{[[Send, 'โอนเงิน', '/trustgraph', 'mint'], [ArrowDownLeft, 'ออมเงิน', '/flowsense', 'lime'], [RotateCcw, 'ถอนเงินออม', '/flowsense', 'gold'], [LineChart, 'แผนใช้เงิน', '/flowsense', 'blue']].map(([Icon, label, to, tone]) => <Link key={label} to={to} data-tone={tone}><span><Icon size={21} strokeWidth={1.7} /></span>{t(label)}</Link>)}</div>
        </div>
        <div className="preview-budget"><div><span>{t('งบเฉลี่ยต่อวันในตัวอย่าง')}</span><strong>฿989<span>.29</span></strong><small>{t('หลังกันบิล ฿5,650 และเงินสำรอง ฿5,000 · 14 วัน')}</small></div><Link to="/flowsense" className="round-link" aria-label={t('ลองคำนวณแผนใช้เงิน')}><ArrowRight size={21} /></Link></div>
        <p className="preview-caption">{t('ตัวเลขเพื่ออธิบายสูตร ไม่ใช่ยอดหรือคำแนะนำเฉพาะบุคคลจากแอป')}</p>
      </div>
    </section>

    <section className="feature-stories" aria-label={t('สองจังหวะที่อยากช่วยผู้ใช้')}>
      <SectionHeading kicker={t('เริ่มจากการตัดสินใจในแต่ละวัน')} title={t('เงินต้องพอใช้ และโอนอย่างรอบคอบ')} />
      <div className="module-grid">
        <article className="module-story flow-module"><span className="icon-box mint"><Wallet size={23} /></span><span className="module-name">FlowSense</span><h3>{t('ใช้ได้เท่าไร ออมได้แค่ไหน')}</h3><p>{t('กันบิลและเงินสำรองก่อนตั้งงบรายวัน ดูแนวโน้มเงินจนถึงวันเงินเดือน แล้วเลือกออมเฉพาะส่วนเกินหรือถอนเงินออมกลับมาใช้เมื่อจำเป็น')}</p><TextLink to="/flowsense">{t('ลองเปลี่ยนงบและยอดเงิน')}</TextLink></article>
        <article className="module-story trust-module"><span className="icon-box peach"><ShieldCheck size={23} /></span><span className="module-name">TrustGraph</span><h3>{t('เช็กผู้รับ พร้อมดูเงินหลังโอน')}</h3><p>{t('อ่านเหตุผลความเสี่ยงของผู้รับควบคู่กับผลกระทบต่อบิล งบใช้ชีวิต และเงินสำรอง แล้วเลือกทบทวน ยกเลิก หรือทำตามเงื่อนไขของรายการ')}</p><TextLink to="/trustgraph">{t('ดูตัวอย่างการเตือนก่อนโอน')}</TextLink></article>
      </div>
    </section>

    <section className="app-journey">
      <SectionHeading kicker={t('ลองต่อใน K-NEXUS App')} title={t('จากแผนเงิน ไปถึงจังหวะก่อนกดโอน')} />
      <ol className="journey-steps">
        <li><span>01</span><div><h3>{t('เลือกบัญชีและสถานการณ์')}</h3><p>{t('เริ่มจากเมย์ นนท์ หรือแพรว แล้วลองสถานการณ์เงินเดือนเข้า บิลใกล้ถึง หรือรายจ่ายเพิ่ม')}</p></div></li>
        <li><span>02</span><div><h3>{t('จัดบิล งบรายวัน และเงินสำรอง')}</h3><p>{t('ลองตั้งงบให้พอถึงวันเงินเดือน เปิดออมเมื่อพร้อม และถอนเงินออมบางส่วนหรือทั้งหมดได้ตามปกติ')}</p></div></li>
        <li><span>03</span><div><h3>{t('ทบทวนความเสี่ยงและสภาพคล่อง')}</h3><p>{t('เปรียบเทียบผู้รับสามแบบ ดูเงินก่อนและหลังโอน รายการเสี่ยงมีขั้นตอนทบทวน และผู้รับที่ถูกระงับทำรายการไม่ได้')}</p></div></li>
      </ol>
      <div className="journey-footer"><span><CircleHelp size={17} />{t('ในแอปมีคำแนะนำพาเดินทีละขั้น')}</span><AppLink>{t('เปิดแอปแล้วลองตามขั้นตอน')}</AppLink></div>
    </section>

    <section className="reading-strip"><div><span className="section-kicker">{t('สำหรับคนที่อยากดูเบื้องหลัง')}</span><h2>{t('ดูให้ถึงข้อมูลที่ใช้ และสิ่งที่ยังต้องทดสอบ')}</h2><p>{t('มีโมเดลและ API ในต้นแบบ ส่วนผลจากข้อมูลสมมติยังใช้ยืนยันผลกับลูกค้าจริงไม่ได้')}</p></div><TextLink to="/dataset">{t('สำรวจข้อมูลและข้อจำกัด')}</TextLink></section>
    <Note>{t('ทั้ง Showcase และ App ใช้ข้อมูลสมมติ ไม่มีการเชื่อมต่อบัญชีธนาคารหรือโอนเงินจริง ตัวอย่างใน Showcase คำนวณแยกจากสถานะในแอป')}</Note>
  </div>;
}
