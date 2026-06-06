import { useState } from 'react';
import { organisations as initialOrganisations } from '../data/organisations';

export default function OrganisationsPage({
  organisations,
  setOrganisations,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
const [showAddForm, setShowAddForm] = useState(false);
const [newOrganisation, setNewOrganisation] = useState({
  name: '',
  website: '',
  linkedin: '',
  sector: '',
  subsector: '',
  role: '',
  priority: 'Medium',
  stage: 'Not Reviewed',
  owner: '',
  verificationStatus: 'Not Started',
  notes: '',
});
const [showAddContactForm, setShowAddContactForm] = useState(false);

const [newContact, setNewContact] = useState({
  name: '',
  jobTitle: '',
  email: '',
  mobile: '',
  decisionRole: 'Unknown',
  influenceLevel: 'Unknown',
  notes: '',
});
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
const [activeTab, setActiveTab] = useState('overview');

  const filteredOrganisations = organisations.filter((org) => {
    const search = searchTerm.toLowerCase();

    return (
      org.name.toLowerCase().includes(search) ||
      org.sector.toLowerCase().includes(search) ||
      org.role.toLowerCase().includes(search) ||
      org.priority.toLowerCase().includes(search)
    );
  });

  if (selectedOrganisation) {
    return (
      <div>
        <button
          onClick={() => setSelectedOrganisation(null)}
          style={{
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          ← Back to organisations
        </button>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 18,
            padding: 28,
          }}
        >
          <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            TARGET CARD
          </p>

          <h1 style={{ marginTop: 0 }}>{selectedOrganisation.name}</h1>
          <div
  style={{
    color: '#475569',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 20,
  }}
>
  <PipelineProgress currentStage={selectedOrganisation.pipelineStage} />
  <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
    marginBottom: 28,
  }}
>
  <Info
    label="Target Type"
    value={selectedOrganisation.targetType}
  />

  <Info
    label="Desired Outcome"
    value={selectedOrganisation.desiredOutcome}
  />

  <Info
    label="Assessment"
    value={selectedOrganisation.assessmentStatus || 'Not Invited'}
  />

  <Info
    label="Contacts"
    value={selectedOrganisation.contacts?.length || 0}
  />

  <Info
    label="Next Action"
    value={
      selectedOrganisation.nextAction ||
      'Define next action'
    }
  />
</div>

</div>
          <div
  style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  }}
>
  <span>{selectedOrganisation.role}</span>
  <span>•</span>
  <span>{selectedOrganisation.sector}</span>
  <span>•</span>
  <span>{selectedOrganisation.priority} Priority</span>
  <span>•</span>
  <span>{selectedOrganisation.verificationStatus}</span>
</div>
          <div
  style={{
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  }}
>
  {['overview', 'contacts', 'relationships', 'intelligence', 'activity'].map(
    (tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid #cbd5e1',
          background:
            activeTab === tab ? '#0f172a' : '#ffffff',
          color:
            activeTab === tab ? '#ffffff' : '#334155',
          cursor: 'pointer',
          textTransform: 'capitalize',
        }}
      >
        {tab}
      </button>
    )
  )}
</div>

          {activeTab === 'overview' && (
  <div style={{ display: 'grid', gap: 24 }}>
    <div>
      <h2>Organisation Summary</h2>

      <p>
        <strong>Website:</strong>{' '}
        <a href={selectedOrganisation.website} target="_blank" rel="noreferrer">
          {selectedOrganisation.website}
        </a>
      </p>

      <p>
        <strong>LinkedIn:</strong>{' '}
        <a href={selectedOrganisation.linkedin} target="_blank" rel="noreferrer">
          View profile
        </a>
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
      <Info label="Sector" value={selectedOrganisation.sector} />
      <Info label="Subsector" value={selectedOrganisation.subsector} />
      <Info label="Role" value={selectedOrganisation.role} />
      <Info label="Target Type" value={selectedOrganisation.targetType} />
      <Info label="Desired Outcome" value={selectedOrganisation.desiredOutcome} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
      <Info label="Owner" value={selectedOrganisation.owner} />
      <Info label="Priority" value={selectedOrganisation.priority} />
      <Info label="Stage" value={selectedOrganisation.stage} />
    </div>

    <div>
      <h2>Verification</h2>
      <p>{selectedOrganisation.verificationStatus}</p>
    </div>

    <div>
      <h2>Notes</h2>
      <p>{selectedOrganisation.notes}</p>
    </div>
  </div>
)}

