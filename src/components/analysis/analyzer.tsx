import {
  Activity,
  Beaker,
  Bug,
  Download,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  Save,
  ShieldCheck,
  Sprout,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { saveAnalysis } from "@/lib/analyses";
import type { AnalysisReport } from "@/lib/analysis-types";
import { analyzeImageViaApi } from "@/lib/analysis-api";
import { downloadReportPdf } from "@/lib/report-pdf";

// Base64 adds roughly 33% to the request; keep the encoded body below
// Netlify's synchronous function payload limit.
const MAX_BYTES = 4 * 1024 * 1024;

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Leaf;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null | undefined }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2 last:border-0 sm:flex-row sm:gap-4">
      <span className="min-w-44 text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function ReportView({
  report,
  imageDataUrl,
}: {
  report: AnalysisReport;
  imageDataUrl: string | null;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user) {
      toast.info("Sign in to save this report to your history.");
      void navigate({ to: "/auth", search: { redirect: "/analyze" } });
      return;
    }
    setSaving(true);
    try {
      await saveAnalysis({
        userId: user.uid,
        kind: report.kind === "soil" ? "soil" : "plant",
        title: report.title ?? "Analysis",
        imageDataUrl,
        report,
      });
      toast.success("Saved to your dashboard.");
    } catch {
      toast.error("Could not save this report.");
    }
    setSaving(false);
  };

  const health = Math.max(0, Math.min(100, Number(report.health?.rating ?? 0)));

  return (
    <div className="space-y-5">
      <div className="surface-card overflow-hidden">
        <div className="gradient-primary px-6 py-5 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
            {report.kind} analysis · {report.subject_type}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{report.title}</h2>
        </div>
        <div className="grid gap-5 p-6 md:grid-cols-[220px_1fr]">
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt={`Uploaded sample analysed as ${report.subject_type}`}
              className="h-44 w-full rounded-xl border border-border object-cover"
            />
          ) : null}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{report.health?.condition}</Badge>
              <Badge variant="outline">Health {health}/100</Badge>
              {report.microbiological_safety ? (
                <Badge variant="outline">
                  Microbiological safety {report.microbiological_safety.percentage}%
                </Badge>
              ) : null}
            </div>
            <Progress value={health} className="mt-3" />
            <p className="mt-3 text-sm text-muted-foreground">{report.health?.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => downloadReportPdf(report, imageDataUrl)}>
                <Download className="mr-2 size-4" /> Download detailed PDF report
              </Button>
              <Button variant="outline" onClick={save} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {user ? "Save to history" : "Sign in to save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section icon={Leaf} title="Identity & Classification">
          <Row label="Common name" value={report.identity?.common_name} />
          <Row label="Scientific name" value={report.identity?.botanical_or_taxonomic_name} />
          <Row label="Family / Order" value={report.identity?.family_or_order} />
          <Row label="Classified by" value={report.identity?.classified_by} />
          <Row label="Notes" value={report.identity?.classification_note} />
        </Section>

        <Section icon={FlaskConical} title="Nutrient status & remediation">
          <div className="space-y-3">
            {(report.nutrients ?? []).map((n) => (
              <div key={n.nutrient} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{n.nutrient}</p>
                  <Badge variant={n.severity === "none" ? "secondary" : "outline"}>
                    {n.status} · {n.severity}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <strong className="text-foreground">Organic:</strong> {n.organic_correction}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Chemical:</strong> {n.chemical_correction}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Bug} title="Detected issues & treatments">
          {(report.issues ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No significant issues detected.</p>
          ) : (
            <div className="space-y-3">
              {(report.issues ?? []).map((i) => (
                <div key={i.name} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{i.name}</p>
                    <Badge variant="outline">
                      {i.category} · {i.confidence}%
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{i.description}</p>
                  <p className="mt-1 text-sm">
                    <strong>Treatment:</strong> {i.treatment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section icon={ShieldCheck} title="Prevention strategy">
          <ul className="space-y-2">
            {(report.prevention ?? []).map((p) => (
              <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                <Sprout className="mt-0.5 size-4 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Droplets} title="Irrigation & soil profile">
          <Row label="Best irrigation system" value={report.irrigation?.system} />
          <Row label="Schedule" value={report.irrigation?.schedule} />
          <Row label="Notes" value={report.irrigation?.notes} />
          <Row
            label="Best soil types"
            value={(report.soil_profile?.best_soil_types ?? []).join(", ")}
          />
          <Row label="Texture class" value={report.soil_profile?.texture_class} />
          <Row label="pH range" value={report.soil_profile?.ph_range} />
          <Row label="Soil notes" value={report.soil_profile?.notes} />
        </Section>

        <Section icon={Beaker} title="Genetics, GMO & safety">
          <Row label="Cultivar" value={report.genetics?.cultivar} />
          <Row label="Traits" value={(report.genetics?.traits ?? []).join(", ")} />
          <Row label="GMO status" value={report.genetics?.gmo_status} />
          <Row
            label="Microbiological safety"
            value={
              report.microbiological_safety
                ? `${report.microbiological_safety.percentage}% — ${report.microbiological_safety.notes}`
                : undefined
            }
          />
        </Section>

        {report.produce_metrics ? (
          <Section icon={Activity} title="Fruit / vegetable metrics">
            <Row label="Sugar content (Brix)" value={report.produce_metrics.brix_percent} />
            <Row label="Acidity (pH)" value={report.produce_metrics.ph_level} />
            <Row label="Notes" value={report.produce_metrics.notes} />
          </Section>
        ) : null}

        {report.seed_metrics ? (
          <Section icon={Sprout} title="Seed quality metrics">
            <Row label="Germination" value={report.seed_metrics.germination_percent} />
            <Row label="Physical purity" value={report.seed_metrics.physical_purity_percent} />
            <Row label="Moisture content" value={report.seed_metrics.moisture_content_percent} />
            <Row label="Notes" value={report.seed_metrics.notes} />
          </Section>
        ) : null}

        {report.soil_metrics ? (
          <Section icon={Droplets} title="Soil metrics & best crops">
            <Row label="Moisture balance" value={report.soil_metrics.moisture_balance} />
            <Row label="Physical purity" value={report.soil_metrics.physical_purity_percent} />
            <Row label="Structure" value={report.soil_metrics.structure} />
            <Row label="Best crops" value={(report.soil_metrics.best_crops ?? []).join(", ")} />
          </Section>
        ) : null}

        <Section icon={ShieldCheck} title="Expert recommendations">
          <ul className="space-y-2">
            {(report.recommendations ?? []).map((r) => (
              <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-base font-semibold">Status summary</h3>
        <p className="mt-2 text-sm text-muted-foreground">{report.status_summary}</p>
        <p className="mt-3 text-xs text-muted-foreground">{report.confidence_note}</p>
      </div>
    </div>
  );
}

export function Analyzer() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!/^image\/(png|jpe?g|webp|heic|heif)$/.test(file.type)) {
      toast.error("Please upload a PNG, JPG or WEBP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result));
      setReport(null);
      setLastError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const run = async () => {
    if (!imageDataUrl) return;
    setLoading(true);
    setReport(null);
    setLastError(null);
    try {
      const result = await analyzeImageViaApi({
        imageDataUrl,
        note: note.trim() || undefined,
      });
      setReport(result);
      toast.success("Analysis complete.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed. Please try again.";
      toast.error(message);
      setLastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="surface-card p-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className="relative flex min-h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/35 bg-accent/40 p-6 text-center transition-colors hover:border-primary/60"
        >
          {imageDataUrl ? (
            <>
              <img
                src={imageDataUrl}
                alt="Selected sample preview"
                className="max-h-64 rounded-lg object-contain"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove image"
                className="absolute right-2 top-2"
                onClick={() => {
                  setImageDataUrl(null);
                  setReport(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="gradient-primary mb-3 flex size-12 items-center justify-center rounded-full text-primary-foreground">
                <Upload className="size-5" />
              </span>
              <p className="font-medium">Drop a crop, fruit, seed or soil photo here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                 PNG, JPG or WEBP up to 4MB — no account needed
              </p>
              <Button className="mt-4" onClick={() => inputRef.current?.click()}>
                Choose image
              </Button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder="Optional: add field context — region, crop stage, recent treatments…"
          className="mt-4"
          rows={2}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={run} disabled={!imageDataUrl || loading}>
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {loading ? "Analysing sample…" : "Run AI analysis"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Guest analysis is free.{" "}
            <Link to="/auth" search={{ redirect: "/analyze" }} className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>{" "}
            to keep a history.
          </p>
        </div>

        {lastError?.includes("not configured") ? (
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            Deploying outside Lovable? Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">GEMINI_API_KEY</code>{" "}
            in your hosting provider's environment variables and redeploy.
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="surface-card space-y-3 p-6">
          <p className="text-sm font-medium">Running biological vision pipeline…</p>
          <Progress value={66} className="animate-pulse" />
          <p className="text-sm text-muted-foreground">
            Identifying species, scanning for pathogens, estimating nutrients and safety metrics.
          </p>
        </div>
      ) : null}

      {report ? <ReportView report={report} imageDataUrl={imageDataUrl} /> : null}
    </div>
  );
}
