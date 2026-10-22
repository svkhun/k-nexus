import React from 'react';
import { AppLink } from '../components/ProjectUI';
import { StudyIntro, StudySection, StudyNote, StudyCards, StudySources, StudyNext, useResearch, appSource } from '../components/ResearchUI';

export default function SimulatorPage() {
  const { evolution: c, common } = useResearch();
  return <div className="page-stack research-page">
    <StudyIntro kicker={c.kicker} title={c.title}>{c.intro}</StudyIntro>
    <p className="study-caption">{c.provenance}</p>
    <ol className="evolution-studies">{c.changes.map(([title, before, after, implication, file], index) => <li key={title}><span className="evolution-number">0{index + 1}</span><div><h2>{title}</h2><dl>{[before, after, implication].map((text, i) => <div key={text}><dt>{c.labels[i]}</dt><dd>{text}</dd></div>)}</dl><a href={appSource('docs/' + file)[1]} target="_blank" rel="noreferrer" className="evolution-source">{file} ↗</a></div></li>)}</ol>
    <StudySection title={c.lessonTitle}><p className="study-lead">{c.lesson}</p></StudySection>
    <StudySection title={c.nextTitle}><StudyCards items={c.next}/></StudySection>
    <StudyNote title={c.appTitle}>{c.appText}</StudyNote>
    <div className="button-row"><AppLink>{common.app}</AppLink></div>
    <StudySources items={[appSource('docs/PRODUCT_REVIEW_2026-10-15.md'), appSource('docs/liquidity-reserve.md'), appSource('docs/transfer-planning.md')]}/>
    <StudyNext to="/dataset">{common.limit}</StudyNext>
  </div>;
}
