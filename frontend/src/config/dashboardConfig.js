export const OUTCOMES = ['Customer', 'Partner', 'Referrer', 'Advocate', 'Influencer'];

export const TARGET_TYPES = [
  'Importer',
  'Trade Association',
  'Customs Partner',
  'Advisor',
  'Industry Body',
  'Influencer',
  'Media',
];

export const CUSTOMER_STAGES = [
  'Research',
  'Contact Identified',
  'Assessment Invited',
  'Assessment Completed',
  'Meeting Booked',
  'Opportunity',
  'Customer',
];

export const PARTNER_STAGES = [
  'Research',
  'Contact Identified',
  'Meeting Booked',
  'Partner Discussion',
  'Partner Agreed',
  'Active Partner',
];

export const REFERRER_STAGES = [
  'Research',
  'Contact Identified',
  'Relationship Established',
  'Content Shared',
  'Member Promotion',
  'Active Referrer',
];

export const JOURNEY_STAGES_BY_OUTCOME = {
  Customer: CUSTOMER_STAGES,
  Partner: PARTNER_STAGES,
  Referrer: REFERRER_STAGES,
  Advocate: REFERRER_STAGES,
  Influencer: REFERRER_STAGES,
};

export const ACTION_TYPES = [
  'Invite to demo webinar',
  'Share sector briefing',
  'Assessment follow up',
  'Book intro call',
  'Partner discussion',
  'Verification required',
];