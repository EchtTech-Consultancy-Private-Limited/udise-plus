import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useDispatch } from "react-redux";
import {updateHeaderName} from '../../redux/slice/headerSlice'

export default function SlidingTabBar() {
  const dispatch = useDispatch();
  function handleSelect(e) {
    dispatch(updateHeaderName(e));
  }
  return (
    <>
      <Tabs defaultActiveKey="Education Dashboard" id="uncontrolled-tab-example" onSelect={(e)=>handleSelect(e)}>
        <Tab eventKey="Education Dashboard" title="Education Dashboard">
         
        </Tab> 
        <Tab eventKey="School Dashboard" title="School Dashboard" >
          
        </Tab>
        <Tab eventKey="Teacher Dashboard" title="Teacher Dashboard">
          
        </Tab>
        <Tab eventKey="Student Dashboard" title="Student Dashboard">
          
        </Tab>
        <Tab eventKey="All Reports" title="All Reports">
        </Tab>
      </Tabs>
    
    </>
  )
}

