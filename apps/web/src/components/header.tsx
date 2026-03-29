import { Link, useNavigate } from "@tanstack/react-router";

import { useGlobalContext } from "@/context/store";

export default function Header() {
  const { userId, logout } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="flex items-center justify-between bg-gray-900 py-10 px-6">
      <div className="text-white text-3xl font-bold">
        <Link to="/">ItaReport</Link>
      </div>
      <nav className="space-x-5">
        {userId === null || userId === "" ? (
          <>
            <Link to="/login" className="text-white">
              Login
            </Link>
            <Link
              to="/register"
              className="text-white rounded-md border border-slate-100 p-2 hover:bg-slate-100 hover:text-gray-900 transition duration-100 ease-in-out"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/report-form"
              className="text-white rounded-md border border-slate-100 p-2 hover:bg-slate-100 hover:text-gray-900 transition duration-100 ease-in-out"
            >
              Report Issue
            </Link>
            <a href="/" className="text-white" onClick={handleLogout}>
              Sign Out
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
