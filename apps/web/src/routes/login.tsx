import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn.email({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message ?? "Credenciais inválidas");
      setPassword("");
      return;
    }

    navigate({ to: "/" });
  };

  return (
    <div className="flex justify-center items-center pt-48 pb-48 px-4">
      <form className="form-login p-6 shadow-lg bg-slate-50 rounded-md" onSubmit={handleSubmit}>
        <h1 className="text-3xl block text-center font-semibold">Entrar</h1>
        <hr className="mt-3" />
        {error && (
          <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <div className="mt-3">
          <label htmlFor="email" className="block text-base mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            autoComplete="email"
            className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="block text-base mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            required
            autoComplete="current-password"
            className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
