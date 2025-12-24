export interface NutritionInsight {
  diagnosis: string;
  confidence: number;

  root_causes: string[];

  recommendations: {
    action: string;
    impact: string;
  }[];

  prediction: {
    risk: string;
    timeframe: string;
  };

  explainability: {
    triggered_signals: string[];
    reasoning: string;
  };

  warning?: string;
}
