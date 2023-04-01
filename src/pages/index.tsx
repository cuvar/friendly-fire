import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Counter from "~/comp/Counter";
import LogoutScreen from "~/comp/LogoutScreen";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.counter.getStates.useQuery({ text: "from tRPC" });
  const { data: sessionData } = useSession();

  const { data } = useSession();

  const statesQuery = api.counter.getStates.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  if (!data?.user) {
    return <LogoutScreen />;
  }

  // todo statesQuery.data == null => error
  console.log(statesQuery.data);

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex justify-end">
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold">The game</h1>
        {statesQuery.data == null ? (
          <div>no data</div>
        ) : (
          statesQuery.data.map((e) => <Counter data={e} />)
        )}
      </main>
    </div>
  );
};

export default Home;
