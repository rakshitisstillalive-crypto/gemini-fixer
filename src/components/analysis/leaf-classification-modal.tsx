import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Leaf,
  Microscope,
  ScanLine,
  Sprout,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LeafClassificationModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="gradient-primary flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            Leaf Classification
          </DialogTitle>
          <DialogDescription>
            How the model reads a leaf and what you can expect from the report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm text-muted-foreground">
          <div className="surface-card p-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Sprout className="size-4 text-primary" />
              What it does
            </h3>
            <p className="mt-2">
              The Leaf Classification model identifies a plant from a single leaf
              photo, then checks for disorders, stress patterns and visible
              symptoms. It combines botanical taxonomy with agronomic pathology
              so you get a species name, a health score and a ranked list of what
              could be going wrong.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ScanLine className="size-4 text-primary" />
              How it works
            </h3>
            <ol className="mt-3 space-y-3">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  1
                </span>
                <span>
                  <strong className="text-foreground">Shape & vein pattern</strong> —
                  the model extracts leaf margin, venation and surface texture to
                  narrow the botanical family.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  2
                </span>
                <span>
                  <strong className="text-foreground">Symptom forensics</strong> —
                  it looks at lesion shape, chlorosis pattern, necrosis and
                  leaf position (old vs. new growth) to separate nutrient issues
                  from pests and diseases.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  3
                </span>
                <span>
                  <strong className="text-foreground">Confidence ranking</strong> —
                  every finding is scored. High confidence means the visual signs
                  are strong; lower confidence tells you where a lab test or
                  closer inspection would help.
                </span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Microscope className="size-4 text-primary" />
              What the report includes
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                "Common & scientific species name",
                "Botanical family and classifier note",
                "Health rating (0–100) and condition",
                "Nutrient deficiency checks (N, P, K, Ca, Mg, S, Fe, Zn, Mn, B)",
                "Pest, disease, fungal or abiotic issue list",
                "Organic and chemical treatment options",
                "Prevention and irrigation recommendations",
                "Downloadable PDF field report",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-600">
              <AlertCircle className="size-4" />
              What to expect
            </h3>
            <p className="mt-2">
              Photo-based diagnosis is a fast field screening tool, not a
              laboratory assay. The model gives its best scientific estimate from
              visible evidence. Always confirm high-stakes decisions (purchase of
              pesticides, variety selection, certification) with a local agronomist
              or lab test.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button asChild>
            <Link to="/analyze">
              Analyze a leaf photo <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
