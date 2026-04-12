"use client";

import { useState } from "react";
import { authenticate } from "@/lib/auth";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticate(password)) {
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#08080A" }}>
      <div className="w-[380px] text-center">
        <div className="mb-2 text-gold text-xs font-sans tracking-[0.3em] uppercase">Аналитика</div>
        <h1 className="font-serif text-3xl text-linen mb-1">Код 1847</h1>
        <div className="w-12 h-px bg-gold mx-auto my-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Пароль"
            className="w-full h-11 rounded border border-stone-dim/30 bg-ink-light px-4 text-sm text-linen placeholder:text-stone-dim focus:outline-none focus:border-gold/50 transition-colors font-sans"
            autoFocus
          />
          {error && <p className="text-sm text-red-400">Неверный пароль</p>}
          <button
            type="submit"
            className="w-full h-11 rounded bg-gold text-ink text-sm font-sans font-medium tracking-wide hover:bg-gold-dim transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
