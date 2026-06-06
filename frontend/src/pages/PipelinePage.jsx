import { useState } from 'react';

import { OUTCOMES, JOURNEY_STAGES_BY_OUTCOME } from '../config/dashboardConfig';



export default function PipelinePage({ organisations }) {
    const [selectedOutcome, setSelectedOutcome] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('All');
const [selectedPriority, setSelectedPriority] = useState('All');
const [selectedAssessment, setSelectedAssessment] = useState('All');

const sectors = ['All', ...new Set(organisations.map((org) => org.sector).filter(Boolean))];
const priorities = ['All', 'High', 'Medium', 'Low'];
const assessmentStatuses = [
  'All',
  'Not Invited',
  'Invited',
  'Started',
  'Completed',
];
    const [selectedOrganisation, setSelectedOrganisation] = useState(null);
const pipelineStages =
  JOURNEY_STAGES_BY_OUTCOME[selectedOutcome] ||
  JOURNEY_STAGES_BY_OUTCOME.Customer;

const filteredOrganisations = organisations.filter((org) => {
  const outcomeMatch =
    selectedOutcome === 'All' || org.desiredOutcome === selectedOutcome;

  const sectorMatch =
    selectedSector === 'All' || org.sector === selectedSector;

  const priorityMatch =
    selectedPriority === 'All' || org.priority === selectedPriority;
    const assessmentMatch =
  selectedAssessment === 'All' ||
  (org.assessmentStatus || 'Not Invited') === selectedAssessment;

  return (
  outcomeMatch &&
  sectorMatch &&
  priorityMatch &&
  assessmentMatch
);
});

    const searchedOrganisations = filteredOrganisations.filter((org) =>
  [
    org.name,
    org.sector,
    org.role,
    org.targetType,
    org.desiredOutcome,
  ]
    .filter(Boolean)
    .some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
);
  return (
    <div>
      <p style={{ color: '#64748b', fontSize: 13, fontWeight: 700 }}>
        Pipeline
      </p>

      <h1 style={{ margin: 0, fontSize: 30 }}>Commercial pipeline</h1>

      <p style={{ color: '#475569', maxWidth: 760 }}>
        Track CBAM targets from research through readiness assessment, engagement and customer conversion.
      </p>

      <div
  style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 24,
  }}
>
  {['All', ...OUTCOMES].map((outcome) => (
    <button
      key={outcome}
      onClick={() => setSelectedOutcome(outcome)}
      style={{
        padding: '9px 16px',
        borderRadius: 999,
        border:
          selectedOutcome === outcome
            ? '1px solid #0f766e'
            : '1px solid #cbd5e1',
        background:
          selectedOutcome === outcome ? '#ecfdf5' : '#ffffff',
        color:
          selectedOutcome === outcome ? '#0f766e' : '#334155',
        fontWeight: selectedOutcome === outcome ? 800 : 600,
        cursor: 'pointer',
      }}
    >
      {outcome}
    </button>
  ))}
</div>

        <div
  style={{
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  }}
>
  <div
    style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
  <input
    type="text"
    placeholder="Search organisations..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      width: 320,
      padding: '10px 14px',
      borderRadius: 12,
      border: '1px solid #cbd5e1',
      fontSize: 14,
      background: '#ffffff',
    }}
  />

  <select
  value={selectedSector}
  onChange={(e) => setSelectedSector(e.target.value)}
  style={{
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    background: '#ffffff',
  }}
>
  {sectors.map((sector) => (
    <option key={sector} value={sector}>
      {sector}
    </option>
  ))}
</select>

<select
  value={selectedPriority}
  onChange={(e) => setSelectedPriority(e.target.value)}
  style={{
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    background: '#ffffff',
  }}
>
  {priorities.map((priority) => (
    <option key={priority} value={priority}>
      {priority}
    </option>
  ))}
</select>

  <select
  value={selectedAssessment}
  onChange={(e) => setSelectedAssessment(e.target.value)}
  style={{
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    background: '#ffffff',
  }}
