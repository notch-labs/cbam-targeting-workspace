import { useEffect, useState } from 'react';

import OrganisationsPage from './pages/OrganisationsPage';
import PipelinePage from './pages/PipelinePage';
import DashboardPage from './pages/DashboardPage';

const navItems = ['Dashboard', 'Organisations','Pipeline','Target Lists', 'Intelligence'];

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [organisations, setOrganisations] = useState([]);
const [loadingOrganisations, setLoadingOrganisations] = useState(true);
const [organisationsError, setOrganisationsError] = useState(null);

useEffect(() => {
  async function loadOrganisations() {
    try {
      const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const response = await fetch(`${API_BASE_URL}/api/organisations`);

      if (!response.ok) {
        throw new Error('Failed to load organisations');
      }

      const data = await response.json();

const mappedData = data.map((org) => ({
  ...org,

  id: org.id,
  name: org.organisation_name,
  website: org.verified_website_url || org.website,
  linkedin: org.verified_linkedin_url || org.linkedin_url,

  sector: org.cbam_sector,
  subsector: org.verified_subsector || org.subsector,
  role: org.organisation_type,

  targetType: org.target_type || org.ecosystem_role,
  desiredOutcome: org.desired_outcome,

  priority:
    org.priority_tier === 'Tier A'
      ? 'High'
      : org.priority_tier === 'Tier B'
        ? 'Medium'
        : 'Low',

  stage: org.pipeline_stage,
  pipelineStage: org.pipeline_stage,

  assessmentStatus: org.assessment_status,
  readinessBand: org.readiness_band,

  owner: org.owner,
  verificationStatus: org.verification_status,

  nextAction: org.next_action,

  notes: org.notes,

  contacts: [],
}));

setOrganisations(mappedData);
    } catch (error) {
      setOrganisationsError(error.message);
    } finally {
      setLoadingOrganisations(false);
    }
  }

  loadOrganisations();
}, []);
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <header
        style={{
          height: 64,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
        }}
      >
        <div>
          <strong>Notch CBAM</strong>
          <span style={{ marginLeft: 10, color: '#64748b' }}>Commercial Targeting</span>
        </div>

        <div style={{ fontSize: 13, color: '#64748b' }}>Development workspace</div>
      </header>

      <div style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
        <aside
          style={{
            width: 240,
            minHeight: 'calc(100vh - 64px)',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            padding: 20,
          }}
        >
          {navItems.map((item) => (
  <div
    key={item}
    onClick={() => setActivePage(item)}
    style={{
      padding: '10px 12px',
      borderRadius: 10,
      marginBottom: 6,
      background: item === activePage ? '#e0f2fe' : 'transparent',
      color: item === activePage ? '#075985' : '#334155',
      fontWeight: item === activePage ? 700 : 500,
      cursor: 'pointer',
      }}
  >
    {item}
  </div>
))}
        </aside>

        <main style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
  {loadingOrganisations && (
    <div style={{ padding: 28 }}>Loading organisations...</div>
  )}

  {organisationsError && (
    <div style={{ padding: 28, color: '#b91c1c' }}>
      {organisationsError}
    </div>
  )}

  {!loadingOrganisations && !organisationsError && (
    <>
      {activePage === 'Dashboard' && (
        <DashboardPage organisations={organisations} />
      )}

      {activePage === 'Organisations' && (
        <OrganisationsPage
          organisations={organisations}
          setOrganisations={setOrganisations}
        />
      )}

      {activePage === 'Pipeline' && (
        <PipelinePage organisations={organisations} />
      )}

      {activePage === 'Target Lists' && (
        <div style={{ padding: 28 }}>Target Lists page coming soon</div>
      )}

      {activePage === 'Intelligence' && (
        <div style={{ padding: 28 }}>Intelligence page coming soon</div>
      )}
    </>
  )}
</main>
      </div>
    </div>
  );
}