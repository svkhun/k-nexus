import React from 'react';
import ExperimentResults from '../components/ExperimentResults';
import { ApplicationBaseline, FlowSenseStudyResults, HistoricalFlowSenseResults } from '../components/ApplicationBaseline';
import { StudyIntro, StudySection, StudyNote, StudyFlow, StudyCards, StudyTable, StudySources, StudyNext, useResearch, codeSource, appSource } from '../components/ResearchUI';

export default function FlowSensePage() {
  const { flow: c, common } = useResearch();
  return <div className="page-stack research-page">
    <StudyIntro kicker={c.kicker} title={c.title}>{c.intro}</StudyIntro>
    <ApplicationBaseline/>
    <StudyNote title={common.method}>{c.legacyNote}</StudyNote>
    <StudyNote title={common.problem}>{c.problem}</StudyNote>
    <StudyFlow items={c.pipeline}/>
    <StudySection title={c.dataTitle}><p>{c.dataIntro}</p><StudyTable headers={c.featureHeaders} rows={c.features} label={c.dataTitle}/><p className="study-caption">{c.lagNote}</p></StudySection>
    <StudySection title={c.modelTitle}><div className="method-discussion"><p>{c.modelText}</p><aside><span className="research-label">MODEL SELECTION</span><p>{c.modelLimit}</p></aside></div></StudySection>
    <StudySection title={c.ruleTitle}><div className="formula-grid">{c.rules.map(([title, formula, detail]) => <article key={title}><h3>{title}</h3><div className="study-formula">{formula}</div><p>{detail}</p></article>)}</div></StudySection>
    <StudySection title={c.workedTitle}><div className="worked-example"><span className="research-label">FIXED SYNTHETIC EXAMPLE</span><p>{c.workedIntro}</p><div className="allocation-figure" role="img" aria-label={c.workedIntro}><span style={{ flex: 5650 }}>5,650</span><span style={{ flex: 5000 }}>5,000</span><span style={{ flex: 13850 }}>13,850</span></div><div className="allocation-labels">{c.allocationLabels.map(label => <span key={label}>{label}</span>)}</div></div><p className="study-caption">{c.todayNote}</p></StudySection>
    <StudySection title={c.responseTitle}><StudyCards items={c.responses}/></StudySection>
    <StudySection title={c.evaluationTitle}><ul className="study-checks">{c.evaluation.map(text => <li key={text}>{text}</li>)}</ul></StudySection>
    <FlowSenseStudyResults/>
    <HistoricalFlowSenseResults><ExperimentResults model="flowsense"/></HistoricalFlowSenseResults>
    <StudySources items={[codeSource('src/train_flowsense_cashflow.py'), codeSource('src/export_to_onnx.py'), appSource('src/flowsense_engine.py'), appSource('docs/savings-sync-2026-10-16.md'), ['LightGBM · Official features', 'https://lightgbm.readthedocs.io/en/latest/Features.html']]}/>
    <StudyNext to="/trustgraph">TrustGraph · {common.method}</StudyNext>
  </div>;
}
