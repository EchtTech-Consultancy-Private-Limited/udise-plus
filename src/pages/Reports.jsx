import React, { useState } from 'react';
import Header from '../components/Header/Header';
import AllReports from '../components/Report/AllReport';
import FilterDropdown from '../components/Home/FilterDropdown';
import Infrastructure from '../components/Report/Infrastructure';
import '../components/Report/report.scss'

export default function Reports() {
    return (
        <>     
        <Header/>         
        <FilterDropdown/>           
        <Infrastructure/>
        
        </>
    )
}

