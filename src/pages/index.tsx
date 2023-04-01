import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Counter from "~/comp/Counter";
import LogoutScreen from "~/comp/LogoutScreen";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.counter.getStates.useQuery({ text: "from tRPC" });
  const [selectedUser, setSelectedUser] = useState<string>("luca");

  const { data: sessionData } = useSession();

  const { data } = useSession();

  const statesQuery = api.counter.getStates.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });
  const addUserMutation = api.counter.addUser.useMutation({
    onSuccess: () => {
      statesQuery.refetch();
    },
    onError: () => {
      console.log(false);
    },
  });
  const removeUserMutation = api.counter.removeUser.useMutation({
    onSuccess: () => {
      statesQuery.refetch();
    },
    onError: () => {
      console.log(false);
    },
  });

  if (!data?.user) {
    return <LogoutScreen />;
  }

  // todo statesQuery.data == null => error
  console.log(statesQuery.data);

  function addUser() {
    const res = prompt("username");
    if (typeof res == "string") {
      addUserMutation.mutate({ user: res });
    } else {
      alert("no valid data");
    }
  }

  function removeUser(user: string) {
    removeUserMutation.mutate({ user: user });
  }

  return (
    <div className="flex w-full flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex justify-end">
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
      <main className="flex min-h-screen max-w-4xl flex-col items-center justify-center space-y-8 px-6 text-white">
        <h1 className="text-2xl font-bold md:text-3xl">
          Mit Freundschaft bezahlt
        </h1>
        {statesQuery.data == null ? (
          <div>no data</div>
        ) : (
          <div className="flex w-full flex-col space-y-6">
            {statesQuery.data.map((e) => (
              <Counter
                key={e.user}
                data={e}
                removeUser={(user) => removeUser(user)}
              />
            ))}
          </div>
        )}
        <div className="my-4 flex space-x-2">
          {/* <button onClick={removeUser}>remove user</button> */}
          <button
            onClick={addUser}
            className="rounded-lg border border-white px-4 py-2 hover:bg-white hover:text-black active:border-gray-400 active:bg-gray-400"
          >
            add user
          </button>
          {/* <select onSelect={(e) => onSelect(e)} defaultValue={selectedUser}>
            {statesQuery.data?.map((u) => (
              <option key={u.user} value={u.user}>
                {u.user}
              </option>
            ))}
          </select> */}
        </div>
      </main>
    </div>
  );
};

export default Home;
