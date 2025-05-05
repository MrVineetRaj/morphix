import { useState, useCallback } from 'react';

/**
 * Custom hook to manage a user's credit count.
 *
 * @param initialCredits - The initial number of credits. Defaults to 0.
 * @returns An object containing the current credit count and a function to set it.
 */
export const useManageCredit = (initialCredits: number = 0) => {
  const [credits, setCreditsState] = useState<number>(initialCredits);

  /**
   * Sets the credit count to a new value.
   * @param newCredits - The new number of credits.
   */
  const setCredits = useCallback((newCredits: number) => {
    // Optional: Add validation if needed (e.g., ensure credits aren't negative)
    if (newCredits >= 0) {
      setCreditsState(newCredits);
    } else {
      
      setCreditsState(0);
    }
  }, []); // useCallback ensures the function identity is stable unless dependencies change

  return {
    credits,
    setCredits,
  };
};