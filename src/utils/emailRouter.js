import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';

/**
 * POST B2B / institutional intake payloads to the sovereign Hostinger mail gateway.
 */
export async function submitIntakeForm({
  institutionName,
  contactPerson,
  selectedTier,
  domainContext,
  additionalFields = {},
}) {
  const emailRouterEndpoint =
    SAFEAI_MASTER_CONFIG?.infrastructure?.emailRouterEndpoint ?? '/api/contact.php';

  const payload = {
    subject: `safeAI.report Intake — ${selectedTier}`,
    institution_name: institutionName,
    contact_person: contactPerson,
    selected_tier: selectedTier,
    domain_context: domainContext,
    ...additionalFields,
  };

  let response;
  try {
    response = await fetch(emailRouterEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Email router network unreachable');
  }

  if (!response.ok) {
    throw new Error(`Email router rejected submission (${response.status})`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('Email router returned an invalid response');
  }

  if (result?.success === false) {
    throw new Error(result.message || 'Email router rejected submission');
  }

  return result;
}

export function getDomainContext() {
  if (typeof window === 'undefined') return 'safeai.report';
  return `${window.location.origin}${window.location.pathname}`;
}
