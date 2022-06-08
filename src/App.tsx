import { useEffect, useState } from "react";
import { data, subscribeToPointUpdates, updateWithPointIncrement } from "./api";
import Leaderboard from "./Leaderboard";
import "./App.css";

function App() {
  const [state, setState] = useState(data);

  useEffect(() => {
    // TODO: if we miss an update we're suddenly out of sync with the api
    const unsubscribe = subscribeToPointUpdates((dataUpdate) => {
      setState((prevState) => {
        return updateWithPointIncrement(prevState, dataUpdate);
      });
    });

    return unsubscribe;
  }, []);

  return (
    <div className="App">
      <Leaderboard streamers={state} />
    </div>
  );
}

export default App;
