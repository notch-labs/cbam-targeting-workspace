const path = require('path');
const xlsx = require('xlsx');
const { Pool } = require('pg');
require('dotenv').config();

console.log('IMPORT SCRIPT STARTED');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const filePath = path.join(
  __dirname,
  '..',
  'data',
  'CBAM_Ecosystem_Master_Database.xlsx'
);

const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets['Intelligence Master'];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

console.log(`Rows found in Excel: ${rows.length}`);

function get(row, key) {
  return row[key] === '' ? null : row[key];
}

function deriveDesiredOutcome(row) {
  const role = String(get(row, 'Ecosystem Role') || '').toLowerCase();
  const type = String(get(row, 'Organisation Type') || '').toLowerCase();

  if (role.includes('customs') || type.includes('customs')) return 'Partner';
  if (role.includes('association') || type.includes('association')) return 'Referrer';
  if (role.includes('media')) return 'Influencer';
  if (role.includes('advisor') || type.includes('advisor')) return 'Partner';

  return 'Customer';
}

function deriveNextAction(row) {
  const desiredOutcome = deriveDesiredOutcome(row);

  if (desiredOutcome === 'Partner') return 'Book partner discussion';
  if (desiredOutcome === 'Referrer') return 'Invite to member webinar';
  if (desiredOutcome === 'Influencer') return 'Share sector briefing';

  return 'Invite to demo webinar';
}

async function importRows() {
  await pool.query('TRUNCATE TABLE organisations RESTART IDENTITY');

  for (const row of rows) {
    const desiredOutcome = deriveDesiredOutcome(row);

    await pool.query(
      `
      INSERT INTO organisations (
        organisation_name,
        website,
        ecosystem_role,
        cbam_sector,
        source,
        source_type,
        organisation_type,
        extraction_status,
        enrichment_status,
        importer_likelihood,
        cbam_relevance,
        priority_tier,
        geographic_coverage,
        services_activity,
        industry_focus,
        association_relationship,
        known_customers_reach,
        contact_route,
        linkedin_url,
        notes,
        source_url,
        date_extracted,
        priority_score,
        targeting_status,
        acquisition_route,
        campaign_segment,
        subsector,
        influence_score_v5,
        customer_potential,
        partnership_potential,
        intelligence_type,
        association_membership_v5,
        enrichment_confidence,
        enrichment_evidence_url,
        enrichment_notes_v5,
        last_enriched,
        enrichment_batch,
        customs_service_type,
        industry_focus_v5,
        verified_website_url,
        verified_linkedin_url,
        verified_subsector,
        verified_services_activity,
        verification_source_urls,
        verification_status,
        verification_notes,
        verified_date,
        verification_batch,
        target_type,
        desired_outcome,
        pipeline_stage,
        assessment_status,
        readiness_band,
        owner,
        next_action
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
        $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
        $41,$42,$43,$44,$45,$46,$47,$48,
        $49,$50,$51,$52,$53,$54,$55
      )
      `,
      [
        get(row, 'Organisation Name'),
        get(row, 'Website'),
        get(row, 'Ecosystem Role'),
        get(row, 'CBAM Sector'),
        get(row, 'Source'),
        get(row, 'Source Type'),
        get(row, 'Organisation Type'),
        get(row, 'Extraction Status'),
        get(row, 'Enrichment Status'),
        get(row, 'Importer Likelihood'),
        get(row, 'CBAM Relevance'),
        get(row, 'Priority Tier'),
        get(row, 'Geographic Coverage'),
        get(row, 'Services / Activity'),
        get(row, 'Industry Focus'),
        get(row, 'Association / Relationship'),
        get(row, 'Known Customers / Reach'),
        get(row, 'Contact Route'),
        get(row, 'LinkedIn URL'),
        get(row, 'Notes'),
        get(row, 'Source URL'),
        get(row, 'Date Extracted'),
        Number(get(row, 'Priority Score')) || null,
        get(row, 'Targeting Status'),
        get(row, 'Acquisition Route'),
        get(row, 'Campaign Segment'),
        get(row, 'Subsector'),
        Number(get(row, 'Influence Score v5')) || null,
        get(row, 'Customer Potential'),
        get(row, 'Partnership Potential'),
        get(row, 'Intelligence Type'),
        get(row, 'Association Membership v5'),
        Number(get(row, 'Enrichment Confidence')) || null,
        get(row, 'Enrichment Evidence URL'),
        get(row, 'Enrichment Notes v5'),
        get(row, 'Last Enriched'),
        get(row, 'Enrichment Batch'),
        get(row, 'Customs Service Type'),
        get(row, 'Industry Focus v5'),
        get(row, 'Verified Website URL'),
        get(row, 'Verified LinkedIn URL'),
        get(row, 'Verified Subsector'),
        get(row, 'Verified Services / Activity'),
        get(row, 'Verification Source URLs'),
        get(row, 'Verification Status'),
        get(row, 'Verification Notes'),
        get(row, 'Verified Date'),
        get(row, 'Verification Batch'),

        get(row, 'Ecosystem Role'),
        desiredOutcome,
        get(row, 'Targeting Status') || 'Research',
        'Not Invited',
        null,
        'James',
        deriveNextAction(row),
      ]
    );
  }

  const result = await pool.query('SELECT COUNT(*) FROM organisations');
  console.log(`Imported ${result.rows[0].count} organisations`);

  await pool.end();
}

importRows().catch((error) => {
  console.error('IMPORT FAILED');
  console.error(error);
  process.exit(1);
});