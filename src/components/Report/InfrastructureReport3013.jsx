import React, { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import { useSearchParams } from "react-router-dom"
import FilterDropdown from "../Home/FilterDropdown";


import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Infrastructure3013() {
  const [gridApi, setGridApi] = useState();
  
  const rowData = [
    {
      make: "Toyota",
      model: "Celica",
      price: 35000,
      date: "09-02-2022",
      available: true,
    },
    {
      make: "Ford",
      model: "Mondeo",
      price: 32000,
      date: "11-02-2022",
      available: false,
    },
    {
      make: "Porsche",
      model: "Boxter",
      price: 72000,
      date: "10-02-2022",
      available: true,
    },
    {
      make: "Mers",
      model: "Mers",
      price: 92000,
      date: "12-02-2022",
      available: true,
    },
  ];

  const columns = [
    {headerName: "Location", field: "location",},
    {headerName: "Rural/Urban", field: "rural_urban"},
    {headerName: "School Category", field: "school_category"},
    {headerName: "School Management", field: "school_management"},
    {headerName: "School Type", field: "school_type"},
    {headerName: "Total No. of Schools", field: "no_of_school"},
    {headerName: "Separate Room for Headmaster", field: "no_of_school"},
    {headerName: "Land Available", field: "no_of_school"},
    {headerName: "Electricity", field: "no_of_school"},
    {headerName: "Functional Electricity", field: "no_of_school"},
    {headerName: "Solar Panel", field: "no_of_school"},
    {headerName: "Playground", field: "no_of_school"},
    {headerName: "Library or Reading Corner or Book Bank", field: "no_of_school"},
    {headerName: "Librarian", field: "no_of_school"},
    {headerName: "Newspaper", field: "no_of_school"},
    {headerName: "Kitchen Garden", field: "no_of_school"},
    {headerName: "Furniture", field: "no_of_school"},
    {headerName: "Boy's Toilet", field: "no_of_school"},
    {headerName: "Functional Boy's Toilet", field: "no_of_school"},
    {headerName: "Girl's Toilet", field: "no_of_school"},
    {headerName: "Functional Girl's Toilet", field: "no_of_school"},
    {headerName: "Functional Toilet Facility", field: "no_of_school"},
    {headerName: "Functional Urinal Boy's", field: "no_of_school"},
    {headerName: "Functional Urinal Girl's", field: "no_of_school"},
    {headerName: "Functional Drinking Water", field: "no_of_school"},
    {headerName: "Water Purifier", field: "no_of_school"},
    {headerName: "Rain Water Harvesting", field: "no_of_school"},
    {headerName: "Water Tested", field: "no_of_school"},
    {headerName: "Handwash", field: "no_of_school"},
    {headerName: "Incinerator", field: "no_of_school"},
    {headerName: "WASH Facility(Drinking Water, Toilet and Handwash)", field: "no_of_school"},
    {headerName: "Ramps", field: "no_of_school"},
    {headerName: "Hand-Rails", field: "no_of_school"},
    {headerName: "Medical Checkup", field: "no_of_school"},
    {headerName: "Complete Medical Checkup", field: "no_of_school"},
    {headerName: "Internet", field: "no_of_school"},
    {headerName: "Computer Available", field: "no_of_school"},
  ];

  const defColumnDefs = {
    flex: 1,
    minWidth: 250,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
};



  const onGridReady = (params) => {
    setGridApi(params);
  };


  // const onFirstDataRendered = () => {
  //   // for all rows expanded
  //   // gridApi.api.forEachNode((node) => {
  //   //   node.setExpanded(true);
  //   // });

  //   // for specific row expand
  //   const row2 = gridApi?.api?.getDisplayedRowAtIndex(1);
  //   row2.setExpanded(true);
  //   // gridApi.api.getDisplayedRowAtIndex(0).setExpanded(true);
  // };

  const [queryParameters] = useSearchParams();
  const id = queryParameters.get('id');
  const report_name = queryParameters.get('report_name');
  const type = queryParameters.get('type');
  const schoolFilterYear = useSelector((state) => state.schoolFilter);
  const [show, setShow] = useState(false);
  const [filterShowHide,setFilterShowHide] = useState(false);
  const dispatch = useDispatch();
  const school_data = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchArchiveServicesSchoolData(schoolFilterYear));
    // eslint-disable-next-line
  }, [schoolFilterYear]);

  const handleHideAndShowFilter = ()=>{
    setFilterShowHide(filterShowHide=>!filterShowHide)
  }
  return (
    <section className="infrastructure-main-card p-0">
      <div className="bg-grey2 ptb-30">
        <div className="container tab-for-graph">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6">
              <div className="common-content text-start map-heading-map">
                <span>Reports ID: {id}</span>
                <h2 className="heading-sm1 mb-3">
                  {report_name}
                </h2>
              </div>
            </div>
            <div className="col-md-4 col-lg-4">
              <div className="tab-text-infra mb-1">View Data By</div>
              <Tabs
                defaultActiveKey="School Category"
                id="uncontrolled-tab-example"
                className=""
              >
                <Tab eventKey="School Category" title="School Category"></Tab>
                <Tab
                  eventKey="School Management"
                  title="School Management"
                ></Tab>
                <Tab eventKey="Urban/Rural" title="Urban / Rural"></Tab>
              </Tabs>
            </div>

            {/* Customize Filter Start*/}

            <div className="col-md-2 col-lg-2 text-right pt-1 pe-0">
              <button
                className="header-dropdown-btn customize-btn"
                // onClick={() => setShow(!show)}
                onClick={() => handleHideAndShowFilter()}
              >
                <span className="material-icons-round">dashboard</span>{" "}
                Customize
              </button>

              {/* <div
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
                  <button className="close-btn" onClick={() => setShow(!show)}>
                    <span className="material-icons-round">close</span>
                  </button>
                </div>

                <div className="box-cont-cust scrollable-container">
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
                      <label htmlFor="Total_school">Total No. Of School</label>
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
                        id="electricity"
                        name="electricity"
                      />
                      <label htmlFor="electricity">Electricity</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_electricity"
                        name="functional_electricity"
                      />
                      <label htmlFor="functional_electricity">Functional electricity</label>
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
                        id="library_or_reading_corner"
                        name="library_or_reading_corner"
                      />
                      <label htmlFor="library_or_reading_corner">Library or Reading Corner</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="Librarian"
                        name="Librarian"
                      />
                      <label htmlFor="Librarian">Librarian</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="newspaper"
                        name="newspaper"
                      />
                      <label htmlFor="newspaper">Newspaper</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="kitchen_garden"
                        name="kitchen_garden"
                      />
                      <label htmlFor="kitchen_garden">Kitchen Garden</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="furniture"
                        name="furniture"
                      />
                      <label htmlFor="furniture">Furniture</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="boys_toilet"
                        name="boys_toilet"
                      />
                      <label htmlFor="boys_toilet">Boy's Toilet</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_boys_toilet"
                        name="functional_boys_toilet"
                      />
                      <label htmlFor="functional_boys_toilet">Functional Boy's Toilet</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="girls_toilet"
                        name="girls_toilet"
                      />
                      <label htmlFor="girls_toilet">Girl's Toilet</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_girls_toilet"
                        name="functional_girls_toilet"
                      />
                      <label htmlFor="functional_girls_toilet">Functional Girl's Toilet</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="toilet_facility"
                        name="toilet_facility"
                      />
                      <label htmlFor="toilet_facility">Toilet Facility</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_toilet_facility"
                        name="functional_toilet_facility"
                      />
                      <label htmlFor="functional_toilet_facility">Functional Toilet Facility</label>
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_urinal_boys"
                        name="functional_urinal_boys"
                      />
                      <label htmlFor="functional_urinal_boys">Functional Urinal Boy's</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_urinal_girls"
                        name="functional_urinal_girls"
                      />
                      <label htmlFor="functional_urinal_girls">Functional Urinal Girl's</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_urinal"
                        name="functional_urinal"
                      />
                      <label htmlFor="functional_urinal">Functional Urinal</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_toilet_urinal"
                        name="functional_toilet_urinal"
                      />
                      <label htmlFor="functional_toilet_urinal">Functional Toilet and Urinal</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="drinking_water"
                        name="drinking_water"
                      />
                      <label htmlFor="drinking_water">Drinking Water</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="functional_drinking_water"
                        name="functional_drinking_water"
                      />
                      <label htmlFor="functional_drinking_water">Functional Drinking Water</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="water_purifier"
                        name="water_purifier"
                      />
                      <label htmlFor="water_purifier">Water Purifier</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="rain_water_harvesting"
                        name="rain_water_harvesting"
                      />
                      <label htmlFor="rain_water_harvesting">Rain Water Harvesting</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="water_tested"
                        name="water_tested"
                      />
                      <label htmlFor="water_tested">Water Tested</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="handwash"
                        name="handwash"
                      />
                      <label htmlFor="handwash">Handwash</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="incinerator"
                        name="incinerator"
                      />
                      <label htmlFor="incinerator">Incinerator</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="wash_facility"
                        name="wash_facility"
                      />
                      <label htmlFor="wash_facility">WASH Facility (Drinking Water, Toilet and Handwash)</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="ramps"
                        name="ramps"
                      />
                      <label htmlFor="ramps">Ramps</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="hand_rails"
                        name="hand_rails"
                      />
                      <label htmlFor="hand_rails">Hand-Rails</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="medical_checkup"
                        name="medical_checkup"
                      />
                      <label htmlFor="medical_checkup">Medical Checkup</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="complete_medical_checkup"
                        name="complete_medical_checkup"
                      />
                      <label htmlFor="complete_medical_checkup">Complete Medical Checkup</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="internet"
                        name="internet"
                      />
                      <label htmlFor="internet">Internet</label>
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        className=""
                        id="computer_available"
                        name="computer_available"
                      />
                      <label htmlFor="computer_available">Computer Available</label>
                    </div>

                  </form>
                </div>
              </div> */}
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
                      landscape, examining the distribution of schools based on
                      the availability of infrastructure and facilities, school
                      management structures, and categorization by facility
                      offerings. The study meticulously analyzes the diverse
                      spectrum of educational institutions, shedding light on
                      the correlation between the presence of infrastructure,
                      effective management practices, and the categorization of
                      schools based on the facilities they provide.
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
                      landscape to ensure equitable access to quality education
                      for all.
                    </p>
                  </div>
                </Tab>
                <Tab eventKey="table" title="Table">
                <div className="ag-theme-material ag-theme-custom-height" style={{height:600}}>
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={columns}
                      defaultColDef={defColumnDefs}
                      onGridReady={onGridReady}
                      sideBar={filterShowHide}
                      groupIncludeFooter={true}
                      groupIncludeTotalFooter={true}
                    />
                  </div>

                  {/* <TableContainer className="mt-4">
                    <Table className="table-responsive table-bordered">
                      <TableHead>
                        <TableRow>
                          <TableCell>Location</TableCell>
                          <TableCell>Rural/Urban</TableCell>
                          <TableCell>School Category </TableCell>
                          <TableCell>School Management</TableCell>
                          <TableCell>School Type </TableCell>
                          <TableCell>Total No. of Schools</TableCell>
                          <TableCell>Separate Room <br /> for Headmaster</TableCell>
                          <TableCell>Land Available</TableCell>
                          <TableCell>Electricity </TableCell>
                          <TableCell>Functional <br /> Electricity</TableCell>
                          <TableCell>Solar Panel</TableCell>
                          <TableCell>Playground</TableCell>
                          <TableCell>Library or Reading <br /> Corner or Book Bank</TableCell>
                          <TableCell>Librarian</TableCell>
                          <TableCell>Newspaper</TableCell>
                          <TableCell>Kitchen Garden</TableCell>
                          <TableCell>Furniture</TableCell>
                          <TableCell>Boy's Toilet</TableCell>
                          <TableCell>Functional Boy's <br /> Toilet</TableCell>
                          <TableCell>Girl's Toilet</TableCell>
                          <TableCell>Functional Girl's <br /> Toilet</TableCell>
                          <TableCell>Toilet Facility</TableCell>
                          <TableCell>Functional Toilet <br /> Facility</TableCell>
                          <TableCell>Functional Urinal <br /> Boy's</TableCell>
                          <TableCell>Functional Urinal <br /> Girl's</TableCell>
                          <TableCell>Drinking Water</TableCell>
                          <TableCell>Functional <br /> Drinking Water </TableCell>
                          <TableCell>Water Purifier</TableCell>
                          <TableCell>Rain Water <br /> Harvesting</TableCell>
                          <TableCell>Water Tested</TableCell>
                          <TableCell>Handwash</TableCell>
                          <TableCell>Incinerator</TableCell>
                          <TableCell>WASH Facility(Drinking Water, <br /> Toilet and Handwash)</TableCell>
                          <TableCell>Ramps</TableCell>
                          <TableCell>Hand-Rails</TableCell>
                          <TableCell>Medical <br /> Checkup</TableCell>
                          <TableCell>Complete Medical <br /> Checkup</TableCell>
                          <TableCell>Internet</TableCell>
                          <TableCell>Computer <br /> Available</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>

                      {
                        school_data?.data?.map((item)=>{
                          return (<>
                            <TableRow>

                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>
                                <TableCell>{item.schHavingFuncToiletBoys}</TableCell>

                                </TableRow>

                          </>);
                        })
                      }
                      
                      </TableBody>
                    </Table>
                  </TableContainer> */}
                </Tab>
                <Tab eventKey="graph" title="Chart">

            

                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <FilterDropdown />
    </section>
  );
}
