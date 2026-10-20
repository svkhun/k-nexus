import { useLanguage } from "../i18n/LanguageContext";
import React, { useState } from 'react';
import { User, AlertTriangle, ShieldCheck, Check, Ban, ArrowRight } from 'lucide-react';
import MicroAuthModal from './MicroAuthModal';
import { money } from './ProjectUI';
const recipients = [{
  id: 'normal',
  name: 'บัญชีที่คุ้นเคย',
  detail: 'บัญชีเดิม · รูปแบบการโอนตามตัวอย่างปกติ',
  icon: User,
  tone: 'mint',
  title: 'ไม่พบเงื่อนไขเตือนผู้รับในตัวอย่าง',
  message: 'สถานการณ์นี้ไม่มีกติกาเตือนเพิ่มเติม แต่ผู้ใช้ยังต้องตรวจสอบชื่อและจำนวนเงินก่อนยืนยัน',
  reasons: ['เคยโอนให้ผู้รับรายนี้', 'ไม่มีสัญญาณผิดปกติตามสถานการณ์ที่กำหนด']
}, {
  id: 'review',
  name: 'บัญชีที่ควรตรวจเพิ่ม',
  detail: 'บัญชีเปิดใหม่ · เงินเข้าแล้วโอนออกเร็ว',
  icon: AlertTriangle,
  tone: 'peach',
  title: 'ควรทบทวนรายการนี้ก่อน',
  message: 'มีสัญญาณที่ควรตรวจสอบเพิ่ม จึงแสดงเหตุผลให้ผู้ใช้ตัดสินใจก่อนดำเนินการ',
  reasons: ['บัญชีผู้รับเพิ่งเปิดได้ 48 ชั่วโมงในตัวอย่าง', 'มีรูปแบบรับเงินแล้วโอนออกภายใน 24 วินาที', 'เว็บแอปมีช่วงทบทวนรายการเสี่ยงตามการตั้งค่า']
}, {
  id: 'blocked',
  name: 'บัญชีที่ถูกระงับ',
  detail: 'บัญชีสมมติที่ถูกระบุไว้ในชุดข้อมูล',
  icon: Ban,
  tone: 'lilac',
  title: 'ไม่อนุญาตให้ทำรายการ',
  message: 'ในเว็บแอป ผู้รับที่ถูกบล็อกในข้อมูลทดลองจะไม่ผ่านขั้นตอนโอนเงิน',
  reasons: ['ผู้รับอยู่ในรายชื่อบล็อกของสถานการณ์ทดลอง', 'ต้องไม่หักยอดบัญชีสำหรับรายการที่ถูกบล็อก']
}];
export default function TrustGraphCard() {
  const {
    t
  } = useLanguage();
  const [selected, setSelected] = useState('normal');
  const [amount, setAmount] = useState('1200');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [decision, setDecision] = useState('');
  const recipient = recipients.find(item => item.id === selected);
  const reset = () => {
    setResult(null);
    setError('');
    setDecision('');
  };
  const evaluate = event => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || value > 1000000 || Math.abs(value * 100 - Math.round(value * 100)) > 1e-7) {
      setError('กรอกจำนวนมากกว่า 0 ถึง 1,000,000 บาท และไม่เกินทศนิยม 2 ตำแหน่ง');
      return;
    }
    setError('');
    setResult({
      ...recipient,
      amount: value
    });
    setDecision('');
  };
  return <div>
    <div className="two-columns equal-columns">
      <form className="surface panel" onSubmit={evaluate}>
        <div className="surface-title"><div><h2>{t("ลองเลือกผู้รับ")}</h2><p>{t("สถานการณ์ที่กำหนดไว้เพื่ออธิบายหน้าจอ")}</p></div><span className="icon-box lilac"><ShieldCheck size={21} /></span></div>
        <div className="recipient-options" role="group" aria-label={t("เลือกผู้รับในสถานการณ์ทดลอง")}>{recipients.map(item => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={'recipient-option ' + (selected === item.id ? 'selected' : '')} aria-pressed={selected === item.id} onClick={() => {
              setSelected(item.id);
              reset();
            }}><span className={'icon-box ' + item.tone}><Icon size={20} /></span><span><strong>{t(item.name)}</strong><small>{t(item.detail)}</small></span><span className="recipient-radio">{selected === item.id && <Check size={12} />}</span></button>;
          })}</div>
        <div className="field-group"><label className="field-label" htmlFor="transfer-amount">{t("จำนวนเงินในตัวอย่าง (บาท)")}</label><div className="amount-input"><span>฿</span><input id="transfer-amount" type="number" min="0.01" step="0.01" max="1000000" value={amount} onChange={event => {
              setAmount(event.target.value);
              reset();
            }} inputMode="decimal" /></div></div>
        <div className="preset-row">{[350, 1200, 3000, 12000].map(value => <button type="button" key={value} aria-pressed={Number(amount) === value} onClick={() => {
            setAmount(String(value));
            reset();
          }}>฿{money(value)}</button>)}</div>
        <button className="primary-button full-width" type="submit">{t("ดูผลของสถานการณ์ ")}<ArrowRight size={17} /></button>
        {error && <p role="alert" className="status-message error-message">{t(error)}</p>}
      </form>
      <div aria-live="polite">{result ? <section className={'risk-panel ' + result.id}>
        <span className="risk-kicker"><ShieldCheck size={17} />{t("ผลจากสถานการณ์สมมติ · ฿")}{money(result.amount, 2)}</span><h3>{t(result.title)}</h3><p>{t(result.message)}</p><ul className="risk-reasons">{result.reasons.map(reason => <li key={reason}>{t(reason)}</li>)}</ul>
        <TransferImpact result={result} />
        {result.id === 'review' && <button className="secondary-button" onClick={() => setModal(true)}>{t("ดูหน้าทบทวนรายการ ")}<ArrowRight size={16} /></button>}
        {decision && <p role="status" className="status-message">{t(decision === 'CANCEL' ? 'ยกเลิกตัวอย่างแล้ว ไม่มีการโอนเงิน' : 'จบการดูตัวอย่าง ไม่มีการส่งคำสั่งโอนเงิน')}</p>}
        <p className="small-note">{t("ผลที่แสดงเป็นกติกาของตัวอย่างหน้านี้ ไม่ใช่คะแนนที่เรียกจากโมเดลหรือผลตรวจบัญชีจริง")}</p>
      </section> : <section className="review-initial"><span className="icon-box lilac"><ShieldCheck size={23} /></span><h3>{t("เหตุผลมาก่อนคำเตือน")}</h3><p>{t("เลือกผู้รับและกดดูผล เพื่อเปรียบเทียบรายการทั่วไป รายการที่ควรทบทวน และผู้รับที่ถูกบล็อก")}</p></section>}</div>
    </div>
    <MicroAuthModal isOpen={modal} onClose={() => setModal(false)} onConfirmTransfer={setDecision} />
  </div>;
}

