import React from 'react';
import { StudyIntro, StudySection, StudyNote, StudyCards, StudyNext, useResearch } from '../components/ResearchUI';

export default function PersonasPage() {
  const { personas: c, flow } = useResearch();
  return <div className="page-stack research-page">
    <StudyIntro kicker={c.kicker} title={c.title}>{c.intro}</StudyIntro>
    <div className="scenario-studies">{c.scenarios.map((item, index) => <article key={item.name}><div className="scenario-heading"><span>0{index + 1}</span><div><small>{item.name} / {item.role}</small><h2>{item.question}</h2></div></div><dl>{[item.situation, item.need, item.solution, item.measure].map((text, i) => <div key={text}><dt>{c.labels[i]}</dt><dd>{text}</dd></div>)}</dl></article>)}</div>
    <StudyNote>{c.note}</StudyNote>
    <StudySection title={c.hypothesisTitle}><StudyCards items={c.hypotheses}/></StudySection>
    <StudyNext to="/flowsense">{flow.title}</StudyNext>
  </div>;
}
