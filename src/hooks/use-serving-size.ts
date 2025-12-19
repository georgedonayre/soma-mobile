// hooks/useServingSize.ts
import { useMemo, useState } from "react";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function useServingSize(
  originalServingSize: number,
  baseMacros: Macros | null
) {
  const [servingSize, setServingSize] = useState(originalServingSize);
  const [servingSizeText, setServingSizeText] = useState(
    originalServingSize.toString()
  );

  const adjustedMacros = useMemo(() => {
    if (!baseMacros) return null; // guard against null

    const ratio = servingSize / originalServingSize;

    return {
      calories: Math.round(baseMacros.calories * ratio),
      protein: +(baseMacros.protein * ratio).toFixed(1),
      carbs: +(baseMacros.carbs * ratio).toFixed(1),
      fat: +(baseMacros.fat * ratio).toFixed(1),
    };
  }, [servingSize, originalServingSize, baseMacros]);

  const handleServingSizeChange = (value: number) => {
    setServingSize(value);
    setServingSizeText(value.toFixed(0));
  };

  const handleTextInputChange = (text: string) => {
    setServingSizeText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed > 0) {
      setServingSize(parsed);
    }
  };

  return {
    servingSize,
    servingSizeText,
    adjustedMacros,
    handleServingSizeChange,
    handleTextInputChange,
  };
}
