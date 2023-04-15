import { useState } from "react";
import Card from "./components/Card";
import IpAddress from "./components/IpAddress";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App flex justify-center bg-dark">
      <Card>
        <h1 className="text-white">Checking your IP Address... </h1>
        <IpAddress />
      </Card>
    </div>
  );
}

export default App;
