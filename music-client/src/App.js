import './App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Microfoni from './pages/microfoni';
import Home from './pages';
import Chitarre from './pages/chitarre';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/microfoni" element={<Microfoni />} exact />
        <Route path="/chitarre" element={<Chitarre />} exact />
      </Routes>
    </Router>
  );
}

export default App;
