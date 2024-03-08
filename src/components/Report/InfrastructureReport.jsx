import React, { useEffect, useCallback } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import allreportsdata from "../../json-data/allreports.json";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import groupByKey, { nestedGroupByKey } from "../../utils/groupBy";
import { TabPane } from "react-bootstrap";

export default function Infrastructure({ id, report_name, type }) {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const school_data = useSelector((state) => state.school);
  const schoolFilterYear = useSelector((state) => state?.schoolFilter);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const [dispatchCount, setDispatchCount] = useState(1);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();

  useEffect(() => {
    for (const category in allreportsdata) {
      const foundReport = allreportsdata[category].find(
        (report) => report.id === parseInt(id)
      );
      if (foundReport) {
        setReport(foundReport);
        break;
      }
    }
  }, [id]);

  useEffect(() => {
    dispatch(fetchArchiveServicesSchoolData(schoolFilterYear));
    if (dispatchCount === 1) {
      filterObj.regionType = 10;
      filterObj.regionCode = 99;
      dispatch(allFilter(filterObj));
      setDispatchCount((prev) => prev + 1);
    }

    // eslint-disable-next-line
  }, [schoolFilterYear]);

  /*Grouping Data By School Management or Category schCategoryDesc*/
  const primaryKeys = ["regionName"];
  const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
  const arrGroupedData = [];

  let appended;
  if (groupedData && typeof groupedData === "object") {
    Object.keys(groupedData)?.map((item) => {
      const itemsArray = groupedData[item];
      let totalSchoolsHaveElectricity = 0;

      itemsArray.forEach((dataItem) => {
        if (dataItem.schCategoryCode === "1") {
          totalSchoolsHaveElectricity = totalSchoolsHaveElectricity + parseInt(dataItem.schHaveElectricity);
        }
      });
      appended = {
        regionName: item,
        schHaveElectricity: totalSchoolsHaveElectricity,
      };
      arrGroupedData.push(appended);
    });
  }
  /*end here*/

  const [columns, setCol] = useState([
    {
      headerName: "Location",
      field: "regionName",
    },
    {
      headerName: "Total Schools with having Electricity",
      field: "schHaveElectricity",
    },
  ]);

  const [defColumnDefs] = useState({
    flex: 1,
    minWidth: 150,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
  });
  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }, []);
  const handleFilter = (e) => {

    const parentLi = e.target.closest('.nav-item');
    const parentLi1 = document.querySelectorAll('.nav-item');

    if (e.target.classList.contains('multibtn')) {
        parentLi.classList.remove('multibtn');
        parentLi1.classList.remove('multibtn');
    } else {
        parentLi.classList.add('multibtn');
    }


    const navLinks = document.querySelectorAll('.mul-tab-main .nav-link');

    navLinks.forEach(link => {
        if (link !== e.target && link.classList.contains('active')) {
            link.classList.remove('active');
        }
    });

    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active');
    } else {
        e.target.classList.remove('active');
    }
};

  return (
    <>
      <ScrollToTopOnMount />
      <section className="infrastructure-main-card p-0" id="content">
        <div className="bg-grey2 ptb-30">
          <div className="container tab-for-graph">
            <div className="row align-items-center">
              <div className="col-md-5 col-lg-5">
                <div className="common-content text-start map-heading-map">
                  {report && (
                    <div className="common-content text-start map-heading-map">
                      <span>Reports ID: {report.id}</span>
                      <h2 className="heading-sm1 mb-3">{report.report_name}</h2>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-7 col-lg-7">
                <div className="tab-text-infra mb-1">View Data By</div>
                <Tabs defaultActiveKey="School Management" id="uncontrolled-tab-example" className="">                  
                    <Tab eventKey="School Management" title="School Management" className="multibtn-active"></Tab>
                    {/* <Tab eventKey="Management datails" title="datails" className="multibtn"></Tab> */}
                    
                    <Tab eventKey="School Category" title="School Category"></Tab>
                    {/* <Tab eventKey="Category datails" title="datails"></Tab> */}

                    <Tab eventKey="School Type" title="School Type"></Tab>
                    <Tab eventKey="Urban/Rural" title="Urban / Rural"></Tab>
                </Tabs>

                {/* <ul class="nav nav-tabs mul-tab-main">

                  <li class="nav-item">
                    <button type="button" class="nav-link"  onClick={handleFilter}>School Management(Broad) </button>
                    <button type="button" class="nav-link details-multi" id="school_mgt_details" onClick={handleFilter}>Datails View</button>
                  </li>
                
                  <li class="nav-item">
                    <button type="button" class="nav-link"  onClick={handleFilter}>School Category(Broad)</button>
                    <button type="button" class="nav-link details-multi"  onClick={handleFilter}>Datails View</button>
                  </li>     
                              
                  <li class="nav-item">
                    <button type="button" class="nav-link"  onClick={handleFilter}>School Type</button>
                  </li>
                  <li class="nav-item">
                    <button type="button" class="nav-link"  onClick={handleFilter}>Urban / Rural</button>
                  </li>
                </ul> */}

              </div>

              {/* Customize Filter Start*/}

              <div className="col-md-2 col-lg-2 text-right pt-1 pe-0">
                {/* <button
                className="header-dropdown-btn customize-btn"
                onClick={() => setShow(!show)}
              >
                <span className="material-icons-round">dashboard</span>{" "}
                Customize
              </button> */}

                <div
                  className={`custmize-filter-column ${show ? "show" : ""}`}
                  id="customize_filter"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="heading-sm heading-sm2">
                      <span className="material-icons-round text-blue me-2">
                        dashboard
                      </span>{" "}
                      Add Column
                    </div>
                    <button
                      className="close-btn"
                      onClick={() => setShow(!show)}
                    >
                      <span className="material-icons-round">close</span>
                    </button>
                  </div>

                  <div className="box-cont-cust">
                    <form action="">
                      <div className="form-group search">
                        <input
                          type="search"
                          className="form-control"
                          placeholder="search..."
                        />
                      </div>

                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Location"
                          name="Location"
                        />
                        <label htmlFor="Location">Location</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Rural_Urban"
                          name="Rural_Urban"
                        />
                        <label htmlFor="Rural_Urban">Rural/Urban</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="School_category"
                          name="School_category"
                        />
                        <label htmlFor="School_category">School Category</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="School_Management"
                          name="School_Management"
                        />
                        <label htmlFor="School_Management">
                          School Management
                        </label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="School_type"
                          name="School_type"
                        />
                        <label htmlFor="School_type">School Type</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Total_school"
                          name="Total_school"
                        />
                        <label htmlFor="Total_school">
                          Total No. Of School
                        </label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Separate_room"
                          name="Separate_room"
                        />
                        <label htmlFor="Separate_room">
                          Separate Room For Headmaster
                        </label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Land_available"
                          name="Land_available"
                        />
                        <label htmlFor="Land_available">Land Available</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Solar_panel"
                          name="Solar_panel"
                        />
                        <label htmlFor="Solar_panel">Solar Panel</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Playground"
                          name="Playground"
                        />
                        <label htmlFor="Playground">Playground</label>
                      </div>
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          className=""
                          id="Library"
                          name="Library"
                        />
                        <label htmlFor="Library">Library</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Customize Filter END*/}

              <div className="col-md-12 col-lg-12 ps-1">
                <div className="tab-text-infra download-rep">
                  Download Report{" "}
                  <span className="material-icons-round">download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-grey ptb-30">
          <div className="container tab-for-graph">
            <div className="row align-items-center report-inner-tab">
              <div className="col-md-12 col-lg-12">
                <Tabs
                  defaultActiveKey={type}
                  id="uncontrolled-tab-example"
                  className=""
                >
                  <Tab eventKey="about" title="About">
                    <div className="about-card mt-4">
                      <h2 className="heading-sm2 mb-2">About Us</h2>
                      <p>
                        This comprehensive report delves into the educational
                        landscape, examining the distribution of schools based
                        on the availability of infrastructure and facilities,
                        school management structures, and categorization by
                        facility offerings. The study meticulously analyzes the
                        diverse spectrum of educational institutions, shedding
                        light on the correlation between the presence of
                        infrastructure, effective management practices, and the
                        categorization of schools based on the facilities they
                        provide.
                      </p>
                      <p>
                        Through a meticulous data-driven approach, the report
                        classifies schools into distinct categories, discerning
                        the variance in facilities and resources offered across
                        different segments of the education sector. By exploring
                        the nexus between school management structures and the
                        quality of infrastructure, the report aims to provide
                        valuable insights into the critical factors that
                        contribute to a conducive learning environment.
                      </p>
                      <p>
                        Stakeholders in education, policymakers, and researchers
                        will find this report instrumental in understanding the
                        nuanced interplay between infrastructure availability,
                        school management strategies, and the diverse array of
                        facilities that contribute to a well-rounded educational
                        experience. The findings within offer a roadmap for
                        informed decision-making, allowing for targeted
                        interventions and improvements in the educational
                        landscape to ensure equitable access to quality
                        education for all.
                      </p>
                    </div>
                  </Tab>
                  <Tab eventKey="table" title="Table">
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz"
                      style={{ height: 450 }}
                    >
                      <AgGridReact
                        rowData={arrGroupedData ? arrGroupedData : []}
                        columnDefs={columns}
                        defaultColDef={defColumnDefs}
                        onGridReady={onGridReady}
                      // pinnedBottomRowData={pinedBottomRowData}
                      />
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title="Chart"></Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
