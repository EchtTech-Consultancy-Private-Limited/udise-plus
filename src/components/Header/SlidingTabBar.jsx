import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function SlidingTabBar() {
  return (
    <>
      <Tabs defaultActiveKey="Education Dashboard" id="uncontrolled-tab-example">
        <Tab eventKey="Education Dashboard" title="Education Dashboard">
          {/* Tab content for Home */}
        </Tab> 
        <Tab eventKey="School Dashboard" title="School Dashboard">
          {/* Tab content for Profile */}
        </Tab>
        <Tab eventKey="Teacher Dashboard" title="Teacher Dashboard">
          {/* Tab content for Contact  */}
        </Tab>
        <Tab eventKey="Student Dashboard" title="Student Dashboard">
          {/* Tab content for Contact  */}
        </Tab>
        <Tab eventKey="All Reports" title="All Reports">
          {/* Tab content for Contact  */}
        </Tab>
      </Tabs>
    </>
  )
}

