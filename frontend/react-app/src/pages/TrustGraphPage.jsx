import { useLanguage } from "../i18n/LanguageContext";
import React from 'react';
import TrustGraphCard from '../components/TrustGraphCard';
import { PageIntro, Note, AppLink, TextLink, SectionHeading } from '../components/ProjectUI';
export default function TrustGraphPage() {
  const {
    t
  } = useLanguage();
  return <div className="page-stack">
    <PageIntro eyebrow={t("TrustGraph · ตรวจความเสี่ยงก่อนโอน")} title={t("คำเตือนควรบอกได้ ว่าเสี่ยงเพราะอะไร")}>{t("ให้ข้อมูลผู้ใช้ก่อนกดยืนยัน แยกระหว่างรายการทั่วไป รายการที่ต้องตรวจสอบเพิ่ม และผู้รับที่ไม่อนุญาตให้โอนในข้อมูลทดลอง")}</PageIntro>
    <Note>{t("ตัวอย่างด้านล่างเป็นการสาธิตหน้าจอด้วยสถานการณ์ที่กำหนดไว้ ไม่ได้วิเคราะห์บัญชีจริง ปุ่มเปิดเว็บแอปจะพาไปทดลองขั้นตอนตรวจความเสี่ยงผ่าน API")}</Note>
    <TrustGraphCard />
    <section><SectionHeading title={t("เมื่อไปทดลองในเว็บแอป")} kicker={t("พฤติกรรมของต้นแบบใน K-NEXUS-Web")} /><ol className="process-list"><li><h3>{t("เลือกผู้รับและระบุจำนวนเงิน")}</h3><p>{t("ระบบตรวจข้อมูลผู้รับและสัญญาณธุรกรรมจากบัญชีสมมติ ก่อนเข้าสู่ขั้นตอนทำรายการ")}</p></li><li><h3>{t("ถ้ามีความเสี่ยง ให้เหตุผลและเวลาทบทวน")}</h3><p>{t("ช่วงทบทวนรายการเสี่ยงตั้งต้นไว้ 15 นาทีและควบคุมที่เซิร์ฟเวอร์ ผู้ใช้เปลี่ยนการตั้งค่าสำหรับรายการใหม่ได้ การรอครบเวลาไม่ส่งเงินอัตโนมัติและไม่รับรองว่าปลอดภัย")}</p></li><li><h3>{t("ยืนยันตามเงื่อนไข หรือยกเลิกรายการ")}</h3><p>{t("การยืนยันตัวตนในต้นแบบเป็นการจำลอง ส่วนผู้รับที่ถูกบล็อกยังทำรายการไม่ได้ ผลทั้งหมดเป็นธุรกรรมสมมติ")}</p></li></ol></section>
    <Note warm>{t("โมเดล TrustGraph ยังต้องประเมินใหม่โดยป้องกันข้อมูลคำตอบรั่วเข้าสู่การฝึก จึงไม่แสดงค่าความแม่นยำเดิมเป็นหลักฐานว่าป้องกันการหลอกโอนได้จริง")}</Note>
    <div className="button-row"><AppLink>{t("ลองโอนในเว็บแอปต้นแบบ")}</AppLink><TextLink to="/dataset">{t("อ่านข้อจำกัดของข้อมูลและโมเดล")}</TextLink></div>
  </div>;
}
