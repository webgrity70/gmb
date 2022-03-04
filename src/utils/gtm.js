export const gaEvent = ({ action, category, label, value }) => {
  if (!window.dataLayer) return;
  window.dataLayer.push({
    event: 'GAEvent',
    eventAction: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
  });
};

export const gaTransaction = (transaction) => {
  if (!window.dataLayer) return;
  window.dataLayer.push({
    event: 'GATransaction',
    ...transaction,
  });
};

export const trackSignup = {
  startQuestionnaire() {
    gaEvent({ action: 'Questionnaire Started', category: 'Signup Form' });
  },
  viewQuestionnaireModule(module) {
    gaEvent({
      action: `Questionnaire Module: ${module}`,
      category: 'Signup Form',
    });
  },
  accountCreated() {
    gaEvent({ action: 'Account Created', category: 'Signup Form' });
  },
  accountVerified() {
    gaEvent({ action: 'Account Verified', category: 'Signup Form' });
  },
};
