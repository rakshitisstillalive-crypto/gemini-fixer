import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Prose } from "@/components/site/page";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Farmer's AI" },
      {
        name: "description",
        content:
          "How Farmer's AI handles uploaded sample photos, analysis reports, account data and cookies, and the choices you have over your data.",
      },
      { property: "og:title", content: "Privacy Policy — Farmer's AI" },
      { property: "og:description", content: "How we handle your photos, reports and account data." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description="Last updated: 2 June 2026" />
      <Prose>
        <p>
          This page is maintained by the Farmer&apos;s AI team to explain, in plain terms, what we do
          with the data you give us. It describes current practice and is not an independent
          certification or audit.
        </p>

        <h2>Photos you upload</h2>
        <p>
          Sample photographs are sent to our analysis service, processed for the duration of that
          request, and returned to you as a report. If you are not signed in, the photo and report are
          not stored on our servers after the request completes. If you are signed in and press
          &ldquo;Save to history&rdquo;, the image and report are stored against your account until
          you delete them.
        </p>

        <h2>Account data</h2>
        <p>
          If you create an account we store your email address, an optional display name, and any
          profile photo supplied by your sign-in provider. Passwords are handled by our authentication
          provider and are never visible to us.
        </p>

        <h2>Access controls</h2>
        <p>
          Saved analyses are protected by row-level access rules: each record is readable and deletable
          only by the account that created it.
        </p>

        <h2>Third parties</h2>
        <ul>
          <li>Our cloud backend provides database, authentication and hosting.</li>
          <li>Our AI provider performs the image analysis on our behalf.</li>
          <li>Sign-in providers you choose (for example Google or Microsoft) verify your identity.</li>
        </ul>

        <h2>Your choices</h2>
        <ul>
          <li>Use the app entirely as a guest — no account, no stored data.</li>
          <li>Delete any saved report from your dashboard at any time.</li>
          <li>
            Request deletion of your account and all associated records by emailing{" "}
            <a href="mailto:privacy@farmersai.app" className="text-primary hover:underline">
              privacy@farmersai.app
            </a>
            .
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use only the cookies and local storage required to keep you signed in and to remember your
          theme preference. We do not run advertising trackers.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href="mailto:privacy@farmersai.app" className="text-primary hover:underline">
            privacy@farmersai.app
          </a>
          .
        </p>
      </Prose>
    </>
  );
}
