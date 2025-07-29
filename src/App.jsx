import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename="/slt/test">
      <Layout />
    </BrowserRouter>
  );
}

export default App;
