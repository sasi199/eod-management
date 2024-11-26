import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Routers } from "./routes";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";

function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
