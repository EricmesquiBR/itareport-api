import { createFileRoute } from "@tanstack/react-router";
import { SHA256 } from "crypto-js";
import { useState, type FormEvent } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { api } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");
  const [password, setPassword] = useState("");
  const [surPassword, setSurPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email");
      return;
    }

    if (password !== surPassword) {
      alert("Passwords do not match");
      return;
    }

    const hashedPassword = SHA256(password).toString();

    api
      .post("/users", { name, cpf, email, password: hashedPassword })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.message);
          return;
        }
        alert("User registered successfully");
      })
      .catch(() => {
        alert("Error while registering user");
      });

    setName("");
    setEmail("");
    setCPF("");
    setPassword("");
    setSurPassword("");
  };

  return (
    <>
      <div className="register">
        <Header />
        <form className="flex justify-center items-center pt-36 pb-36" onSubmit={handleSubmit}>
          <div className="htmlForm-register grid grid-cols-2 gap-3 p-6 shadow-lg bg-slate-50 rounded-md">
            <h1 className="text-3xl block text-center font-semibold col-span-2">Sign Up</h1>
            <hr className="mt-3 col-span-2" />
            <div className="mt-3 col-span-2">
              <label htmlFor="name" className="block text-base mb-2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter your full name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="block text-base mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="cpf" className="block text-base mb-2">
                National ID (CPF)
              </label>
              <input
                type="text"
                id="cpf"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter your CPF..."
                value={cpf}
                onChange={(e) => setCPF(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="password" className="block text-base mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="surPassword" className="block text-base mb-2">
                Confirm password
              </label>
              <input
                type="password"
                id="surPassword"
                className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
                placeholder="Confirm your password..."
                value={surPassword}
                onChange={(e) => setSurPassword(e.target.value)}
              />
            </div>
            <div className="mt-3 flex justify-between items-center col-span-2">
              <div>
                <input type="checkbox" />
                <label className="ps-1">
                  I agree to the website terms of use and privacy policy.
                </label>
              </div>
            </div>
            <div className="mt-5 col-span-2">
              <button
                type="submit"
                className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold"
              >
                Create account
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
