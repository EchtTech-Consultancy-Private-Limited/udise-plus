import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function SlidingTabBar() {
  return (
    <>
      <Tabs defaultActiveKey="Education Dashboard" id="uncontrolled-tab-example">
        <Tab eventKey="Education Dashboard" title="Education Dashboard">
         
        </Tab> 
        <Tab eventKey="School Dashboard" title="School Dashboard">
          
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

