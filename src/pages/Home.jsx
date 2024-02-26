import React, { useState } from 'react';
import HomeMap from '../components/Home/HomeMap';
import '../components/Home/home.scss'
import EducationDashboard from '../components/Home/EducationDashboard';
import SchoolDashboard from '../components/Home/SchoolDashboard';
import TeacherDashboard from '../components/Home/TeacherDashboard';
import StudentDashboard from '../components/Home/StudentDashboard';
import FilterDropdown from '../components/Home/FilterDropdown';
import { useSelector } from 'react-redux';
import Reports from '../components/Report/Reports';
import {useTranslation} from "react-i18next";

export default function Home() {
  const header_name = useSelector(state => state.header);

  const [customClass, setCustomClass] = useState("");

  const handleClass = (e) => {
    setCustomClass(e);
  };

  const handleRemoveClass = () => {
    setCustomClass("open_map_sec");
  }

  const { t } = useTranslation();

  return (
    <>

      <section className={`${header_name.headerName!=="All Reports"? header_name.removeBeforeAfterClass:""} ptb-0 bg-grey ${customClass}`} id='content'>
        <div className="container">
          <div className="row">

            {
              header_name.headerName === "All Reports" ? <Reports/> :
                <>
                  <button className="header-dropdown-btn open-map-btn" title="Open Map" onClick={() => handleRemoveClass('close_map_sec')}> {t("open_map_button")}</button>
                  <div className="col-sm-12 col-md-6 col-lg-6 map_hide_on_click_btn">
                    <div className="map-sec-h">
                      <HomeMap handleClass={handleClass} customClass={customClass} />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6 sec_full_width">

                    <div className="right-content-box">
                      {
                        header_name.headerName === "Education Dashboard" ?
                          <EducationDashboard /> :
                          header_name.headerName === "School Dashboard" ?
                            <SchoolDashboard /> :
                            header_name.headerName === "Teacher Dashboard" ?
                              <TeacherDashboard /> :
                              header_name.headerName === "Student Dashboard" ?
                                <StudentDashboard /> : <EducationDashboard />
                      }
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4 mx-auto text-center">
              <FilterDropdown />
            </div>
                </>

            }


           

          </div>
        </div>
      </section>

    </>

  )
}
