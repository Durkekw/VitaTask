import './App.css'
import Nav from "./Components/Nav/Nav.jsx";
import Main from "./Components/Pages/Main/Main.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Messenger from "./Components/Pages/Messenger/Messenger.jsx";
import {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ScrollToTop from "./utils/scrollToTop.jsx";
import Tasks from "./Components/Pages/Tasks/Tasks.jsx";
import Settings from "./Components/Pages/Settings/Settings.jsx";
import Messages from "./Components/Messages/Messages.jsx";
import TSettings from "./Components/TSettings/TSettings.jsx";
import CreateT from "./Components/TaskCreate/CreateT.jsx";
import Team from "./Components/Pages/Team/Team.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import {loadUser} from "../redux/slices/userSlice.js";
import {useDispatch} from "react-redux";
import TeamCreate from "./Components/Pages/TeamCreate/TeamCreate.jsx";


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

  return (
      <>
          <Router>
              <ScrollToTop/>
              <Nav/>
              <Routes>
                  <Route path="/" element={<Main/>}/>
                  <Route path="/messenger/:userId" element={<Messenger/>}/>
                  <Route path="/tasks/:teamId" element={<Tasks/>}/>
                  <Route path="/settings" element={<Settings/>} />
                  <Route path="/im/:id" element={<Messages/>}/>
                  <Route path="/task-settings" element={<TSettings/>}/>
                  <Route path="/task-change" element={<CreateT/>}/>
                  <Route path="/team/:teamId" element={<Team/>}/>
                  <Route path="/profile/:userId" element={<Profile/>}/>
                  <Route path="/teamcr" element={<TeamCreate/>}/>
              </Routes>
              <Footer/>
          </Router>

      </>
  )
}

export default App
