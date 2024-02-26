import React, { useEffect } from 'react';

import { HashRouter } from "react-router-dom";
import { routes } from './routes/index'
import Header from './components/Header/Header';
import { useSelector } from 'react-redux';

function App() {
    
  const toggleDarkMode =   useSelector(state=>state.toggle.toggleDarkLight);
useEffect(()=>{
  if(toggleDarkMode){
    document.getElementById("root").classList.add(toggleDarkMode ? 'dark-mode' :'text');
  }else{
    document.getElementById("root").classList.remove('dark-mode');
  }
},[toggleDarkMode]);


    return (
          <HashRouter>
              <Header />
            {routes}
          </HashRouter>
    );
}

export default App;
