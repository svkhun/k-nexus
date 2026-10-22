import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { researchContent } from '../data/researchContent';
import { researchDetails } from '../data/researchDetails';

export function useResearch() {
  const { language } = useLanguage();
  return { ...researchContent[language], ...researchDetails[language] };
}

export function StudyIntro({ kicker, title, children }) {
  return <header className="study-intro"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{children}</p></header>;
}
export function StudySection({ title, kicker, children, id }) {
  return <section className="study-section" id={id}><div className="study-section-heading">{kicker && <span className="section-kicker">{kicker}</span>}<h2>{title}</h2></div>{children}</section>;
}
export function StudyNote({ title, children, warm = false }) {
  return <aside className={'study-note ' + (warm ? 'study-note-warm' : '')}><Info size={19}/><div>{title && <strong>{title}</strong>}<p>{children}</p></div></aside>;
}
export function StudyFlow({ items }) {
  return <ol className="study-flow">{items.map(([title, detail], index) => <li key={title}><span className="study-step-number">0{index + 1}</span><h3>{title}</h3><p>{detail}</p></li>)}</ol>;
}
export function StudyCards({ items }) {
  return <div className="study-card-grid">{items.map(([title, text]) => <article className="study-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>;
}
export function StudyTable({ headers, rows, label }) {
  return <div className="table-scroll study-table" role="region" tabIndex={0} aria-label={label}><table className="evidence-table"><caption className="sr-only">{label}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function StudyNext({ to, children }) {
  const { common } = useResearch();
  return <Link to={to} className="study-next"><span><small>{common.next}</small><strong>{children}</strong></span><ArrowRight size={23}/></Link>;
}
export const codeSource = (file) => ['k-nexus / ' + file, 'https://github.com/svkhun/k-nexus/blob/main/' + file];
export const appSource = (file) => ['K-NEXUS-Web / ' + file, 'https://github.com/svkhun/K-NEXUS-Web/blob/main/' + file];
export function StudySources({ items }) {
  const { common } = useResearch();
  return <details className="study-sources"><summary><BookOpen size={17}/>{common.sources}</summary><ul>{items.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={14}/></a></li>)}</ul></details>;
}
export function ConceptGraph({ caption }) {
  const nodes = [[52, 98], [139, 39], [139, 159], [241, 99], [337, 39], [337, 159], [425, 98]];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2], [3, 4], [3, 5], [4, 6], [5, 6], [4, 5]];
  return <figure className="concept-graph"><svg viewBox="0 0 480 205" role="img" aria-label={caption}><defs><marker id="graph-arrow" markerWidth="6" markerHeight="6" refX="20" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="#91aaa5"/></marker></defs>{edges.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#91aaa5" strokeWidth="1.6" markerEnd="url(#graph-arrow)"/>)}{nodes.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={i === 3 ? 25 : 20} fill={i === 3 ? '#21535a' : '#e5eee9'} stroke="#adc5bd"/><text x={x} y={y + 4} textAnchor="middle" fill={i === 3 ? '#ffffff' : '#355c59'} fontSize="11" fontFamily="sans-serif">A{i + 1}</text></g>)}</svg><figcaption>{caption}</figcaption></figure>;
}
