import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";



const HomePage = lazy(() => import("../../pages/homePage/HomePage"));
const LoginPage = lazy(() => import("../../pages/loginPage/loginPage"));

function App() {
  return (
    
    <Suspense fallback="Loading...">
      <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
      </Routes>
      </Suspense>
    
  );
}

export default App;
