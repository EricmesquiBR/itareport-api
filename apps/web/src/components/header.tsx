import { Link, useNavigate } from "@tanstack/react-router";

import { signOut, useSession } from "@/lib/auth-client";

export default function Header() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    await signOut();
    navigate({ to: "/" });
  };

  const loggedIn = !!session?.user;

  return (
    <header className="flex items-center justify-between bg-gray-900 py-10 px-6">
      <div className="text-white text-3xl font-bold">
        <Link to="/">ItaReport</Link>
      </div>
      <nav className="space-x-5">
        {isPending ? null : !loggedIn ? (
          <>
            <Link to="/login" className="text-white">
              Entrar
            </Link>
            <Link
              to="/register"
              className="text-white rounded-md border border-slate-100 p-2 hover:bg-slate-100 hover:text-gray-900 transition duration-100 ease-in-out"
            >
              Cadastrar
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/report-form"
              className="text-white rounded-md border border-slate-100 p-2 hover:bg-slate-100 hover:text-gray-900 transition duration-100 ease-in-out"
            >
              Reportar
            </Link>
            {session?.user?.username && (
              <Link to="/me" className="text-white">
                {session.user.username}
              </Link>
            )}
            <a href="/" className="text-white" onClick={handleLogout}>
              Sair
            </a>
          </>
        )}
      </nav>
    </header>
  );
}
