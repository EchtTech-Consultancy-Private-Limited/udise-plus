import React, { useEffect } from 'react';
import { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './components/Report/Reports';
import AllReport from './pages/AllReport';
import Header from './components/Header/Header';
import SchoolReport from './components/Report/SchoolReport';
import TeacherReport from './components/Report/TeacherReport';
import Infrastructure3013 from './components/Report/InfrastructureReport3013';
import ScreenReader from './pages/ScreenReader';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
        
            <Router>
                <Header />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/reports" element={<Reports />} />
                    <Route exact path="/all-reports" element={<AllReport />} />
                    <Route exact path="/school-reports" element={<SchoolReport />} />
                    <Route exact path="/teacher-reports" element={<TeacherReport />} />
                    <Route exact path="/infrastructure-reports3013" element={<Infrastructure3013 />} />
                    <Route exact path="/screen-reader-access" element={<ScreenReader />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        
    );
}

export default App;
