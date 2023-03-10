import { Switch, Route, Redirect } from "react-router-dom";
import Footer from "./Components/footer";
import Navbar from "./Components/Navbar/navbar";
import Error404 from "./Pages/404/404";
import Home from "./Pages/Home/home";
import Login from "./Pages/Login/login";
import Register from "./Pages/Register/register";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import History from "./Pages/History/history";
import How from "./Pages/HowItWorks/how";
import Aboutus from "./Pages/AboutUs/aboutus";

export default function App() {

  const { user } = useContext(AuthContext);

  return (
    // <Router>
    <div className="flex min-h-screen flex-col dark:bg-gray-700 dark:text-white">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/history">
          <History />
        </Route>
        <Route path="/login" >
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/how-to">
          <How />
        </Route>
        <Route path="/about-us">
          <Aboutus />
        </Route>
        <Route path="*">
          <Error404 />
        </Route>
      </Switch>
      <Footer />
    </div>
    // </Router>
  );
}
