export type Metric = { label: string; value: string; note?: string };

export type NutrientFinding = {
  nutrient: string;
  status: string;
  severity: "none" | "low" | "moderate" | "severe" | string;
  organic_correction: string;
  chemical_correction: string;
};

export type IssueFinding = {
  name: string;
  category: string;
  confidence: number;
  description: string;
  treatment: string;
};

export type AnalysisReport = {
  kind: "plant" | "soil" | "unknown";
  subject_type: string;
  title: string;
  identity: {
    common_name: string;
    botanical_or_taxonomic_name: string;
    family_or_order: string;
    classified_by: string;
    classification_note: string;
  };
  health: { rating: number; condition: string; summary: string };
  nutrients: NutrientFinding[];
  issues: IssueFinding[];
  prevention: string[];
  irrigation: { system: string; schedule: string; notes: string };
  soil_profile: { best_soil_types: string[]; texture_class: string; ph_range: string; notes: string };
  genetics: { cultivar: string; traits: string[]; gmo_status: string };
  microbiological_safety: { percentage: number; notes: string };
  produce_metrics: { brix_percent: string; ph_level: string; notes: string } | null;
  seed_metrics: {
    germination_percent: string;
    physical_purity_percent: string;
    moisture_content_percent: string;
    notes: string;
  } | null;
  soil_metrics: {
    moisture_balance: string;
    physical_purity_percent: string;
    structure: string;
    best_crops: string[];
  } | null;
  recommendations: string[];
  status_summary: string;
  confidence_note: string;
};
