export const wizardState = {
  createPage: { step: 1, recipient: '', occasion: '', mappedWizard: '' },
  wizards: {} as Record<string, number>
};

export const clearWizardState = () => {
  wizardState.createPage = { step: 1, recipient: '', occasion: '', mappedWizard: '' };
  wizardState.wizards = {};
};

import { useState, useEffect } from 'react';
export function useWizardStep(key: string) {
  const [step, setStep] = useState(wizardState.wizards[key] || 1);
  useEffect(() => {
    wizardState.wizards[key] = step;
  }, [step, key]);
  return [step, setStep] as const;
}
