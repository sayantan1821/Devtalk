import "./App.css";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/layouts/Landing";
import Navbar from "./components/layouts/Navbar";
import login from "./components/auth/login";
import register from "./components/auth/register";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={login} />
          <Route exact path="/register" component={register} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