{activeTab === 'contacts' && (
  <div>
    <h2>Contacts</h2>

    {selectedOrganisation.contacts?.length ? (
      <div style={{ display: 'grid', gap: 12 }}>
        {selectedOrganisation.contacts.map((contact) => (
          <div
            key={contact.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16,
              background: '#ffffff',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              {contact.name}
            </div>

            <div style={{ color: '#64748b', marginTop: 4 }}>
              {contact.jobTitle}
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>Email:</strong> {contact.email || 'Not added'}
            </div>

            <div>
              <strong>Mobile:</strong> {contact.mobile || 'Not added'}
            </div>

            <div>
              <strong>Decision Role:</strong> {contact.decisionRole || 'Unknown'}
            </div>

            <div>
              <strong>Influence:</strong> {contact.influenceLevel || 'Unknown'}
            </div>

            <div>
              <strong>Last Contacted:</strong> {contact.lastContacted || 'Not recorded'}
            </div>

            {contact.notes && (
              <p style={{ marginTop: 12, color: '#475569' }}>
                {contact.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#64748b' }}>No contacts identified yet.</p>
    )}

    <button
  type="button"
  onClick={() => setShowAddContactForm(true)}
  style={{
    marginTop: 16,
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    cursor: 'pointer',
  }}
>
  + Add Contact
</button>
{showAddContactForm && (
  <div
    style={{
      marginTop: 16,
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: 16,
      background: '#f8fafc',
    }}
  >
    <h3>Add Contact</h3>

    <Input
      label="Name"
      field="name"
      value={newContact}
      setValue={setNewContact}
    />

    <Input
      label="Job Title"
      field="jobTitle"
      value={newContact}
      setValue={setNewContact}
    />

    <Input
      label="Email"
      field="email"
      value={newContact}
      setValue={setNewContact}
    />

    <Input
      label="Mobile"
      field="mobile"
      value={newContact}
      setValue={setNewContact}
    />

    <Input
      label="Decision Role"
      field="decisionRole"
      value={newContact}
      setValue={setNewContact}
    />

    <Input
      label="Influence Level"
      field="influenceLevel"
      value={newContact}
      setValue={setNewContact}
    />

    <button
  type="button"
  onClick={handleAddContact}
  style={{
    marginTop: 16,
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#0f172a',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700,
  }}
>
  Save Contact
</button>
  </div>
)}
  </div>
)}

{activeTab === 'relationships' && (
  <div>
    <h2>Relationships</h2>

    {selectedOrganisation.relationships?.length ? (
      <div style={{ display: 'grid', gap: 12 }}>
        {selectedOrganisation.relationships.map((relationship, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 600 }}>{relationship.type}</div>
            <div style={{ marginTop: 6 }}>{relationship.description}</div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#64748b' }}>No relationships recorded.</p>
    )}
  </div>
)}

{activeTab === 'intelligence' && (
  <div>
    <h2>Relevant Intelligence</h2>

    <div
      style={{
        border: '1px dashed #cbd5e1',
        borderRadius: 12,
        padding: 24,
        marginTop: 12,
      }}
    >
      <h3>No intelligence linked</h3>
      <p style={{ color: '#64748b' }}>
        Intelligence signals connected to this organisation will appear here.
      </p>
      <button>+ Link Intelligence Signal</button>
    </div>
  </div>
)}

{activeTab === 'activity' && (
  <div>
    <h2>Activity</h2>
    <p style={{ color: '#64748b' }}>
      Notes, outreach activity and engagement history will appear here.
    </p>
  </div>
)}
          </div>
        </div>
        );
  }

  <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginTop: 24,
    marginBottom: 24,
  }}
>
  <Info label="Organisations" value="662" />
  <Info label="Top Targets" value="100" />
  <Info label="Verification Queue" value="35" />
  <Info label="Amplifiers" value="40" />
</div>

  function handleAddOrganisation(event) {
  event.preventDefault();

  const organisationToAdd = {
id: Date.now(),
...newOrganisation,

pipelineStage: 'Research',

relationships: [],

intelligenceSignals: [],

contacts: [
{
id: Date.now() + 1,
name: 'Primary Contact',
jobTitle: '',
email: '',
mobile: '',
linkedin: '',
decisionRole: 'Unknown',
influenceLevel: 'Unknown',
lastContacted: '',
notes: '',
},
],
};


  setOrganisations((current) => [organisationToAdd, ...current]);
  setSelectedOrganisation(organisationToAdd);
  setActiveTab('overview');
  setShowAddForm(false);

  setNewOrganisation({
    name: '',
    website: '',
    linkedin: '',
    sector: '',
    subsector: '',
    role: '',
    priority: 'Medium',
    stage: 'Not Reviewed',
    owner: '',
    verificationStatus: 'Not Started',
    notes: '',
  });
}

function handleAddContact() {
  const contactToAdd = {
    id: Date.now(),
    ...newContact,
  };

  const updatedOrganisation = {
    ...selectedOrganisation,
    contacts: [
      ...(selectedOrganisation.contacts || []),
      contactToAdd,
    ],
  };

  setOrganisations((current) =>
    current.map((org) =>
      org.id === selectedOrganisation.id
        ? updatedOrganisation
        : org
    )
  );

  setSelectedOrganisation(updatedOrganisation);

  setNewContact({
    name: '',
    jobTitle: '',
    email: '',
    mobile: '',
    decisionRole: 'Unknown',
    influenceLevel: 'Unknown',
    notes: '',
  });

  setShowAddContactForm(false);
}

  return (
    <div>
      <p style={{ color: '#64748b', fontSize: 13, fontWeight: 700 }}>
        Organisations
      </p>

      <h1 style={{ margin: 0, fontSize: 30 }}>Commercial targeting workspace</h1>

      <p style={{ color: '#475569', maxWidth: 760 }}>
        Manage CBAM ecosystem organisations, contacts, relationships and intelligence targeting.
      </p>

      <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginTop: 24,
    marginBottom: 24,
  }}
>
  <Info label="Organisations" value="662" />
  <Info label="Top Targets" value="100" />
  <Info label="Verification Queue" value="35" />
  <Info label="Amplifiers" value="40" />
</div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <input
          type="text"
          placeholder="Search organisations, sectors or roles..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            fontSize: 14,
          }}
        />

        <button
  onClick={() => setShowAddForm(true)}
  style={{
    padding: '12px 16px',
    borderRadius: 10,
    border: 'none',
    background: '#0f172a',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }}
>
  + Add organisation
</button>
      </div>

      {showAddForm && (
  <form
    onSubmit={handleAddOrganisation}
    style={{
      marginTop: 18,
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: 20,
    }}
  >
    <h2 style={{ marginTop: 0 }}>Add organisation</h2>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      <Input label="Organisation name" field="name" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="Website" field="website" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="LinkedIn" field="linkedin" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="Sector" field="sector" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="Subsector" field="subsector" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="Ecosystem role" field="role" value={newOrganisation} setValue={setNewOrganisation} />
      <Input label="Owner" field="owner" value={newOrganisation} setValue={setNewOrganisation} />
    </div>

    <div style={{ marginTop: 12 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
        Notes
      </label>
      <textarea
        value={newOrganisation.notes}
        onChange={(event) =>
          setNewOrganisation((current) => ({
            ...current,
            notes: event.target.value,
          }))
        }
        style={{
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 90,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
}}
      />
    </div>

    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      <button type="submit">Save organisation</button>
      <button type="button" onClick={() => setShowAddForm(false)}>
        Cancel
      </button>
    </div>
  </form>
)}

      <div
        style={{
          marginTop: 18,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: '#475569' }}>
              <th style={{ padding: 14, textAlign: 'left' }}>Organisation</th>
              <th style={{ padding: 14, textAlign: 'left' }}>Sector</th>
              <th style={{ padding: 14, textAlign: 'left' }}>Role</th>
              <th style={{ padding: 14, textAlign: 'left' }}>Priority</th>
              <th style={{ padding: 14, textAlign: 'left' }}>Stage</th>
              <th style={{ padding: 14, textAlign: 'left' }}>Owner</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrganisations.map((org) => (
              <tr
                key={org.id}
                onClick={() => {
                setSelectedOrganisation(org);
                setActiveTab('overview');
                }}
                style={{
                  borderTop: '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: 14, fontWeight: 700 }}>{org.name}</td>
                <td style={{ padding: 14 }}>{org.sector}</td>
                <td style={{ padding: 14 }}>{org.role}</td>
                <td style={{ padding: 14 }}>{org.priority}</td>
                <td style={{ padding: 14 }}>{org.stage}</td>
                <td style={{ padding: 14 }}>{org.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 12, color: '#64748b', fontSize: 13 }}>
        Showing {filteredOrganisations.length} of {organisations.length} organisations
      </p>
    </div>
    
  );
}

function Info({ label, value }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 16,
        background: '#f8fafc',
      }}
    >
      <p style={{ margin: 0, color: '#64748b', fontSize: 12, fontWeight: 700 }}>
        {label}
      </p>
      <p style={{ margin: '6px 0 0', fontWeight: 700 }}>{value}</p>
    </div>
  );
}

const PIPELINE_STAGES = [
  'Research',
  'Contact Identified',
  'Assessment Invited',
  'Assessment Completed',
  'Meeting Booked',
  'Opportunity',
  'Customer',
];

function PipelineProgress({ currentStage }) {
  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 18,
        padding: 20,
        margin: '18px 0 28px',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}
        >
          Commercial journey
        </p>

        <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>
          {currentStage}
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: 10,
        }}
      >
        {PIPELINE_STAGES.map((stage, index) => {
          const isComplete = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={stage}
              style={{
                background: isComplete ? '#dcfce7' : '#ffffff',
                border: `1px solid ${
                  isCurrent ? '#16a34a' : isComplete ? '#86efac' : '#e2e8f0'
                }`,
                borderRadius: 14,
                padding: '14px 10px',
                minHeight: 72,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: isComplete ? '#16a34a' : '#e2e8f0',
                  color: isComplete ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                {isComplete ? '✓' : index + 1}
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: isComplete ? '#166534' : '#475569',
                  lineHeight: 1.3,
                }}
              >
                {stage}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Input({ label, field, value, setValue }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
        {label}
      </label>
      <input
        value={value[field]}
        onChange={(event) =>
          setValue((current) => ({
            ...current,
            [field]: event.target.value,
          }))
        }
        style={{
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
}}
      />
    </div>
  );
}