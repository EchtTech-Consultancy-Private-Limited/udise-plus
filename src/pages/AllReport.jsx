import React, { useState } from 'react';
import '../components/Report/report.scss'
import Infrastructure from '../components/Report/Infrastructure';
import FilterDropdown from '../components/Home/FilterDropdown';

export default function AllReport() {
    return (
        <>    
       
       <FilterDropdown/>
       <Infrastructure/>
        </>
    )
}

