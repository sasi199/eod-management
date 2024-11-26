import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import { Routers } from "./routes";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const url = location.pathname.split("/");
  const panel = url[1];
  useEffect(() => {
    panel === "sidebar" ? (document.title = "Super Admin") : "";
    panel === "trainersidebar" ? (document.title = "Trainer") : "";
    panel === "traineesidebar" ? (document.title = "Student") : "";
  }, []);
  return (
    <>
      <Provider store={store}>
        <Routers />
      </Provider>
    </>
  );
}

export default App;
