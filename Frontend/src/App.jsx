import './App.css'
import Nav from "./Components/Nav/Nav.jsx";
import Main from "./Components/Pages/Main/Main.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Messenger from "./Components/Pages/Messenger/Messenger.jsx";
import {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ScrollToTop from "./Components/utils/scrollToTop.jsx";
import Tasks from "./Components/Pages/Tasks&Proj/Tasks&Proj.jsx";
import Settings from "./Components/Pages/Settings/Settings.jsx";
import Messages from "./Components/Messages/Messages.jsx";
import TSettings from "./Components/TSettings/TSettings.jsx";
import CreateT from "./Components/TaskCreate/CreateT.jsx";



function App() {

    const [isFooterFixed, setIsFooterFixed] = useState(true);

    const adjustFooter = () => {
        const contentHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;

        if (contentHeight > windowHeight) {
            setIsFooterFixed(false);
        } else {
            setIsFooterFixed(true);
        }
    };

    useEffect(() => {
        adjustFooter();
        window.addEventListener('resize', adjustFooter);
        window.addEventListener('scroll', adjustFooter);
        return () => {
            window.removeEventListener('resize', adjustFooter);
            window.removeEventListener('scroll', adjustFooter);
        };
    }, []);

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
              </Routes>
              <Footer active={isFooterFixed} setActive={setIsFooterFixed}/>
          </Router>

      </>
  )
}

export default App
