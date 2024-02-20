import React, { useEffect,useCallback, } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import { useSearchParams } from "react-router-dom"
import FilterDropdown from "../Home/FilterDropdown";
import allreportsdata from '../../json-data/allreports.json';


import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Infrastructure3013() {
  const [gridApi, setGridApi] = useState();
  const [report, setReport] = useState(null);

  const rowData = [
    {

            "location": "India",
            "rural_urban": "Urban",
            "school_management": "School mgt.",
            "school_type": "School Type.",
            "no_of_headmaster": 150,
            "land_available": 150,
            "totalSchool": 76090,
            "schHavingFuncElectricity": 75092,
            "schHavingInternet": 31355,
            "schHavingLibrary": 73158,
            "schHavingPlayground": 73158,
            "schHavingRampFacility": 56580,
            "schHavingSolarPanel": 9363,
            "schHavingNewsPaper": 23,
            "schHavingKitchenGarden": 3,
            "schHavingFurniture": 6,
            "schHavingWaterPurifier": 26,
            "schHavingFuncDrinkingWater": 75098,
            "schHavingFuncToilet": 74655,
            "schHavingToiletBoys": 72327,
            "schHavingFuncToiletBoys": 72327,
            "schHavingToiletGirls": 74655,
            "schHavingFuncToiletGirls": 74655,
            "schHavingFuncUrinalToiletBoys": 72327,
            "schHavingFuncUrinalToiletGirls": 72327,
            "schHavingRainWaterHarvesting": 345,
            "schHavingWaterTested": 145,
            "schHavingHandwash": 14,
            "schHavingIncinerator": 514,
            "schHavingWashFacility": 514,
            "schHavingHandRails": 54,
            "schHavingMedicalCheckup": 754,
            "schHavingCompleteMedicalCheckup": 754,
            "schHavingAvailableComputer": 75,
            "school_category": "HSS (I-XII)",
    },
  ];

  const columns = [
    {headerName: "Location", field: "location",},
    {headerName: "Rural/Urban", field: "rural_urban"},
    {headerName: "School Category", field: "school_category"},
    {headerName: "School Management", field: "school_management"},
    {headerName: "School Type", field: "school_type"},
    {headerName: "Total No. of Schools", field: "totalSchool"},
    {headerName: "Separate Room for Headmaster", field: "no_of_headmaster"},
    {headerName: "Land Available", field: "land_available"},
    {headerName: "Electricity", field: "schHavingFuncElectricity"},
    {headerName: "Functional Electricity", field: "schHavingFuncElectricity"},
    {headerName: "Solar Panel", field: "schHavingSolarPanel"},
    {headerName: "Playground", field: "schHavingPlayground"},
    {headerName: "Library or Reading Corner or Book Bank", field: "schHavingLibrary"},
    {headerName: "Librarian", field: "schHavingLibrary"},
    {headerName: "Newspaper", field: "schHavingNewsPaper"},
    {headerName: "Kitchen Garden", field: "schHavingKitchenGarden"},
    {headerName: "Furniture", field: "schHavingFurniture"},
    {headerName: "Boy's Toilet", field: "schHavingToiletBoys"},
    {headerName: "Functional Boy's Toilet", field: "schHavingFuncToiletBoys"},
    {headerName: "Girl's Toilet", field: "schHavingToiletGirls"},
    {headerName: "Functional Girl's Toilet", field: "schHavingFuncToiletGirls"},
    {headerName: "Functional Toilet Facility", field: "schHavingFuncToilet"},
    {headerName: "Functional Urinal Boy's", field: "schHavingFuncUrinalToiletBoys"},
    {headerName: "Functional Urinal Girl's", field: "schHavingFuncUrinalToiletGirls"},
    {headerName: "Functional Drinking Water", field: "schHavingFuncDrinkingWater"},
    {headerName: "Water Purifier", field: "schHavingWaterPurifier"},
    {headerName: "Rain Water Harvesting", field: "schHavingRainWaterHarvesting"},
    {headerName: "Water Tested", field: "schHavingWaterTested"},
    {headerName: "Handwash", field: "schHavingHandwash"},
    {headerName: "Incinerator", field: "schHavingIncinerator"},
    {headerName: "WASH Facility(Drinking Water, Toilet and Handwash)", field: "schHavingWashFacility"},
    {headerName: "Ramps", field: "schHavingRampFacility"},
    {headerName: "Hand-Rails", field: "schHavingHandRails"},
    {headerName: "Medical Checkup", field: "schHavingMedicalCheckup"},
    {headerName: "Complete Medical Checkup", field: "schHavingCompleteMedicalCheckup"},
    {headerName: "Internet", field: "schHavingInternet"},
    {headerName: "Computer Available", field: "schHavingAvailableComputer"},
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

  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }
  ,[]);

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
// Find the report with the given id
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
  const handleHideAndShowFilter = useCallback(()=>{
    setFilterShowHide(filterShowHide=>!filterShowHide)
  }
  ,[]);

  const onBtExport =() => {
    gridApi.api.exportDataAsExcel()
  }
  const getHeaderToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
  
    return columns.map((column) => {
      const { field } = column.getColDef();
      const sort = column.getSort();
      const headerNameUppercase =
        field[0].toUpperCase() + field.slice(1);
      const headerCell = {
        text: headerNameUppercase + (sort ? ` (${sort})` : ''),
        bold: true,
        margin: [0, 12, 0, 0],
      };
      return headerCell;
    });
  };
  const getRowsToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
  
    const getCellToExport = (column, node) => ({
      text: gridApi.api.getValue(column, node) ?? '',
    });
  
    const rowsToExport = [];
    gridApi.api.forEachNodeAfterFilterAndSort((node) => {
      const rowToExport = columns.map((column) =>
        getCellToExport(column, node)
      );
      rowsToExport.push(rowToExport);
    });
  
    return rowsToExport;
  };
  /** 
* This function returns a PDF document definition object - the input for pdfMake.
*/
const getDocument = (gridApi) => {
  const columns = gridApi.api.getAllDisplayedColumns();

  const headerRow = getHeaderToExport(gridApi);
  const rows = getRowsToExport(gridApi);
  return {
    pageOrientation: 'landscape', // can also be 'portrait' ||landscape
    content: [
      {
        table: {
          // the number of header rows
          headerRows: 1,

          // the width of each column, can be an array of widths
          // widths: `${100 / columns.length}%`,
          widths: `5%`,

          // all the rows to display, including the header rows
          body: [headerRow, ...rows],

          // Header row is 40px, other rows are 15px
          heights: (rowIndex) => (rowIndex === 0 ? 150 : 150),
          
        },
      },
    ],
    header: 'simple text',
          footer: {
            columns: [
              'Left part',
              { text: 'Right part', alignment: 'right' }
            ]
          },
  };
};

 const exportToPDF = () => {
  const doc = getDocument(gridApi);
  pdfMake.createPdf(doc).open();
};
  return (
    <section className="infrastructure-main-card p-0">
      <div className="bg-grey2 ptb-30">
        <div className="container tab-for-graph">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-6">
              <div className="common-content text-start map-heading-map">
              {report && (
                <div className="common-content text-start map-heading-map">
                  <span>Reports ID: {report.id}</span>
                  <h2 className="heading-sm1 mb-3">{report.report_name}</h2>
                </div>
              )}
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
              <div className="tab-text-infra download-rep" onClick={onBtExport}>
              {/* <div className="tab-text-infra download-rep" onClick={exportToPDF}> */}
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
                      // groupIncludeFooter={true}
                      // groupIncludeTotalFooter={true}
                    />
                  </div>
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
