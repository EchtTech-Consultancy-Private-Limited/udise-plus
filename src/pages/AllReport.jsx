import React, { useState } from 'react';
import '../components/Report/report.scss'
import FilterDropdown from '../components/Home/FilterDropdown';
import InfrastructureReport from '../components/Report/InfrastructureReport';

export default function AllReport() {
    return (
        <>          
        <FilterDropdown/>
        <InfrastructureReport/>
        </>
    )
}

