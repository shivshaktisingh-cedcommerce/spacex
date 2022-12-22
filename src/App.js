
import './App.css';
import Home from './components/Home';
import { Routes, Route, Navigate} from 'react-router-dom';
import OneItem from './components/OneItem';

function App() {
 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<Home/>}/> 
        <Route path="/details/:id" element={<OneItem/>} />
      </Routes>
    </div>
  );
}

export default App;
