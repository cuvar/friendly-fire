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
          statesQuery.data.map((e) => (
            <Counter
              key={e.user}
              data={e}
              removeUser={(user) => removeUser(user)}
            />
          ))
        )}
        <div className="my-4 flex space-x-2">
          {/* <button onClick={removeUser}>remove user</button> */}
          <button onClick={addUser}>add user</button>
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
