import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { login } from "@/api/users";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useGlobalContext } from "@/context/store";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId, setToken } = useGlobalContext();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(email, password)
      .then((data) => {
        setUserId(data.user.id);
        setToken(data.token);
        navigate({ to: "/" });
      })
      .catch((error) => {
        alert(error.response?.data?.message ?? "Error while logging in");
      });

    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center pt-48 pb-48">
        <form className="form-login p-6 shadow-lg bg-slate-50 rounded-md" onSubmit={handleSubmit}>
          <h1 className="text-3xl block text-center font-semibold">Login</h1>
          <hr className="mt-3" />
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
          <div className="mt-3 flex justify-between items-center">
            <div>
              <input type="checkbox" />
              <label className="ps-1">Remember me</label>
            </div>
            <div>
              <a href="#" className="text-gray-900 font-semibold">
                Forgot my password
              </a>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-gray-900 bg-gray-900 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-gray-900 font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
