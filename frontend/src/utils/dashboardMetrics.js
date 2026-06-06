import { JOURNEY_STAGES_BY_OUTCOME, OUTCOMES, ACTION_TYPES } from '../config/dashboardConfig';

export function filterOrganisations(organisations, filters) {
  return organisations.filter((org) => {
    if (filters.sector !== 'All' && org.sector !== filters.sector) return false;
    if (filters.targetType !== 'All' && org.targetType !== filters.targetType) return false;
    if (filters.desiredOutcome !== 'All' && org.desiredOutcome !== filters.desiredOutcome) return false;
    return true;
  });
}

export function getEcosystemMetrics(organisations) {
  return {
    organisations: organisations.length,
    contacts: organisations.reduce((total, org) => total + (org.contacts?.length || 0), 0),
    highPriority: organisations.filter((org) => org.priority === 'High').length,
    verificationQueue: organisations.filter((org) => org.verificationStatus !== 'Verified').length,
  };
}

export function getJourneyMetrics(organisations, selectedOutcome) {
  const outcome = selectedOutcome === 'All' ? 'Customer' : selectedOutcome;
  const stages = JOURNEY_STAGES_BY_OUTCOME[outcome] || JOURNEY_STAGES_BY_OUTCOME.Customer;

  const stageMetrics = stages.map((stage) => ({
    stage,
    count: organisations.filter((org) => org.pipelineStage === stage).length,
  }));

  return stageMetrics.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        conversionFromPrevious: null,
      };
    }

    const previousCount = stageMetrics[index - 1].count;

    return {
      ...item,
      conversionFromPrevious:
        previousCount > 0 ? Math.round((item.count / previousCount) * 100) : 0,
    };
  });
}

export function getCommercialIntelligence(organisations) {
  const total = organisations.length || 1;

  const assessmentInvited = organisations.filter(
    (org) =>
      org.assessmentStatus === 'Invited' ||
      org.assessmentStatus === 'Started' ||
      org.assessmentStatus === 'Completed'
  ).length;

  const assessmentCompleted = organisations.filter(
    (org) => org.assessmentStatus === 'Completed'
  ).length;

  const customers = organisations.filter(
    (org) => org.desiredOutcome === 'Customer' && org.pipelineStage === 'Customer'
  ).length;

  const contacts = organisations.reduce(
    (totalContacts, org) => totalContacts + (org.contacts?.length || 0),
    0
  );

  const completionRate =
    assessmentInvited > 0 ? Math.round((assessmentCompleted / assessmentInvited) * 100) : 0;

  const assessmentToCustomerRate =
    assessmentCompleted > 0 ? Math.round((customers / assessmentCompleted) * 100) : 0;

  const averageContactsPerOrganisation = (contacts / total).toFixed(1);

  return {
    assessmentInvited,
    assessmentCompleted,
    completionRate,
    customers,
    assessmentToCustomerRate,
    averageContactsPerOrganisation,
  };
}

export function getActionMetrics(organisations) {
  return ACTION_TYPES.map((action) => ({
    action,
    organisations: organisations.filter((org) => org.nextAction === action).length,
    contacts: organisations
      .filter((org) => org.nextAction === action)
      .reduce((total, org) => total + (org.contacts?.length || 0), 0),
  })).filter((item) => item.organisations > 0 || item.contacts > 0);
}

export function getOutcomeMetrics(organisations) {
  return OUTCOMES.map((outcome) => ({
    outcome,
    count: organisations.filter((org) => org.desiredOutcome === outcome).length,
  }));
}

export function getMarketCoverage(organisations, field) {
  const counts = {};

  organisations.forEach((org) => {
    const value = org[field] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}