function TransferImpact({ result }) {
  const { t } = useLanguage();
  // Independent illustration, using the same starting values as the FlowSense example.
  const balance = 24500;
  const unavailable = result.id === 'blocked' || result.amount > balance;
  const after = unavailable ? balance : balance - result.amount;
  const projected = after - 5650 - 600 * 14;
  const shortfall = Math.max(0, 5000 - projected);
  return <div className={'transfer-impact ' + (shortfall > 0 ? 'reserve-shortfall' : '')}>
    <h4>{t('เงินหลังโอนกระทบแผนอย่างไร')}</h4>
    <div className="impact-comparison"><div><span>{t('เงินก่อนโอน')}</span><strong>฿{money(balance, 2)}</strong></div><div><span>{t(unavailable ? 'ยอดคงเดิม · ทำรายการไม่ได้' : 'เงินหลังโอนตามสมมติฐาน')}</span><strong>฿{money(after, 2)}</strong></div></div>
    <p>{unavailable ? t('ตัวอย่างนี้ไม่หักยอด เมื่อผู้รับถูกระงับหรือจำนวนเงินเกินยอดบัญชี') : <>{t('หลังกันบิลและงบใช้ชีวิต จะเหลือ ฿')}{money(projected, 2)}{shortfall > 0 ? t(' ต่ำกว่าเงินสำรอง ฿') + money(shortfall, 2) : t(' ยังไม่ต่ำกว่าเงินสำรองที่ตั้งไว้')}</>}</p>
    <p className="small-note">{t('สมมติฐาน: บัญชี ฿24,500 · บิล ฿5,650 · ใช้วันละ ฿600 × 14 วัน · เงินสำรอง ฿5,000 คำนวณแยกจากความเสี่ยงผู้รับและไม่หักยอดจริง')}</p>
  </div>;
}
