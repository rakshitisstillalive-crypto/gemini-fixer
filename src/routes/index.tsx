import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Droplets,
  FlaskConical,
  Leaf,
  LineChart,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Wheat,
} from "lucide-react";

import heroFarm from "@/assets/hero-farm.jpg";
import { Analyzer } from "@/components/analysis/analyzer";
import { LeafClassificationModal } from "@/components/analysis/leaf-classification-modal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Farmer's APP — Instant Crop, Soil & Seed Diagnostics from a Photo" },
      {
        name: "description",
        content:
          "Upload a crop, fruit, seed or soil photo and get an instant agronomic report: disease detection, nutrient deficiencies, Brix, pH, germination and a downloadable PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Farmer's APP — Agricultural Intelligence from a Photo" },
      {
        property: "og:description",
        content:
          "Elite biological vision AI for growers: crop health, soil diagnostics, seed quality and produce grading in seconds.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Farmer's APP",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "AI-powered crop health, soil diagnostics, seed quality and produce grading from photographs.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Home,
});

const stats = [
  { icon: Droplets, value: "30%", label: "Less water usage", note: "Across irrigated plots" },
  { icon: LineChart, value: "25%", label: "Higher crop yield", note: "Season over season" },
  { icon: ShieldCheck, value: "95%", label: "Disease detection accuracy", note: "On field imagery" },
  { icon: Users, value: "10,000+", label: "Growers supported", note: "In 14 countries" },
];

const features = [
  {
    icon: Leaf,
    title: "Crop Health Analyzer",
    body: "Species ID, disease and pest detection, nutrient deficiency mapping with organic and chemical corrections.",
    to: "/product/crop-health" as const,
  },
  {
    icon: Droplets,
    title: "Soil Diagnostics",
    body: "Texture class, pH, moisture balance, N-P-K breakdown, best crops and the ideal irrigation setup.",
    to: "/product/soil-diagnostics" as const,
  },
  {
    icon: Leaf,
    title: "Leaf Classification",
    body: "Identify plant species, leaf disorders, and stress patterns from a single photo with AI taxonomy and health scoring.",
    to: "/product/crop-health" as const,
  },
  {
    icon: Wheat,
    title: "Seed Quality Tester",
    body: "Germination percentage, physical purity, moisture content and GMO/cultivar trait indicators.",
    to: "/product/seed-quality" as const,
  },
  {
    icon: FlaskConical,
    title: "Brix & pH Assessor",
    body: "Estimate sugar content, acidity and ripeness so you harvest and price produce at its peak.",
    to: "/product/brix-ph" as const,
  },
  {
    icon: LineChart,
    title: "Field Report Archive",
    body: "Save every diagnosis to your dashboard, track a plot over the season and export printable PDFs.",
    to: "/dashboard" as const,
  },
];

const steps = [
  {
    icon: Camera,
    title: "Upload a photo",
    body: "Snap a leaf, fruit, seed lot or a patch of soil straight from your phone.",
  },
  {
    icon: FlaskConical,
    title: "Biological vision runs",
    body: "The agent classifies the sample and cross-checks agronomy, pathology and soil science.",
  },
  {
    icon: ShieldCheck,
    title: "Read the diagnosis",
    body: "Scored condition report with ranked causes, confidence levels and honest limitations.",
  },
  {
    icon: Sprout,
    title: "Act in the field",
    body: "Staged treatments with dosages, irrigation guidance and follow-up timing — plus a PDF.",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-surface relative overflow-hidden">
        <div className="hero-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-28 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-40 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-hero-foreground/20 bg-hero-foreground/10 px-4 py-1.5 text-xs font-semibold text-hero-muted">
              <Sparkles className="size-3.5 text-lime-accent" /> Smarter farming. Healthier crops.
              Better yields.
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-hero-foreground sm:text-6xl">
              Grow smarter with{" "}
              <span className="text-lime-accent">AI-powered</span> agriculture
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-hero-muted sm:text-lg">
              Farmer&apos;s APP reads crops, fruit, seeds and soil like an agronomist — identifying
              species, diseases, nutrient gaps, Brix, pH and germination, then hands you a
              downloadable field report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7" asChild>
                <Link to="/analyze">
                  Start growing smarter <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-hero-foreground/25 bg-transparent px-7 text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
                asChild
              >
                <a href="#features">Explore features</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-hero-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-lime-accent" /> 95% detection accuracy
              </span>
              <span className="inline-flex items-center gap-2">
                <Droplets className="size-4 text-lime-accent" /> 30% less water used
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-hero-foreground/15 shadow-elegant">
              <img
                src={heroFarm}
                alt="Aerial view of a smart farm at sunrise with an autonomous drone monitoring crop rows"
                width={1280}
                height={960}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass-panel absolute inset-x-4 bottom-4 rounded-2xl p-4 sm:inset-x-6 sm:bottom-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime-accent">
                Field 04 · Tomato
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-hero-foreground">Crop health 92 / 100</p>
                <span className="shrink-0 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-hero">
                  Healthy
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-hero-foreground/20">
                <div className="h-full w-[92%] rounded-full bg-lime" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 pb-16 lg:-mt-24">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="surface-card p-6">
              <span className="mb-5 flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                <s.icon className="size-5" />
              </span>
              <p className="text-3xl font-bold sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm font-semibold">{s.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            AI capabilities
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
            Everything your field needs, in one intelligent layer
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Purpose-built models for agriculture — trained across cereals, pulses, vegetables,
            fruits, flowers and plantation crops.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const inner = (
                <>
                  <span className="gradient-primary mb-5 flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {f.title === "Leaf Classification" ? "Open details" : "Learn more"}
                    <ArrowRight className="size-3.5" />
                  </span>
                </>
              );

              if (f.title === "Leaf Classification") {
                return (
                  <LeafClassificationModal key={f.title}>
                    <div
                      className="surface-card cursor-pointer p-6 transition-shadow hover:shadow-elegant"
                      role="button"
                      tabIndex={0}
                    >
                      {inner}
                    </div>
                  </LeafClassificationModal>
                );
              }

              return (
                <Link
                  key={f.title}
                  to={f.to}
                  className="surface-card p-6 transition-shadow hover:shadow-elegant"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">How it works</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          From a field photo to a farm decision in four steps
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="surface-card relative p-6">
              <p className="font-display text-3xl font-bold text-primary/25">
                {String(i + 1).padStart(2, "0")}
              </p>
              <s.icon className="mt-4 size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live demo */}
      <section id="analyze" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Live AI demo
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Analyse any crop, fruit, vegetable or flower
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Guest mode gives you the complete report — nothing held back.
          </p>
          <div className="mt-8">
            <Analyzer />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="hero-surface relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="hero-grid absolute inset-0" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold text-hero-foreground sm:text-4xl">
              Put an agronomist in every pocket on your farm
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-hero-muted">
              Free to try, no account needed. Sign in only when you want to keep a season-long
              history of your fields.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full px-7" asChild>
                <Link to="/analyze">
                  Analyze a photo free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-hero-foreground/25 bg-transparent px-7 text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
                asChild
              >
                <Link to="/manual">Read the manual</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
