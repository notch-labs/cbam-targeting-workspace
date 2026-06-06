import { useMemo, useState } from 'react';
import { TARGET_TYPES, OUTCOMES } from '../config/dashboardConfig';
import {
  filterOrganisations,
  getMarketCoverage,
  getOutcomeMetrics,
} from '../utils/dashboardMetrics';

const PIPELINE_STAGES = [
  'Research',
  'Contact Identified',
  'Assessment Invited',
  'Assessment Completed',
  'Meeting Booked',
  'Opportunity',
  'Customer',
];

export default function DashboardPage({ organisations = [] }) {
  const [filters, setFilters] = useState({
    sector: 'All',
    targetType: 'All',
    desiredOutcome: 'All',
  });

  const sectors = useMemo(
    () => ['All', ...new Set(organisations.map((org) => org.sector).filter(Boolean))],
    [organisations]
  );

  const filteredOrganisations = useMemo(
    () => filterOrganisations(organisations, filters),
    [organisations, filters]
  );

  const total = filteredOrganisations.length;

  const tierA = filteredOrganisations.filter((org) => org.priority === 'Tier A').length;

  const activePipeline = filteredOrganisations.filter((org) => {
    const stage = org.pipelineStage || org.stage || 'Research';
    return stage !== 'Research';
  }).length;

  const needsVerification = filteredOrganisations.filter(
    (org) =>
      !org.verificationStatus ||
      org.verificationStatus === 'Unverified' ||
      org.verificationStatus === 'Needs Review'
  ).length;

  const priorityTargets = filteredOrganisations
    .filter((org) => org.priority === 'Tier A')
    .slice(0, 8);

  const sectorCoverage = getMarketCoverage(filteredOrganisations, 'sector');
  const targetTypeCoverage = getMarketCoverage(filteredOrganisations, 'targetType');
  const outcomes = getOutcomeMetrics(filteredOrganisations);

  const pipelineHealth = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: filteredOrganisations.filter((org) => {
      const orgStage = org.pipelineStage || org.stage || 'Research';
      return orgStage === stage;
    }).length,
  }));

  const missingWebsite = filteredOrganisations.filter((org) => !org.website).length;
  const missingPriority = filteredOrganisations.filter((org) => !org.priority).length;
  const missingOwner = filteredOrganisations.filter((org) => !org.owner).length;
  const missingNextAction = filteredOrganisations.filter((org) => !org.nextAction).length;

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div style={page}>
      <div style={hero}>
        <div>
          <p style={eyebrow}>CBAM commercial targeting</p>
          <h1 style={title}>Commercial control dashboard</h1>
          <p style={intro}>
            Monitor the live CBAM target database, prioritise outreach, track pipeline movement
            and identify where commercial attention is needed next.
          </p>
        </div>
        <div style={heroBadge}>
          <strong>{organisations.length}</strong>
          <span>total records</span>
        </div>
      </div>

      <div style={filterGrid}>
        <Select label="Sector" value={filters.sector} options={sectors} onChange={(v) => updateFilter('sector', v)} />
        <Select label="Target type" value={filters.targetType} options={['All', ...TARGET_TYPES]} onChange={(v) => updateFilter('targetType', v)} />
        <Select label="Desired outcome" value={filters.desiredOutcome} options={['All', ...OUTCOMES]} onChange={(v) => updateFilter('desiredOutcome', v)} />
      </div>

      <section style={kpiGrid}>
        <MetricCard label="Filtered organisations" value={total} note="Current view" />
        <MetricCard label="Tier A targets" value={tierA} note="Highest priority" />
        <MetricCard label="Active pipeline" value={activePipeline} note="Beyond research" />
        <MetricCard label="Needs verification" value={needsVerification} note="Data quality focus" />
      </section>

      <Section title="Priority targets requiring action" subtitle="Tier A organisations in the current view.">
  <div style={priorityTable}>
    {priorityTargets.length === 0 ? (
      <EmptyState text="No Tier A targets in this filtered view." />
    ) : (
      priorityTargets.map((org) => (
        <div key={org.id || org.name} style={priorityRow}>
          <div>
            <strong>{org.name}</strong>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
              {org.sector || 'Sector unknown'} · {org.role || 'Role unknown'}
            </p>
          </div>

          <span style={pill}>{org.priority || 'No priority'}</span>
          <span style={pillMuted}>{org.pipelineStage || org.stage || 'Research'}</span>
          <span style={nextAction}>{org.nextAction || 'No action set'}</span>
        </div>
      ))
    )}
  </div>
</Section>

<Section title="Pipeline health" subtitle="Commercial workflow movement across the current view.">
  <div style={pipelineFlow}>
  {pipelineHealth.map((item) => (
    <div key={item.stage} style={pipelineFlowCard}>
      <div
        style={{
          ...pipelineValue,
          color: item.count > 0 ? '#2563eb' : '#334155',
        }}
      >
        {item.count}
      </div>
      <div style={pipelineLabel}>{item.stage}</div>
    </div>
  ))}
