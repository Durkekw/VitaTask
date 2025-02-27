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



function App() {


  return (
      <>
          <Router>
              <ScrollToTop/>
              <Nav/>
              <Routes>
                  <Route path="/" element={<Main/>}/>
                  <Route path="/messenger" element={<Messenger/>}/>
                  <Route path="/tasks" element={<Tasks/>}/>
                  <Route path="/settings" element={<Settings/>} />
                  <Route path="/im/:id" element={<Messages/>}/>
                  <Route path="/task-settings/:id" element={<TSettings/>}/>
                  <Route path="/task-change" element={<CreateT/>}/>
                  <Route path="/groups" element={<Team/>}/>
                  <Route path="/profile/:id" element={<Profile/>}/>
              </Routes>
              <Footer/>
          </Router>

      </>
  )
}

export default App
