import React from 'react';
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './components/Report/Reports';
import AllReport from './pages/AllReport';
import Header from './components/Header/Header';
function App() {
  return (
    <Router>
        <Header/>
       <Routes>
         <Route exact path="/" element={<Home/>} />            
         <Route exact path="*" element={<Home/>} />         
         <Route exact path="/reports" element={<Reports/>} />            
         <Route exact path="/all-reports" element={<AllReport/>} />            
       </Routes>
    </Router>
    
  );
}

export default App;
