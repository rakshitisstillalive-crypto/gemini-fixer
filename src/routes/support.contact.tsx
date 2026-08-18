import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/support/contact")({
  head: () => ({
    meta: [
      { title: "Contact Support — Farmer's AI" },
      {
        name: "description",
        content:
          "Reach the Farmer's AI support team for help with analyses, reports, accounts or agronomic questions.",
      },
      { property: "og:title", content: "Contact Support — Farmer's AI" },
      { property: "og:description", content: "Get help with analyses, reports and your account." },
    ],
  }),
  component: Page,
});

function Page() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setBusy(true);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:rakshitisstillalive@gmail.com?subject=${encodeURIComponent(
      form.subject || "Support request",
    )}&body=${body}`;
    setTimeout(() => {
      setBusy(false);
      toast.success("Opening your email client…");
    }, 600);
  };

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Talk to a human"
        description="Questions about a report, a stubborn diagnosis, billing or your account — we answer all of it."
      />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { i: Mail, t: "Email", v: "rakshitisstillalive@gmail.com", h: "mailto:rakshitisstillalive@gmail.com" },
            { i: Phone, t: "Phone", v: "+91 8178722739", h: "tel:+918178722739" },
            { i: MessageSquare, t: "Response time", v: "Within 24 hours, Mon–Sat" },
          ].map((c) => (
            <div key={c.t} className="surface-card flex gap-4 p-5">
              <c.i className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">{c.t}</p>
                {c.h ? (
                  <a href={c.h} className="text-sm text-muted-foreground hover:text-primary">
                    {c.v}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{c.v}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="surface-card space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-subject">Subject</Label>
            <Input
              id="c-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-msg">Message</Label>
            <Textarea
              id="c-msg"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Send message
          </Button>
        </form>
      </div>
    </>
  );
}
