import React from 'react';
import { ArrowRight, Wallet, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResearch, StudySection, StudyFlow, StudySources, codeSource, appSource } from '../components/ResearchUI';

export default function HomePage() {
  const { home: c, common } = useResearch();
  return <div className="page-stack research-page">
    <section className="research-hero">
      <div><span className="section-kicker">{c.kicker}</span><h1>{c.title}<br/><em>{c.accent}</em></h1><p>{c.intro}</p><div className="button-row"><a className="primary-button" href="#project-problem">{c.start}<ArrowRight size={17}/></a><Link className="text-link" to="/architecture">{c.technical}<ArrowRight size={16}/></Link></div></div>
      <aside className="research-thesis"><span className="research-label">THE DESIGN QUESTION</span><div><Wallet size={23}/><strong>FlowSense</strong><span>Financial context</span></div><span className="thesis-connector">+</span><div><Network size={23}/><strong>TrustGraph</strong><span>Transaction context</span></div><p>{c.premise}</p></aside>
    </section>
    <StudySection id="project-problem" kicker={common.problem} title={c.problemTitle}><div className="problem-grid">{c.problems.map(item => <article className="problem-card" key={item.n}><span className="problem-number">{item.n}</span><small>{item.tag}</small><h3>{item.title}</h3><p>{item.text}</p><strong>{item.consequence}</strong></article>)}</div><p className="study-caption">{c.evidenceNote}</p></StudySection>
    <StudySection title={c.thesisTitle}><p className="study-lead">{c.thesis}</p><StudyFlow items={c.chain}/></StudySection>
    <StudySection kicker="READ THE PROJECT" title={c.exploreTitle}><div className="study-index">{c.outline.map(([to, n, title, text]) => <Link key={to} to={to}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={19}/></Link>)}</div></StudySection>
    <StudySection title={c.statusTitle}><div className="evidence-columns">{c.status.map(([title, text], index) => <article key={title}><span className={'evidence-label ' + (index ? 'pending' : '')}>{index ? common.pending : common.implemented}</span><p>{text}</p></article>)}</div></StudySection>
    <StudySources items={[codeSource('src/train_flowsense_cashflow.py'), codeSource('src/train_trustgraph_two_tier.py'), appSource('docs/transfer-planning.md'), appSource('docs/liquidity-reserve.md')]}/>
  </div>;
}
