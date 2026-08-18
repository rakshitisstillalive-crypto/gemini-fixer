import { jsPDF } from "jspdf";

import type { AnalysisReport } from "./analysis-types";

const GREEN: [number, number, number] = [5, 150, 105];
const MINT: [number, number, number] = [16, 185, 129];
const INK: [number, number, number] = [31, 41, 46];
const GREY: [number, number, number] = [110, 122, 118];

export function downloadReportPdf(report: AnalysisReport, imageDataUrl?: string | null) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = 0;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 60) {
      footer();
      doc.addPage();
      y = margin;
    }
  };

  const footer = () => {
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text(
      "Farmer's AI — AI-assisted agronomic guidance. Confirm critical decisions with a local agronomist.",
      margin,
      pageH - 30,
    );
  };

  // Header band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 96, "F");
  doc.setFillColor(...MINT);
  doc.circle(margin + 16, 48, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Farmer's AI", margin + 44, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Agricultural Intelligence Report", margin + 44, 62);
  doc.text(new Date().toLocaleString(), pageW - margin, 44, { align: "right" });
  y = 128;

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(report.title || "Analysis Report", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GREY);
  doc.text(`${report.subject_type} · ${report.kind.toUpperCase()} ANALYSIS`, margin, y);
  y += 22;

  if (imageDataUrl) {
    try {
      const w = 150;
      const h = 110;
      doc.addImage(imageDataUrl, "JPEG", pageW - margin - w, 118, w, h, undefined, "FAST");
    } catch {
      /* image preview optional */
    }
  }

  const heading = (text: string) => {
    ensure(40);
    doc.setFillColor(236, 253, 245);
    doc.rect(margin, y - 12, pageW - margin * 2, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...GREEN);
    doc.text(text.toUpperCase(), margin + 6, y + 2);
    y += 24;
  };

  const line = (label: string, value: string) => {
    if (!value) return;
    const text = doc.splitTextToSize(value, pageW - margin * 2 - 110) as string[];
    ensure(text.length * 13 + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 70, 66);
    doc.text(text, margin + 110, y);
    y += text.length * 13 + 4;
  };

  const bullets = (items: string[]) => {
    items.filter(Boolean).forEach((item) => {
      const text = doc.splitTextToSize(`•  ${item}`, pageW - margin * 2 - 8) as string[];
      ensure(text.length * 13 + 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 70, 66);
      doc.text(text, margin + 4, y);
      y += text.length * 13 + 3;
    });
    y += 4;
  };

  y = Math.max(y, 244);

  heading("Identity & Classification");
  line("Common name", report.identity?.common_name ?? "—");
  line("Scientific name", report.identity?.botanical_or_taxonomic_name ?? "—");
  line("Family / Order", report.identity?.family_or_order ?? "—");
  line("Classified by", report.identity?.classified_by ?? "—");
  line("Notes", report.identity?.classification_note ?? "");

  heading("Health Status");
  line("Rating", `${report.health?.rating ?? "—"} / 100`);
  line("Condition", report.health?.condition ?? "—");
  line("Summary", report.health?.summary ?? "");

  if (report.nutrients?.length) {
    heading("Nutrient Deficiency & Remediation");
    report.nutrients.forEach((n) => {
      line(n.nutrient, `${n.status} (${n.severity}). Organic: ${n.organic_correction} Chemical: ${n.chemical_correction}`);
    });
  }

  if (report.issues?.length) {
    heading("Detected Issues & Treatments");
    report.issues.forEach((i) => {
      line(`${i.name} (${i.confidence}%)`, `${i.category}. ${i.description} Treatment: ${i.treatment}`);
    });
  }

  if (report.prevention?.length) {
    heading("Prevention Strategy");
    bullets(report.prevention);
  }

  heading("Irrigation & Soil");
  line("Best irrigation", report.irrigation?.system ?? "—");
  line("Schedule", report.irrigation?.schedule ?? "");
  line("Irrigation notes", report.irrigation?.notes ?? "");
  line("Best soil types", (report.soil_profile?.best_soil_types ?? []).join(", "));
  line("Texture class", report.soil_profile?.texture_class ?? "");
  line("pH range", report.soil_profile?.ph_range ?? "");

  heading("Genetics, GMO & Safety");
  line("Cultivar", report.genetics?.cultivar ?? "—");
  line("Traits", (report.genetics?.traits ?? []).join(", "));
  line("GMO status", report.genetics?.gmo_status ?? "—");
  line(
    "Microbiological safety",
    `${report.microbiological_safety?.percentage ?? "—"}% — ${report.microbiological_safety?.notes ?? ""}`,
  );

  if (report.produce_metrics) {
    heading("Fruit / Vegetable Metrics");
    line("Sugar content (Brix)", report.produce_metrics.brix_percent);
    line("Acidity (pH)", report.produce_metrics.ph_level);
    line("Notes", report.produce_metrics.notes);
  }

  if (report.seed_metrics) {
    heading("Seed Quality Metrics");
    line("Germination", report.seed_metrics.germination_percent);
    line("Physical purity", report.seed_metrics.physical_purity_percent);
    line("Moisture content", report.seed_metrics.moisture_content_percent);
    line("Notes", report.seed_metrics.notes);
  }

  if (report.soil_metrics) {
    heading("Soil Metrics");
    line("Moisture balance", report.soil_metrics.moisture_balance);
    line("Physical purity", report.soil_metrics.physical_purity_percent);
    line("Structure", report.soil_metrics.structure);
    line("Best crops", (report.soil_metrics.best_crops ?? []).join(", "));
  }

  if (report.recommendations?.length) {
    heading("Expert Recommendations");
    bullets(report.recommendations);
  }

  heading("Status Summary");
  const summary = doc.splitTextToSize(
    `${report.status_summary ?? ""}\n\n${report.confidence_note ?? ""}`,
    pageW - margin * 2,
  ) as string[];
  ensure(summary.length * 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 70, 66);
  doc.text(summary, margin, y);

  footer();
  const slug = (report.title || "farmers-ai-report").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`${slug}.pdf`);
}
