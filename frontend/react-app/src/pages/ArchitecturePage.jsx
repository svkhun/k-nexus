import React from 'react';
import { StudyIntro, StudySection, StudyNote, StudyFlow, StudyCards, StudyTable, StudySources, StudyNext, useResearch, codeSource, appSource } from '../components/ResearchUI';

export default function ArchitecturePage() {
  const { architecture: c, evolution } = useResearch();
  return <div className="page-stack research-page">
    <StudyIntro kicker={c.kicker} title={c.title}>{c.intro}</StudyIntro>
    <StudySection kicker="OFFLINE" title={c.offlineTitle}><StudyFlow items={c.offline}/></StudySection>
    <StudySection kicker="ONLINE" title={c.onlineTitle}><StudyFlow items={c.online}/></StudySection>
    <StudySection title={c.roleTitle}><StudyTable headers={c.headers} rows={c.roles} label={c.roleTitle}/></StudySection>
    <StudySection title={c.clusterTitle}><p>{c.cluster}</p><StudyNote warm>{c.clusterLimit}</StudyNote></StudySection>
    <StudySection title={c.policyTitle}><StudyCards items={c.policies}/></StudySection>
    <StudySection title={c.scopeTitle}><StudyCards items={c.scope}/></StudySection>
    <StudyNote>{c.boundary}</StudyNote>
    <StudySources items={[codeSource('src/train_clustering.py'), codeSource('src/export_to_onnx.py'), appSource('src/ui/api.js'), ['ONNX Runtime · Documentation', 'https://onnxruntime.ai/docs/'], ['StandardScaler · scikit-learn', 'https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html']]}/>
    <StudyNext to="/evolution">{evolution.title}</StudyNext>
  </div>;
}
