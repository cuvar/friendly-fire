import { IUserData } from "~/utils/types";

interface IProps {
  data: IUserData;
}

export default function Counter(props: IProps) {
  return (
    <div className="flex space-x-2">
      <button>-</button>
      <div>{props.data.user}</div>
      <div>{props.data.counter}</div>
      <button>+</button>
    </div>
  );
}
