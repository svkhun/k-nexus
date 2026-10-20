import { useLanguage } from "../i18n/LanguageContext";
import React, { useState } from 'react';
import { Target, Wallet, ArrowRight, TrendingDown, RotateCcw, ArrowDownLeft } from 'lucide-react';
import MicroSweepVault from '../components/MicroSweepVault';
import { PageIntro, Note, SectionHeading, AppLink, TextLink, money } from '../components/ProjectUI';
export default function FlowSensePage() {
  const {
    t
  } = useLanguage();
  const [balance, setBalance] = useState(24500);
  const [bills, setBills] = useState(5650);
  const [savings, setSavings] = useState(15240);
  const [dailyBudget, setDailyBudget] = useState(600);
  const days = 14;
  const [reserve, setReserve] = useState(5000);
  const available = Math.max(0, balance - bills - reserve);
  const dailyAllowance = available / days;
  const endBalance = balance - bills - dailyBudget * days;
  const shortfall = Math.max(0, reserve - endBalance);
  const changeAmount = setter => event => {
    const value = Number(event.target.value);
    if (Number.isFinite(value)) setter(Math.max(0, Math.min(1000000, value)));
  };
  const focusControl = id => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ block: 'center' });
    element?.focus({ preventScroll: true });
  };
  return <div className="page-stack">
    <PageIntro eyebrow={t("FlowSense · แผนใช้เงินและออมเงิน")} title={t("ยอดในบัญชี ไม่ใช่เงินที่ใช้ได้ทั้งหมด")}>{t("ลองกันบิลและเงินสำรองออกก่อน แล้วเปลี่ยนงบรายวันเพื่อดูว่าเงินจะเหลือเท่าไร จากนั้นจึงเลือกแยกเงินออมด้วยตัวเอง")}</PageIntro>
    <Note>{t("ตัวอย่างนี้คำนวณในเบราว์เซอร์ ใช้ช่วงสมมติ 14 วันก่อนเงินเดือนออกและเงินสำรอง ฿5,000 ไม่ได้เรียกโมเดลพยากรณ์หรือเปลี่ยนยอดในเว็บแอป")}</Note>
    <div className="two-columns">
      <section className="surface panel" aria-labelledby="budget-title">
        <div className="surface-title"><div><h2 id="budget-title">{t("ลองวางแผนใช้เงิน")}</h2><p>{t("อีก 14 วันถึงเงินเดือน · สถานการณ์สมมติ")}</p></div><span className="icon-box mint"><Target size={21} /></span></div>
        <label className="field-label" htmlFor="main-balance">{t("เงินในบัญชีหลัก (บาท)")}</label>
        <div className="amount-input"><span>฿</span><input id="main-balance" type="number" min="0" max="1000000" step="0.01" value={balance} onChange={changeAmount(setBalance)} inputMode="decimal" /></div>
        <div className="preset-row">{[[32000, t("เงินเดือนเข้า")], [24500, t("ระหว่างเดือน")], [13000, t("บิลใกล้ถึง")]].map(([amount, label]) => <button key={amount} aria-pressed={balance === amount} onClick={() => setBalance(amount)}>{t(label)}</button>)}</div>
        <div className="field-group"><label className="field-label" htmlFor="fixed-bills">{t("บิลที่ต้องจ่ายก่อนเงินเดือนออก (บาท)")}</label><div className="amount-input"><span>฿</span><input id="fixed-bills" type="number" min="0" max="1000000" step="0.01" value={bills} onChange={changeAmount(setBills)} inputMode="decimal" /></div></div>
        <div className="field-group"><label className="field-label" htmlFor="reserve-input">{t("เงินสำรองเผื่อฉุกเฉิน (บาท)")}</label><div className="amount-input"><span>฿</span><input id="reserve-input" type="number" min="500" max="1000000" step="100" value={reserve} onChange={changeAmount(setReserve)} inputMode="decimal" /></div><div className="preset-row">{[[500, '500'], [3000, '3000'], [5000, '5000'], [10000, '10000']].map(([amount, label]) => <button key={amount} type="button" aria-pressed={reserve === amount} onClick={() => setReserve(amount)}>฿{money(amount)}</button>)}</div></div>
        <dl className="calculation-list"><div><dt>{t("กันเงินสำรองไว้")}</dt><dd>฿{money(reserve)}</dd></div><div><dt>{t("เหลือหลังกันบิลและเงินสำรอง")}</dt><dd>฿{money(available, 2)}</dd></div><div><dt>{t("เฉลี่ยต่อวันสำหรับ 14 วัน")}</dt><dd>฿{money(dailyAllowance, 2)}</dd></div></dl>
        <div className="field-group"><label className="field-label" htmlFor="daily-budget">{t("ลองใช้วันละ ฿")}{money(dailyBudget)}</label><input id="daily-budget" type="range" min="0" max="2000" step="50" value={dailyBudget} onChange={e => setDailyBudget(Number(e.target.value))} /></div>
        <div className={'budget-result ' + (shortfall > 0 ? 'needs-attention' : '')} aria-live="polite"><span>{t("คาดว่าจะเหลือก่อนเงินเดือนออก")}</span><strong>฿{money(endBalance, 2)}</strong><p>{shortfall > 0 ? t("ต่ำกว่าเงินสำรองที่ตั้งไว้ ฿") + money(shortfall, 2) + t(" ลองลดงบรายวันหรือพักการออมเพิ่ม") : t("ตามสมมติฐานนี้ เงินยังเหลือถึงระดับเงินสำรองที่ตั้งไว้")}</p></div>
        <p className="small-note">{t("สูตรตัวอย่าง: เงินในบัญชี − บิล − (งบรายวัน × 14) ตัวอย่างนี้ยังไม่รวมรายรับหรือรายจ่ายอื่นที่อาจเกิดขึ้น")}</p>
      </section>
      <MicroSweepVault mainBalance={balance} setMainBalance={setBalance} fixedCommitments={bills} projectedLivingCost={dailyBudget * days} emergencyBuffer={reserve} subAccountBalance={savings} setSubAccountBalance={setSavings} />
    </div>
    <section><SectionHeading kicker={t('จัดเงินให้พอใช้ถึงวันเงินเดือน')} title={t('เมื่อเงินตึง ยังมีทางเลือก')} /><div className="liquidity-options">
      <article><span className="icon-box mint"><TrendingDown size={22} /></span><h3>{t('ลองลดรายจ่าย')}</h3><p>{t('ลดงบรายวันครั้งละ ฿50 แล้วดูเงินที่คาดว่าจะเหลือในตัวอย่าง')}</p><button className="text-link" disabled={dailyBudget <= 0} onClick={() => { setDailyBudget(value => Math.max(0, value - 50)); focusControl('daily-budget'); }}>{t('ลดงบวันละ ฿50')}<ArrowRight size={16} /></button></article>
      <article><span className="icon-box peach"><RotateCcw size={22} /></span><h3>{t('ใช้เงินออมเมื่อจำเป็น')}</h3><p>{t('เลือกถอนบางส่วนหรือทั้งหมดกลับบัญชีหลัก เป็นการถอนเงินออมตามปกติ')}</p><button className="text-link" onClick={() => focusControl('savings-example')}>{t('เลือกจำนวนเงินถอน')}<ArrowRight size={16} /></button></article>
      <article><span className="icon-box mint"><ArrowDownLeft size={22} /></span><h3>{t('ออมเฉพาะส่วนเกิน')}</h3><p>{t('กันบิล งบใช้ชีวิต และเงินสำรองก่อน เมื่อไม่มีส่วนเกิน ตัวอย่างจะไม่เปิดให้กดออมเพิ่ม')}</p><button className="text-link" onClick={() => focusControl('savings-opt-in')}>{t('ดูเงินส่วนที่พร้อมออม')}<ArrowRight size={16} /></button></article>
    </div></section>
    <section><SectionHeading kicker={t("จากตัวอย่างคำนวณ ไปสู่เว็บแอป")} title={t("แต่ละส่วนทำหน้าที่ต่างกัน")} /><dl className="explanation-list"><div><dt>{t("แผนใช้เงิน")}</dt><dd>{t("แสดงงบที่ใช้เพิ่มได้วันนี้และให้ลองตั้งงบ ก่อนตัดสินใจจริง การคำนวณงบเป็นกติกาที่อ่านสูตรได้ แยกจากผลคาดการณ์รายจ่ายของโมเดล")}</dd></div><div><dt>{t("แนวโน้มเงินเข้า–ออก")}</dt><dd>{t("ในเว็บแอปมีกราฟเงินคงเหลือและบิลล่วงหน้า โดยใช้ผลพยากรณ์จากโมเดลร่วมกับข้อมูลบัญชีสมมติ ผลลัพธ์เป็นค่าประมาณของต้นแบบ")}</dd></div><div><dt>{t("ออมเงินและถอนเงิน")}</dt><dd>{t("การเปิดออมอย่างเดียวไม่ย้ายเงิน แต่ละรายการต้องสั่งเองและต้องเหลือเงินตามกติกาที่กำหนด ส่วนการถอนเลือกบางส่วนหรือทั้งหมดได้ เป็นการถอนเงินออม ไม่ใช่การย้อนคืนธุรกรรมโอน")}</dd></div></dl></section>
    <div className="button-row"><AppLink>{t("ลองแผนใช้เงินในเว็บแอป")}</AppLink><TextLink to="/architecture">{t("ดูการคำนวณและโมเดล")}</TextLink></div>
  </div>;
}
