import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import {  lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";
const Home = lazy(() => import('./components/Home'));
const OneItem = lazy(() => import('./components/OneItem'));
function App() {
  
  return (
    <div className="App">
      <Suspense fallback={<div><CircularProgress color="primary" /></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/details/:id" element={<OneItem />} />
      </Routes>
      </Suspense>
    </div>
  );
}

export default App;
