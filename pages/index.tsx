import DefaultLayout from "@/layouts/default";
import { signIn, signOut, useSession } from "next-auth/react";
import Game from "./games";
import { GoogleIcon } from "@/components/icons";
export default function IndexPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute opacity-10 grid grid-cols-3 gap-4 scale-150">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="w-24 h-24 border-4 border-white flex items-center justify-center text-4xl font-bold"
            >
              {i % 2 === 0 ? "X" : "O"}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="z-10 flex flex-col items-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-wider">
            Tic Tac Toe
          </h1>

          <p className="text-gray-300 text-lg">Play. Compete. Win.</p>

          <button
            onClick={() => signIn("google")}
            className="px-8 py-3 bg-white text-black font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-gray-200 transition-all duration-200"
          >
            <div className="flex gap-4 items-center justify-center">
              {GoogleIcon()} Login with Google{" "}
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Game />

        <p>Username : {session.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </section>
    </DefaultLayout>
  );
}
