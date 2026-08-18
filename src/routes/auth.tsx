import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  microsoftProvider,
} from "@/integrations/firebase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Farmer's AI" },
      {
        name: "description",
        content:
          "Sign in or create a Farmer's AI account to save analysis history and revisit past crop and soil reports.",
      },
      { property: "og:title", content: "Sign in — Farmer's AI" },
      { property: "og:description", content: "Access your saved crop and soil analysis history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function errMessage(e: unknown) {
  const code = (e as { code?: string })?.code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password"))
    return "Incorrect email or password.";
  if (code.includes("email-already-in-use")) return "That email already has an account.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("popup-closed")) return "Sign-in window was closed.";
  if (code.includes("operation-not-allowed")) return "That sign-in method is disabled in Firebase.";
  return e instanceof Error ? e.message : "Something went wrong.";
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const target = redirect && redirect.startsWith("/") ? redirect : "/dashboard";

  useEffect(() => {
    if (!loading && user) void navigate({ to: target });
  }, [loading, user, navigate, target]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) { toast.error("Enter a valid email address."); return; }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back.");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setBusy(false);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) { toast.error("Enter a valid email address."); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      toast.success("Account created.");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setBusy(false);
  };

  const oauth = async (provider: "google" | "microsoft") => {
    setBusy(true);
    try {
      await signInWithPopup(auth, provider === "google" ? googleProvider : microsoftProvider);
    } catch (err) {
      toast.error(errMessage(err));
    }
    setBusy(false);
  };

  const reset = async () => {
    if (!emailOk(email)) { toast.error("Enter your email first, then tap reset."); return; }
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth`,
      });
      toast.success("Password reset link sent.");
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <div className="gradient-soft flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-14">
      <div className="w-full max-w-md">
        <div className="surface-card p-7">
          <div className="flex flex-col items-center text-center">
            <LogoMark className="size-12" />
            <h1 className="mt-4 text-2xl font-bold">Welcome to Farmer&apos;s AI</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Analysis is always free — sign in to save your reports.
            </p>
          </div>

          {!isFirebaseConfigured ? (
            <p className="mt-5 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
              Firebase isn&apos;t configured yet. Add your Firebase web config in{" "}
              <code>src/integrations/firebase/config.ts</code> to enable sign-in.
            </p>
          ) : null}

          <div className="mt-6 grid gap-2">
            <Button variant="outline" disabled={busy} onClick={() => oauth("google")}>
              Continue with Google
            </Button>
            <Button variant="outline" disabled={busy} onClick={() => oauth("microsoft")}>
              Continue with Microsoft
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or use email{" "}
            <span className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="si-email">Email</Label>
                  <Input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="si-pass">Password</Label>
                  <Input
                    id="si-pass"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Sign in
                </Button>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary"
                >
                  Forgot your password?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input
                    id="su-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-pass">Password</Label>
                  <Input
                    id="su-pass"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/legal/terms" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/legal/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
