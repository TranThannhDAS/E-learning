import { setUsername } from "../redux/slices/exampleSlice.js";
import { useDispatch } from "react-redux";

const ExampleRedux = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Example redux</h1>
      <button
        onClick={() => {
          dispatch(setUsername("John Doe"));
        }}>
        Dispatch
      </button>
    </div>
  );
};

export default ExampleRedux;
