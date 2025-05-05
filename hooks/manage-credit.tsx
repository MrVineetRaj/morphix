import { useState, useCallback } from "react";

export const useManageCredit = (initialCredits: number = 0) => {
  const [credits, setCreditsState] = useState<number>(initialCredits);

  const setCredits = useCallback((newCredits: number) => {
    if (newCredits >= 0) {
      setCreditsState(newCredits);
    } else {
      setCreditsState(0);
    }
  }, []);

  return {
    credits,
    setCredits,
  };
};
