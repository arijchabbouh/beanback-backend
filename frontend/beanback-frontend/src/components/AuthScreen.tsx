import { useState } from "react";

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export default function AuthScreen({ onLogin, onRegister }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";

  async function submit() {
    setError("");
    setBusy(true);
    try {
      if (isRegister) {
        await onRegister(name.trim(), email.trim(), password);
      } else {
        await onLogin(email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bb-auth">
      <h1 className="bb-auth-title">Art<span>Walls</span></h1>
      <p className="bb-auth-sub">{isRegister ? "Create your account — you'll start with 100 coins." : "Welcome back."}</p>

      {isRegister && (
        <div className="bb-field">
          <label className="bb-label" htmlFor="a-name">Name</label>
          <input id="a-name" className="bb-input" value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
      )}

      <div className="bb-field">
        <label className="bb-label" htmlFor="a-email">Email</label>
        <input id="a-email" className="bb-input" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>

      <div className="bb-field">
        <label className="bb-label" htmlFor="a-pass">Password</label>
        <input id="a-pass" className="bb-input" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
      </div>

      {error && <p className="bb-error bb-auth-error">{error}</p>}

      <button className="bb-btn bb-auth-btn" onClick={submit} disabled={busy}>
        {busy ? "Please wait…" : isRegister ? "Create account" : "Log in"}
      </button>

      <p className="bb-auth-switch">
        {isRegister ? "Already have an account?" : "New here?"}{" "}
        <button type="button" onClick={() => { setMode(isRegister ? "login" : "register"); setError(""); }}>
          {isRegister ? "Log in" : "Create one"}
        </button>
      </p>
    </div>
  );
}