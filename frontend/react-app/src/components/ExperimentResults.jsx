import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { StudySection, StudyTable, StudyNote } from './ResearchUI';
import results from '../data/modelEvaluation.json';

const shortDate = value => value.slice(0, 10);
const range = p => `${shortDate(p.start)} → ${shortDate(p.end)}`;
const number = value => value.toFixed(2);

export default function ExperimentResults({ model }) {
  const { language } = useLanguage();
  const th = language === 'th';
  if (model === 'flowsense') {
    const c = results.flowsense;
    return <StudySection title={th ? 'ผลทดลองที่รันจริง · synthetic data' : 'Measured experiment · synthetic data'} kicker={results.packageVersion}>
      <StudyTable label="FlowSense rolling backtest MAE" headers={th ? ['ช่วงทดสอบ', 'ตัวอย่าง', 'Model MAE ฿/วัน', 'Historical mean', 'Seasonal naive 7d'] : ['Test dates', 'Samples', 'Model MAE THB/day', 'Historical mean', 'Seasonal naive 7d']} rows={c.existing_user_backtests.map(f => [range(f.test), f.test.samples, number(f.mae_model), number(f.mae_historical_mean), number(f.mae_seasonal_naive_7d)])}/>
      <p className="study-caption">{th ? 'ผู้ใช้เดิม 120 คน · expanding training window · ใช้ยอดจริงของวันก่อนหน้าที่เกิดขึ้นแล้วในการทดสอบแบบ one-step-ahead' : '120 existing users · expanding training window · one-step-ahead tests can use actual spending from prior days that have already elapsed.'}</p>
      <StudyTable label="FlowSense new user cold start" headers={th ? ['ผู้ใช้ใหม่ ไม่มี history', 'ตัวอย่าง / คน', 'Model MAE ฿/วัน', 'Global training mean'] : ['New users without history', 'Samples / users', 'Model MAE THB/day', 'Global training mean']} rows={[[range(c.new_user_cold_start.test), `${c.new_user_cold_start.test.samples} / ${c.new_user_cold_start.test.users}`, number(c.new_user_cold_start.mae_model), number(c.new_user_cold_start.mae_global_training_mean)]]}/>
      <StudyNote>{th ? 'ผลประวัติของ package 2026.10.27.1 ใช้คนละข้อมูลและ protocol กับ Gate2 v2.1.1 ไม่ใช่ผล baseline ของ Application หรือความแม่นยำกราฟ 30 วัน ปัจจุบัน local Application ใช้ HISTORY_MEAN → SCENARIO → ABSTAIN และยังปิด FlowSense ML; ยังไม่ยืนยัน deployed version' : 'Historical package 2026.10.27.1 uses different data and protocol from Gate2 v2.1.1. These are not Application baseline results or 30-day chart accuracy. The local Application uses HISTORY_MEAN → SCENARIO → ABSTAIN with FlowSense ML disabled; deployed version is unverified.'}</StudyNote>
    </StudySection>;
  }
  const c = results.trustgraph;
  const rows = [['LightGBM · no GNN', c.results.no_gnn_baseline.test], ['R-GCN + LightGBM', c.results.rgcn_lightgbm.test]];
  return <StudySection title={th ? 'ผลทดสอบตามเวลา · raw model score' : 'Temporal test · raw model scores'} kicker={results.packageVersion}>
    <p className="study-caption">{th ? 'Application รับ package 2026.10.27.1 และใช้ TrustGraph ONNX กับ embedding คู่กันใน local process ที่ตรวจแล้ว การตรวจรับ package และ integration ไม่ใช่หลักฐาน deployed version; เหตุผลจาก metadata/policy ไม่ใช่ model attribution' : 'Application imported package 2026.10.27.1 and uses its paired TrustGraph ONNX and embeddings in the checked local process. Package acceptance and integration do not verify deployment; metadata/policy context is not model attribution.'}</p>
    <p>{range(c.periods.test)} · {c.periods.test.samples} transactions · {c.periods.test.positive_labels} positive labels · threshold 0.5</p>
    <StudyTable label="TrustGraph synthetic test metrics" headers={['Model', 'PR-AUC (AP)', 'ROC-AUC', 'Precision', 'Recall']} rows={rows.map(([name, m]) => [name, ...['pr_auc_average_precision', 'roc_auc', 'precision', 'recall'].map(k => m[k].toFixed(5))])}/>
    <StudyNote warm>{th ? 'รอบนี้ GNN ไม่ได้ดีกว่า baseline ที่ไม่ใช้กราฟ คะแนนทั้งหมดมาจากข้อมูลสังเคราะห์ที่มีรูปแบบแยกกันง่าย ไม่รวม blacklist, is_mule boost หรือ policy overrides จึงไม่ใช่อัตราสกัด scam หรือผลลดความเสียหาย' : 'This run does not show a gain from GNN over the graph-free baseline. Scores reflect strongly separable synthetic patterns and exclude blacklists, is_mule boosts and policy overrides. They are not scam-interception or loss-reduction rates.'}</StudyNote>
    <p className="study-caption">{th ? 'Graph context ก่อน 13 ส.ค. · labels ฝึกสมมติพร้อมหลัง 24 ชม. · metadata ไร้เวลาไม่ถูกใช้ · บัญชีไม่พบใช้ embedding ศูนย์โดยไม่ตีความว่าปลอดภัย' : 'Graph context before 13 Aug · supervised labels assumed available after 24h · timeless metadata excluded · unseen accounts use zero embeddings, which do not imply safety.'}</p>
  </StudySection>;
}
