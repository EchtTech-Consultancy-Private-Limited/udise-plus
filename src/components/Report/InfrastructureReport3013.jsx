import React, { useEffect,useCallback,useMemo} from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import { useSearchParams } from "react-router-dom"
import FilterDropdown from "../Home/FilterDropdown";
import allreportsdata from '../../json-data/allreports.json';
import {GlobalLoading} from '../GlobalLoading/GlobalLoading';
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
  const grid_column = useSelector(state=>state.column.column);
  const columns = [
    {headerName: "Location", field: "location",suppressColumnsToolPanel: true},
    {headerName: "Rural/Urban", field: "rural_urban",suppressColumnsToolPanel: true},
    {headerName: "School Category", field: "school_category",suppressColumnsToolPanel: true},
    {headerName: "School Management", field: "school_management",suppressColumnsToolPanel: true},
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
    {headerName: "Toilet Facility", field: "schHavingFuncToiletGirls"},
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

  const sideBar = useMemo(() => { 
    return {
          toolPanels: [
              {
                  id: 'columns',
                  labelDefault: 'Columns',
                  labelKey: 'columns',
                  iconKey: 'columns',
                  toolPanel: 'agColumnsToolPanel',
                  minWidth: 225,
                  maxWidth: 225,
                  width: 225,
                  toolPanelParams: {
                    suppressRowGroups: true,
                    suppressValues: true,
                    suppressPivotMode: true,
                  }
              },
              
          ],
          position: 'right',
          defaultToolPanel: 'columns'
      };
  }, []);

  const [queryParameters] = useSearchParams();
  const id = queryParameters.get('id');
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
    if(!grid_column){
      gridApi?.columnApi?.api?.setColumnVisible('location', false);
    }
    if (gridApi && gridApi.columnApi) {
      gridApi.columnApi.api.setColumnVisible('location', grid_column);
    }
  }, [grid_column, gridApi]);
  
  const handleHideAndShowFilter = ()=>{
      setFilterShowHide(filterShowHide=>!filterShowHide)
  };

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
  <>
  {school_data.isLoading && <GlobalLoading/> } 
  
   <section className="infrastructure-main-card p-0" id='content'>
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
                <div className="ag-theme-material ag-theme-custom-height ag-theme-quartz" style={{height:600}}>
                    <AgGridReact
                      rowData={school_data?.data?.data===""?[]:school_data?.data?.data}
                      columnDefs={columns}
                      defaultColDef={defColumnDefs}
                      onGridReady={onGridReady}
                      sideBar={filterShowHide?sideBar:false}
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
  </> 
  
  );
}
