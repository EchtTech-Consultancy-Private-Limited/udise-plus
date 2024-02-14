import React from 'react';
import { BrowserRouter as Router , Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
       <Routes>
         <Route exact path="/" element={<Home/>} />            
         <Route exact path="*" element={<Home/>} />
         <Route exact path="/Reports" element={<Reports/>} />            
       </Routes>
    </Router>
    
  );
}

export default App;
