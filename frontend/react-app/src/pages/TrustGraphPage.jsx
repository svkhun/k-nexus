import React from 'react';
import { StudyIntro, StudySection, StudyNote, StudyFlow, StudyCards, StudyTable, StudySources, StudyNext, ConceptGraph, useResearch, codeSource, appSource } from '../components/ResearchUI';
import { DEMO_PLAN, transferPlan } from '../data/demoPlan.mjs';
import { money } from '../components/ProjectUI';

export default function TrustGraphPage() {
  const { trust: c, common } = useResearch();
  const expense = transferPlan({ amount: 1200 });
  const bill = transferPlan({ amount: 1200, kind: 'bill' });
  const numericRows = [[DEMO_PLAN.balance, DEMO_PLAN.bills, expense.beforeDaily], [expense.after, expense.remainingBills, expense.afterDaily], [bill.after, bill.remainingBills, bill.afterDaily]];
  return <div className="page-stack research-page">
    <StudyIntro kicker={c.kicker} title={c.title}>{c.intro}</StudyIntro>
    <StudyNote title={common.problem}>{c.problem}</StudyNote>
    <p className="study-followup">{c.threat}</p>
    <StudySection title={c.graphTitle}><div className="graph-discussion"><p>{c.graphText}</p><ConceptGraph caption={c.graphCaption}/></div></StudySection>
    <StudySection title={c.pipelineTitle}><StudyFlow items={c.pipeline}/></StudySection>
    <StudySection title={c.inputTitle}><StudyCards items={c.inputs}/></StudySection>
    <StudySection title={c.rationaleTitle}><p>{c.rationale}</p></StudySection>
    <StudyNote title={c.leakageTitle} warm>{c.leakage}</StudyNote><p className="study-followup">{c.repair}</p>
    <StudySection title={c.responseTitle}><StudyCards items={c.responses}/></StudySection>
    <p className="study-caption">{c.demoPolicy}</p>
    <StudySection title={c.jointTitle}><p className="study-lead">{c.joint}</p></StudySection>
    <StudySection title={c.comparisonTitle}><StudyTable headers={c.comparisonHeaders} rows={numericRows.map((row, i) => [c.comparisonRows[i], ...row.map(value => '฿' + money(value, 2))])} label={c.comparisonTitle}/><p className="study-caption">{c.comparisonNote}</p></StudySection>
    <StudyNote title={c.evaluationTitle}>{c.evaluation}</StudyNote>
    <StudySources items={[codeSource('src/train_trustgraph_two_tier.py'), appSource('src/transfer_planning.py'), appSource('docs/transfer-cooldown.md'), ['R-GCN · Schlichtkrull et al.', 'https://arxiv.org/abs/1703.06103']]}/>
    <StudyNext to="/architecture">Machine Learning & Data Science</StudyNext>
  </div>;
}
