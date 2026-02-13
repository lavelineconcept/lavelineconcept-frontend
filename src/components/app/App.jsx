import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";


const HomePage = lazy(() => import("../../pages/homePage/HomePage"));


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
