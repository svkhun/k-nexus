import { useLanguage } from "../i18n/LanguageContext";
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { money } from './ProjectUI';
const cents = value => Math.round(value * 100) / 100;
export default function MicroSweepVault({
  mainBalance,
  setMainBalance,
  fixedCommitments,
  projectedLivingCost = 8400,
  emergencyBuffer = 5000,
  subAccountBalance,
  setSubAccountBalance
}) {
  const {
    t
  } = useLanguage();
  const [enabled, setEnabled] = useState(false);
  const [withdraw, setWithdraw] = useState('1000');
  const [withdrawAll, setWithdrawAll] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const capacity = cents(Math.max(0, mainBalance - fixedCommitments - projectedLivingCost - emergencyBuffer));
  const sweep = cents(Math.min(150, 500, capacity));
  const moveToSavings = () => {
    if (!enabled || sweep <= 0) return;
    setMainBalance(value => cents(value - sweep));
    setSubAccountBalance(value => cents(value + sweep));
    setError(false);
    setMessage({ key: 'แยกเงินสมมติ ฿{amount} เข้าบัญชีออมแล้ว', params: { amount: money(sweep, 2) } });
  };
  const withdrawSavings = event => {
    event.preventDefault();
    const amount = withdrawAll ? subAccountBalance : Number(withdraw);
    if (!Number.isFinite(amount) || amount <= 0 || amount > subAccountBalance || Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-7) {
      setError(true);
      setMessage({ key: 'กรอกจำนวนมากกว่า 0 ไม่เกินเงินออม และไม่เกินทศนิยม 2 ตำแหน่ง' });
      return;
    }
    setMainBalance(value => cents(value + amount));
    setSubAccountBalance(value => cents(value - amount));
    setError(false);
    setMessage({ key: 'ถอนเงินสมมติ ฿{amount} กลับบัญชีหลักแล้ว', params: { amount: money(amount, 2) } });
  };
  return <section id="savings-example" className="surface panel" aria-labelledby="savings-title" tabIndex={-1}>
    <div className="surface-title"><div><h2 id="savings-title">{t("ออมเงินและถอนเงิน")}</h2><p>{t("ยอดเชื่อมกับแผนใช้เงินในหน้านี้")}</p></div><span className="icon-box peach"><Wallet size={21} /></span></div>
    <div className="balance-summary"><div><span>{t("เงินออมในบัญชีทดลอง")}</span><strong>฿{money(subAccountBalance, 2)}</strong></div></div>
    <span className="field-label">{t("เงินส่วนที่พร้อมออมในตัวอย่าง")}</span><h3 className="number">฿{money(capacity, 2)}</h3><p className="small-note">{t("หักบิล งบรายวันตลอด 14 วัน และเงินสำรอง ฿")}{money(emergencyBuffer)}{t(" จากบัญชีหลักแล้ว")}</p>
    <label className="check-label"><input id="savings-opt-in" type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />{t("เปิดการออมด้วยตัวเอง")}</label>
    <button className="primary-button full-width" disabled={!enabled || sweep <= 0} onClick={moveToSavings}>{t("ทดลองออม ฿")}{money(sweep, 2)}</button>
    <p className="small-note">{t("ตัวอย่างย้ายครั้งละไม่เกิน ฿150 ภายในวงเงินพร้อมออม การเปิดออมอย่างเดียวไม่ย้ายเงิน")}</p>
    <form onSubmit={withdrawSavings} className="field-group">
      <label className="field-label" htmlFor="withdraw-amount">{t("ถอนเงินออมกลับบัญชีหลัก (บาท)")}</label>
      <div className="amount-input"><span>฿</span><input id="withdraw-amount" type="number" min="0.01" step="0.01" max={subAccountBalance} value={withdraw} onChange={event => setWithdraw(event.target.value)} disabled={withdrawAll || subAccountBalance <= 0} inputMode="decimal" /></div>
      <label className="check-label"><input type="checkbox" checked={withdrawAll} onChange={event => setWithdrawAll(event.target.checked)} disabled={subAccountBalance <= 0} />{t("ถอนทั้งหมด")}</label>
      <button type="submit" className="secondary-button full-width" disabled={subAccountBalance <= 0}>{t("ถอนเงินออม")}</button>
    </form>
    {message && <p role={error ? 'alert' : 'status'} className={'status-message ' + (error ? 'error-message' : '')}>{t(message.key, message.params)}</p>}
    <p className="small-note">{t("ยอดทั้งหมดเป็นสถานะชั่วคราวในหน้านี้ ออกจากหน้าหรือโหลดใหม่จะกลับสู่ค่าเริ่มต้น")}</p>
  </section>;
}
