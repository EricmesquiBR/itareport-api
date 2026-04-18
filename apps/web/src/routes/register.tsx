import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { signUp } from "@/lib/auth-client";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }

    if (!agreedToTerms) {
      setError("Você deve aceitar os termos de uso e a política de privacidade");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      email,
      password,
      name: email.split("@")[0] ?? "",
    });

    setLoading(false);

    if (authError) {
      setError(authError.message ?? "Erro ao criar conta");
      return;
    }

    navigate({ to: "/" });
  };

  return (
    <div className="register">
      <form
        className="flex justify-center items-center pt-36 pb-36 px-4"
        onSubmit={handleSubmit}
      >
        <div className="form-register grid grid-cols-1 md:grid-cols-2 gap-3 p-6 shadow-lg bg-slate-50 rounded-md">
          <h1 className="text-3xl block text-center font-semibold md:col-span-2">
            Criar conta
          </h1>
          <hr className="mt-3 md:col-span-2" />
          {error && (
            <div className="mt-3 md:col-span-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <p className="text-sm text-gray-600 md:col-span-2">
            Seu nome de usuário é gerado automaticamente para proteger sua identidade.
          </p>
          <div className="mt-3 md:col-span-2">
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
              minLength={8}
              autoComplete="new-password"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="confirm" className="block text-base mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirm"
              required
              autoComplete="new-password"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-600"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div className="mt-3 md:col-span-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>Concordo com os termos de uso e a política de privacidade.</span>
            </label>
          </div>
          <div className="mt-5 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
