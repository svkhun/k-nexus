import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { StudySection, StudyTable, StudyNote, StudyCards } from './ResearchUI';
import evidence from '../data/applicationBaseline.json';

const assetRoot = '/evidence/application-baseline-2026-10-29/';
const copy = {
  th: {
    title: 'สิ่งที่ Application ใช้ใน local ตอนนี้',
    intro: 'กราฟ แผนใช้เงิน การออม และ review ก่อนโอน ใช้ฐานรายจ่ายเดียวกัน เป็น baseline ที่อธิบายที่มาได้ ส่วน FlowSense ML ยังปิดอยู่',
    methods: [
      ['HISTORY_MEAN', 'เฉลี่ยรายจ่าย non-bill จาก 28 วันปิดล่าสุด เมื่อมี complete known อย่างน้อย 7 วัน ระบุ N/28; known zero นับเป็นข้อมูล แต่ missing/partial ไม่แทนศูนย์'],
      ['SCENARIO', 'เมื่อประวัติไม่พอ ใช้สมมติฐาน non-bill รายวันแบบมี version และช่วงเวลาที่ใช้ได้ ทั้งสาม persona เริ่มด้วยวิธีนี้'],
      ['ABSTAIN', 'หากไม่มีทั้งประวัติที่พอและ scenario ที่ใช้ได้ ส่ง null พร้อมเหตุผล กราฟเว้นช่องและไม่เสนอวงเงินออมจาก forecast ที่ไม่ทราบ'],
    ],
    headers: ['Persona / บัญชีสังเคราะห์', 'วิธี / วันที่ทราบ', 'สมมติ non-bill บาท/วัน'],
    source: 'กำหนดสำหรับเดโม ไม่ใช่ค่าเฉลี่ยจากธุรกรรมจริง และไม่รวมบิล',
    origin: 'เริ่มที่ยอดปัจจุบันและ as-of แสดงวันนี้ + 30 วันอนาคต โดยเริ่มสมมติรายจ่ายพรุ่งนี้ รายจ่ายที่ลงบัญชีวันนี้รวมในยอดปัจจุบันแล้ว บิลและเงินเดือนอนาคตเป็น projection บนสำเนา ไม่ใช่การลงเงินจริง',
    consistency: 'ทุก consumer ใช้ฐานรายจ่ายและภาระถึงก่อน payday ถัดไป รวมบิลเดือนถัดไป การอ่านกราฟไม่ชำระบิลจริง และการเปลี่ยนสถานะต้อง review ใหม่ก่อนยืนยันโอน',
    screenshots: 'ดูภาพหลักฐาน local และที่มาของข้อมูล',
    captions: [
      'SCENARIO · เมย์ 350 บาท/วัน · local demo, synthetic data · 29 ต.ค. 2026',
      'HISTORY_MEAN N7/28 · 85.71 บาท/วัน · acceptance fixture เขียนมือเพื่อทดสอบ ไม่ใช่ประวัติจริงของเมย์หรือข้อมูล research ที่ย้ายวันมาใช้',
      'ABSTAIN · acceptance fixture: ความสามารถออมที่พึ่ง forecast เป็น unavailable แต่ยังถอนเงินออมเดิมได้ ไม่ใช่การรับรองว่าผู้ใช้มีรายจ่ายศูนย์',
    ],
    verification: 'Application handoff รายงาน backend 148, frontend 26, build, HTTP จริง และ browser smoke ตามขอบเขต ภาพและผลเหล่านี้มาจากรอบ Application ไม่ใช่การรันทดสอบ Application ซ้ำใน Showcase',
    boundary: 'ตรวจเฉพาะ local demo ยังไม่ยืนยันว่าลิงก์แอปสาธารณะเป็นรุ่นเดียวกัน ไม่ใช่ validated AI forecast และยังไม่มีหลักฐานความแม่นยำ 30 วัน ผลกับผู้ใช้จริง หรือ iPad จริง',
    provenance: 'ดู source versions และ SHA-256',
    researchTitle: 'ผล ML รอบ Gate2: ยังไม่ผ่านเกณฑ์เชื่อมแอป',
    researchIntro: 'fs-gate2-20261028-01 · synthetic v2.1.1 · 32 accounts / 16 designed cohorts ผลด้านล่างเป็น test seen/natural แบบ paired บนแถวเดียวกัน หน่วย cumulative MAE = บาท/account-origin',
    researchHeaders: ['Horizon วัน', 'Candidate MAE', 'Account mean MAE', 'Paired origins'],
    researchLimit: 'แต่ละ horizon ยังมี candidate-only scored อีก 6 origins ไม่ถูกรวมใน paired table; ห้ามตีความว่า coverage เท่ากัน การดีขึ้น one-step มี CI คร่อมศูนย์, clamp เกินเกณฑ์ และ risk groups ไม่พอ ไม่มี horizon ผ่าน จึงไม่ export qualifying package หรือรัน ONNX parity',
    direct: 'Direct multi-horizon เป็น development prototype ใช้ train/validation ซ้ำ ยังไม่มี independent evaluation approval ไม่ใช่ predictor ของ Application และไม่ได้เปลี่ยนผล Gate2 เดิม',
    history: 'ดูผล one-step ของ package เดิม 2026.10.27.1 (คนละข้อมูลและ protocol)',
  },
  en: {
    title: 'What the local Application uses now',
    intro: 'The chart, spending plan, savings and transfer review share one explainable spending basis. FlowSense ML remains disabled.',
    methods: [
      ['HISTORY_MEAN', 'Average non-bill spending across the last 28 closed dates with at least seven complete known days, disclosing N/28. Known zero counts; missing/partial dates are not replaced with zero.'],
      ['SCENARIO', 'When history is insufficient, use an explicit versioned daily non-bill assumption valid for the relevant dates. All three default personas start here.'],
      ['ABSTAIN', 'Without adequate history or an applicable scenario, return null with reasons. The chart has gaps and no forecast-dependent savings capacity is offered.'],
    ],
    headers: ['Persona / synthetic account', 'Method / known dates', 'Assumed non-bill THB/day'],
    source: 'Declared demo assumptions, not measured transaction averages; bills excluded.',
    origin: 'Anchor at the current balance and as-of, with today plus 30 future dates; assumed spending starts tomorrow. Posted expenses today already belong to the balance. Future bills and salary are projections on copies, not actual postings.',
    consistency: 'Consumers share spending basis and obligations through the day before next payday, including next-month bills. Reading a chart settles no bill; state changes require a fresh transfer review.',
    screenshots: 'View local evidence images and data provenance',
    captions: [
      'SCENARIO · May, THB 350/day · local demo, synthetic data · 29 Oct 2026',
      'HISTORY_MEAN N7/28 · THB 85.71/day · hand-authored acceptance fixture, not actual May history or date-shifted research data',
      'ABSTAIN · acceptance fixture: forecast-dependent savings capacity is unavailable while existing savings can be withdrawn. This does not certify zero spending.',
    ],
    verification: 'Application handoff reports 148 backend checks, 26 frontend checks, build, real HTTP and bounded browser smoke. These images and results come from the Application round, not a fresh Application test run in Showcase.',
    boundary: 'Local demo only. The public app link is unverified as the same build. This is not a validated AI forecast; 30-day accuracy, real-user outcomes and physical iPad behavior are unverified.',
    provenance: 'View source versions and SHA-256 hashes',
    researchTitle: 'Gate2 ML result: no horizon passed integration criteria',
    researchIntro: 'fs-gate2-20261028-01 · synthetic v2.1.1 · 32 accounts / 16 designed cohorts. These are test seen/natural paired comparisons on the same rows. Cumulative MAE is THB/account-origin.',
    researchHeaders: ['Horizon days', 'Candidate MAE', 'Account mean MAE', 'Paired origins'],
    researchLimit: 'Each horizon also has six candidate-only scored origins outside this paired table; coverage is not equal. The one-step gain CI crosses zero, clamp exceeds the threshold and risk groups are insufficient. No horizon passed, so no qualifying package was exported or ONNX parity run.',
    direct: 'Direct multi-horizon is a development prototype using reused train/validation data, without independent evaluation approval. It is not the Application predictor and does not change the original Gate2 decision.',
    history: 'View historical package 2026.10.27.1 one-step results (different data and protocol)',
  },
};

