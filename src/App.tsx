import { useState } from "react";
import Card from "./components/Card";
import IpAddress from "./components/IpAddress";

function App() {
  return (
    <div className="App flex justify-center h-screen bg-dark">
      <Card>
        <h1 className="text-white">Checking your IP Address... </h1>
        <IpAddress />
      </Card>
    </div>
  );
}

export default App;
