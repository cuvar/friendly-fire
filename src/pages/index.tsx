import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import LogoutScreen from "~/comp/LogoutScreen";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.counter.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData } = useSession();

  const { data } = useSession();

  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