>
  {assessmentStatuses.map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>

  <span
    style={{
      color: '#64748b',
      fontSize: 13,
      fontWeight: 600,
    }}
  >
    {searchedOrganisations.length} organisations
  </span>
</div>
</div>



    

      <div
  style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${pipelineStages.length}, 260px)`,
    gap: 16,
    marginTop: 22,
    overflowX: 'auto',
    paddingBottom: 12,
    width: '100%',
  }}
>
        {selectedOrganisation && (
  <div style={modalOverlay}>
    <div style={modalCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <p style={modalEyebrow}>Selected organisation</p>
          <h2 style={{ margin: '6px 0 4px', fontSize: 28 }}>
            {selectedOrganisation.name}
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            {selectedOrganisation.sector} • {selectedOrganisation.role}
          </p>
        </div>

        <button onClick={() => setSelectedOrganisation(null)} style={closeButton}>
          Close
        </button>
      </div>

      <div style={summaryGrid}>
        <Detail label="Target type" value={selectedOrganisation.targetType} />
        <Detail label="Outcome" value={selectedOrganisation.desiredOutcome} />
        <Detail label="Priority" value={selectedOrganisation.priority} />
        <Detail label="Owner" value={selectedOrganisation.owner} />
        <Detail label="Assessment" value={selectedOrganisation.assessmentStatus || 'Not Invited'} />
        <Detail label="Readiness" value={selectedOrganisation.readinessBand || 'Not known'} />
        <Detail
            label="Stage"
            value={selectedOrganisation.pipelineStage || selectedOrganisation.stage || 'Research'}
            />
        <Detail label="Next action" value={selectedOrganisation.nextAction || 'No action set'} />
      </div>

      <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
        <button style={primaryButton}>
          Open organisation workspace
        </button>

        <button style={secondaryButton} onClick={() => setSelectedOrganisation(null)}>
          Return to pipeline
        </button>
      </div>
    </div>
  </div>
)}

        {pipelineStages.map((stage) => {
  const stageOrganisations = searchedOrganisations.filter((org) => {
    const orgStage = org.pipelineStage || org.stage || 'Research';
    return orgStage === stage;
  });

  return (
            <div
              key={stage}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 14,
                minHeight: 420,
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>{stage}</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                  {stageOrganisations.length} targets
                </p>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {stageOrganisations.map((org) => (
                  <div
  key={org.id}
  onClick={() => setSelectedOrganisation(org)}
  style={{
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderLeft: '4px solid #f59e0b',
    borderRadius: 14,
    padding: 12,
    cursor: 'pointer',
  }}
>
  <div style={{ fontWeight: 800, fontSize: 14 }}>
    {org.name}
  </div>

  <div style={{ marginTop: 4, color: '#64748b', fontSize: 12 }}>
    {org.targetType || 'Target'} → {org.desiredOutcome || 'Outcome'}
  </div>

  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    <span style={pillStyle}>{org.priority || 'Priority unknown'}</span>
    <span style={pillStyle}>{org.assessmentStatus || 'Not invited'}</span>
  </div>

  <div style={{ marginTop: 8, fontSize: 12, color: '#334155' }}>
    <strong>Next:</strong> {org.nextAction || 'No action set'}
  </div>
</div>
                ))}

                {stageOrganisations.length === 0 && (
                  <p style={{ color: '#94a3b8', fontSize: 13 }}>
                    No targets at this stage.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ marginTop: 5, fontWeight: 800, color: '#0f172a' }}>
        {value || '—'}
      </div>
    </div>
  );
}

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 7px',
  borderRadius: 999,
  background: '#f1f5f9',
  color: '#475569',
  fontSize: 11,
  fontWeight: 700,
};

const modalOverlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 24,
};

const modalCard = {
  width: 'min(860px, 100%)',
  background: '#ffffff',
  borderRadius: 22,
  border: '1px solid #e2e8f0',
  boxShadow: '0 24px 70px rgba(15, 23, 42, 0.22)',
  padding: 28,
};

const modalEyebrow = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  margin: 0,
};

const closeButton = {
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  borderRadius: 999,
  padding: '8px 14px',
  cursor: 'pointer',
  height: 38,
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 14,
  marginTop: 24,
};

const primaryButton = {
  border: '1px solid #0f766e',
  background: '#0f766e',
  color: '#ffffff',
  borderRadius: 999,
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: 800,
};

const secondaryButton = {
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#334155',
  borderRadius: 999,
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: 700,
};