</div>
</Section>

      <Section title="Target market coverage" subtitle="Where the current database is strongest.">
        <div style={cardGrid2}>
          <CoverageCard title="By sector" data={sectorCoverage} />
          <CoverageCard title="By target type" data={targetTypeCoverage} />
        </div>
      </Section>

      <section style={twoColumnGrid}>
        <Section title="Data quality & workflow readiness" subtitle="Fields that affect operational usefulness.">
          <div style={dataQualityGrid}>
            <MetricCard label="Missing website" value={missingWebsite} />
            <MetricCard label="Missing priority" value={missingPriority} />
            <MetricCard label="Missing owner" value={missingOwner} />
            <MetricCard label="Missing next action" value={missingNextAction} />
          </div>
        </Section>

        <Section title="Outcome summary" subtitle="Commercial relationship direction across the filtered view.">
          <div style={outcomeGrid}>
            {outcomes.map((item) => (
              <MetricCard key={item.outcome} label={item.outcome} value={item.count} />
            ))}
          </div>
        </Section>
      </section>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={selectLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <div style={metricCard}>
      <p>{label}</p>
      <strong>{value}</strong>
      {note && <span>{note}</span>}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={sectionCard}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={sectionTitle}>{title}</h2>
        {subtitle && <p style={sectionSubtitle}>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function CoverageCard({ title, data }) {
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div>
      <h3 style={coverageTitle}>{title}</h3>
      {data.slice(0, 8).map((item) => (
        <div key={item.label} style={{ marginBottom: 14 }}>
          <div style={coverageRow}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </div>
          <div style={barTrack}>
            <div
              style={{
                width: `${(item.count / max) * 100}%`,
                height: '100%',
                background: '#0f766e',
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }) {
  return <p style={{ color: '#64748b', margin: 0 }}>{text}</p>;
}

const page = {
  padding: 32,
  background: '#f8fafc',
  minHeight: '100vh',
};

const hero = {
  background: 'linear-gradient(135deg, #0f172a 0%, #164e63 100%)',
  borderRadius: 26,
  padding: 30,
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 24,
  alignItems: 'center',
  marginBottom: 24,
};

const eyebrow = {
  margin: 0,
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  color: '#99f6e4',
};

const title = {
  fontSize: 34,
  margin: '6px 0',
};

const intro = {
  margin: 0,
  color: '#dbeafe',
  maxWidth: 760,
  lineHeight: 1.6,
};

const heroBadge = {
  minWidth: 150,
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: 20,
  padding: 18,
  textAlign: 'center',
};

const filterGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 16,
  marginBottom: 24,
};

const selectLabel = {
  fontSize: 12,
  color: '#64748b',
  fontWeight: 700,
};

const selectStyle = {
  border: '1px solid #cbd5e1',
  borderRadius: 12,
  padding: '10px 12px',
  background: '#ffffff',
};

const kpiGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 16,
  marginBottom: 24,
};

const twoColumnGrid = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: 24,
  marginBottom: 24,
};

const cardGrid2 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 24,
};

const sectionCard = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 22,
  padding: 24,
};

const sectionTitle = {
  margin: 0,
  color: '#0f172a',
  fontSize: 20,
};

const sectionSubtitle = {
  margin: '6px 0 0',
  color: '#64748b',
  fontSize: 14,
};

const metricCard = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 18,
  padding: 20,
};

const tableWrap = {
  display: 'grid',
  gap: 10,
};

const targetRow = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'center',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 14,
  background: '#f8fafc',
};

const rowMeta = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
};

const pill = {
  borderRadius: 999,
  padding: '5px 9px',
  background: '#ecfdf5',
  color: '#0f766e',
  fontSize: 12,
  fontWeight: 800,
};

const pillMuted = {
  borderRadius: 999,
  padding: '5px 9px',
  background: '#f1f5f9',
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
};

const pipelineGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const pipelineCard = {
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  background: '#f8fafc',
  padding: 16,
};

const dataQualityGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const outcomeGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const coverageTitle = {
  marginTop: 0,
  color: '#0f172a',
};

const coverageRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  color: '#334155',
};

const barTrack = {
  height: 8,
  background: '#e2e8f0',
  borderRadius: 999,
  marginTop: 6,
};
const priorityTable = {
  display: 'grid',
  gap: 10,
};
const pipelineFlow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: 16,
};

const pipelineFlowCard = {
  border: '1px solid #dbe4ee',
  borderRadius: 18,
  background: '#ffffff',
  padding: '26px 12px',
  minHeight: 126,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const pipelineValue = {
  fontSize: 34,
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: '-0.03em',
};

const pipelineLabel = {
  marginTop: 18,
  color: '#1e293b',
  fontSize: 14,
  fontWeight: 800,
  lineHeight: 1.25,
  textAlign: 'center',
};