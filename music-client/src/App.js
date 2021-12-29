import './App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Microfoni from './pages/microfoni';
import Home from './pages';
import Chitarre from './pages/chitarre';
import Bassi from './pages/bassi';
import Tastiere from './pages/tastiere';
import Batterie from './pages/batterie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/microfoni" element={<Microfoni />} exact />
        <Route path="/chitarre" element={<Chitarre />} exact />
        <Route path="/bassi" element={<Bassi />} exact />
        <Route path="/tastiere" element={<Tastiere />} exact />
        <Route path="/batterie" element={<Batterie />} exact />
      </Routes>
    </Router>
  );
}

export default App;
