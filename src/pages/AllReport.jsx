import React, { useState } from 'react';
import '../components/Report/report.scss'
import FilterDropdown from '../components/Home/FilterDropdown';
import InfrastructureReport from '../components/Report/InfrastructureReport';
import {useSearchParams} from "react-router-dom"
export default function AllReport() {
    const [queryParameters] = useSearchParams();
    
    
    
    return (
        <>       
        <FilterDropdown/>
        <InfrastructureReport id={queryParameters.get('id')} report_name={queryParameters.get('report_name')} type={queryParameters.get('type')}/>
        </>
    )
}

