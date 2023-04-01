import { useState } from "react";
import { api } from "~/utils/api";
import { IUserData } from "~/utils/types";

interface IProps {
  data: IUserData;
  removeUser: (user: string) => void;
}

export default function Counter(props: IProps) {
  const [counter, setCounter] = useState(props.data.counter);
  const updateMutation = api.counter.updateCounter.useMutation();

  function decrease() {
    if (counter > 0) {
      updateCounter(counter - 1);
    }
  }

  function increase() {
    updateCounter(counter + 1);
  }

  function updateCounter(newNumber: number) {
    updateMutation.mutate({
      user: props.data.user,
      newCounter: newNumber,
    });
    setCounter(newNumber);
  }

  function remove() {
    props.removeUser(props.data.user);
  }

  const btnClass =
    "rounded-full bg-gray-100 px-4 py-4 text-black hover:bg-gray-300 active:bg-gray-400";

  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );

  const minusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
  const trashIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
  return (
    <div className="flex w-full items-center justify-between space-x-4 text-xl">
      <button onClick={decrease} className={btnClass}>
        {minusIcon}
      </button>
      <div className="flex space-x-4">
        <div>{props.data.user}</div>
        <div>{counter}</div>
      </div>
      <button onClick={increase} className={btnClass}>
        {plusIcon}
      </button>
      {/* <button onClick={remove}>{trashIcon}</button> */}
    </div>
  );
}
