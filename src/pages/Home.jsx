import React from 'react';
import Header from '../components/Header/Header';
import HomeMap from '../components/Home/HomeMap';
import '../components/Home/home.scss'
import EducationDashboard from '../components/Home/EducationDashboard';
import SchoolDashboard from '../components/Home/SchoolDashboard';
import TeacherDashboard from '../components/Home/TeacherDashboard';
import StudentDashboard from '../components/Home/StudentDashboard';

export default function Home() {
  return (
    <>
      <Header />

      <section className="main-card-home ptb-0 bg-grey">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="map-sec-h">
              <HomeMap/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="right-content-box">
              <EducationDashboard/>
              {/* <SchoolDashboard/>
              <TeacherDashboard/>
              <StudentDashboard/> */}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>

  )
}
