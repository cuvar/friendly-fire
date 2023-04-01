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

  return (
    <div className="flex space-x-2">
      <button onClick={decrease}>-</button>
      <div>{props.data.user}</div>
      <div>{counter}</div>
      <button onClick={increase}>+</button>
      <button onClick={remove}>remove</button>
    </div>
  );
}
