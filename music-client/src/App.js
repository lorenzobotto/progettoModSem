import './App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Microfoni from './pages/StrumentiMusicali/microfoni';
import Home from './pages';
import Chitarre from './pages/StrumentiMusicali/chitarre';
import Bassi from './pages/StrumentiMusicali/bassi';
import Tastiere from './pages/StrumentiMusicali/tastiere';
import Batterie from './pages/StrumentiMusicali/batterie';
import Bassisti from './pages/Artisti/bassisti';
import Chitarristi from './pages/Artisti/chitarristi';
import Cantanti from './pages/Artisti/cantanti';
import Tastieristi from './pages/Artisti/tastieristi';
import Batteristi from './pages/Artisti/batteristi';
import CaseProdMicrofoni from './pages/CaseProduttrici/microfoni';
import CaseProdBassi from './pages/CaseProduttrici/bassi';
import CaseProdChitarre from './pages/CaseProduttrici/chitarre';
import CaseProdTastiere from './pages/CaseProduttrici/tastiere';
import CaseProdBatterie from './pages/CaseProduttrici/batterie';
import Gruppi from './pages/BandMusicali/gruppi';
import Solisti from './pages/BandMusicali/solisti';
import Search from './pages/Search';

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
        <Route path="/bassisti" element={<Bassisti />} exact />
        <Route path="/chitarristi" element={<Chitarristi />} exact />
        <Route path="/cantanti" element={<Cantanti />} exact />
        <Route path="/tastieristi" element={<Tastieristi />} exact />
        <Route path="/batteristi" element={<Batteristi />} exact />
        <Route path="/caseMicrofoni" element={<CaseProdMicrofoni />} exact />
        <Route path="/caseBassi" element={<CaseProdBassi />} exact />
        <Route path="/caseChitarre" element={<CaseProdChitarre />} exact />
        <Route path="/caseTastiere" element={<CaseProdTastiere />} exact />
        <Route path="/caseBatterie" element={<CaseProdBatterie />} exact />
        <Route path="/band" element={<Gruppi />} exact />
        <Route path="/solisti" element={<Solisti />} exact />
        <Route path="/search" element={<Search />} exact />
      </Routes>
    </Router>
  );
}

export default App;