export function ApplicationBaseline() {
  const { language } = useLanguage();
  const c = copy[language];
  return <StudySection id="application-baseline" title={c.title} kicker="LOCAL DEMO · SYNTHETIC · 2026-10-29">
    <p className="study-lead">{c.intro}</p>
    <StudyCards items={c.methods}/>
    <StudyTable label={c.title} headers={c.headers} rows={evidence.personas.map(p => [
      `${language === 'th' ? p.name_th : p.name_en} / ${p.account}`,
      `${p.method} · N${p.known_days}/${p.window_days}`,
      (p.daily_non_bill_satang / 100).toFixed(2),
    ])}/>
    <p className="study-caption">{c.source}</p><p>{c.origin}</p><p>{c.consistency}</p>
    <StudyNote warm>{c.boundary}</StudyNote>
    <details className="baseline-evidence"><summary>{c.screenshots}</summary>
      <p>{c.verification}</p>
      <p className="study-caption">{evidence.policy} · {evidence.adapter}<br/>{evidence.scenario_version}</p>
      {evidence.images.map((item, i) => <figure key={item.bundled_name}>
        <figcaption>{c.captions[i]}</figcaption>
        <a href={assetRoot + item.bundled_name} target="_blank" rel="noreferrer"><img src={assetRoot + item.bundled_name} alt={c.captions[i]} loading="lazy"/></a>
      </figure>)}
      <a href={assetRoot + 'provenance.json'} target="_blank" rel="noreferrer">{c.provenance} ↗</a>
    </details>
  </StudySection>;
}

export function FlowSenseStudyResults() {
  const { language } = useLanguage();
  const c = copy[language];
  return <StudySection title={c.researchTitle} kicker="STUDY_COMPLETE_CANDIDATE_NOT_PASSED">
    <p>{c.researchIntro}</p>
    <StudyTable label={c.researchTitle} headers={c.researchHeaders} rows={[1, 7, 14, 30].map(h => {
      const row = evidence.research.paired_cumulative_mae[h];
      return [h, row.candidate_cumulative_mae_thb.toFixed(2), row.comparator_cumulative_mae_thb.toFixed(2), row.paired_origins];
    })}/>
    <StudyNote warm>{c.researchLimit}</StudyNote><p>{c.direct}</p>
  </StudySection>;
}

export function HistoricalFlowSenseResults({ children }) {
  const { language } = useLanguage();
  return <details className="baseline-evidence"><summary>{copy[language].history}</summary>{children}</details>;
}
