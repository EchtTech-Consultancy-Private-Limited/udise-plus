import React, { useEffect, useCallback, useMemo, useRef } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import { allFilter } from "../../redux/slice/schoolFilterSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import FilterDropdown from "../Home/FilterDropdown";
import allreportsdata from "../../json-data/allreports.json";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import useCheckError from "../hooks/useCheckError";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Infrastructure3013() {
  const [gridApi, setGridApi] = useState();
  const { handleSchoolAPIResopnse } = useCheckError();
  const [report, setReport] = useState(null);
  const [viewDataBy, setViewDataBy] = useState('');
  const location = useLocation();
  const grid_column = useSelector((state) => state?.column?.column);
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
  const schoolFilterYear = useSelector((state) => state?.schoolFilter);
  //const schoolFilterYear = useSelector((state) => state?.testschoolFilter);
  const [filterShowHide, setFilterShowHide] = useState(false);
  const dispatch = useDispatch();
  const school_data = useSelector((state) => state?.school);
  const local_state = window.localStorage.getItem("state");
  const local_district = window.localStorage.getItem("district");
  const local_block = window.localStorage.getItem("block");
  const local_year = window.localStorage.getItem("year");
  const [columnCount, setColumnCount] = useState(20);
  const [hideScrollBtn, setHideScrollBtn] = useState(0);
  const gridApiRef = useRef(null);
  const [totalSum, setTotalSum] = useState(0);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const [dispatchCount, setDispatchCount] = useState(1);
  const stateName = localStorage.getItem("state")
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const [columns, setCol] = useState([
    {
      headerName: "Location",
      field: "regionName",
      suppressColumnsToolPanel: true,


    },
    {
      headerName: "Rural/Urban",
      field: "schLocationDesc",
      suppressColumnsToolPanel: true,
    },
    {
      headerName: "School Category",
      minWidth: 140,
      field: "schCategoryDesc",
      //field: "schCategoryCode",
      suppressColumnsToolPanel: true,
    },
    {
      headerName: "School Management",
      minWidth: 170,
      field: "schManagementDesc",
      //field: "schManagementCode",
      suppressColumnsToolPanel: true,
    },
    {
      headerName: "School Type", field: "schTypeDesc",
      minWidth: 85,
      // valueGetter: function(params) {
      //   const flagValue = params?.data?.schTypeCode;
      //   switch (flagValue) {
      //     case 0:
      //       return "All";
      //     case 1:
      //       return "Boys";
      //     case 2:
      //       return "Girls";
      //     case 3:
      //     return "Co-Ed";
      //     default:
      //       return "";
      //   }
      // },

    },
    {
      headerName: "Total No. of Schools", minWidth: 100, field: "totalSchools", aggFunc: 'sum'

    },
    {
      headerName: "Separate Room for Headmaster",
      minWidth: 130,
      field: "schHaveSeparateRoomForHM", aggFunc: 'sum'
    },
    { headerName: "Land Available", minWidth: 90, field: "schHaveLandForExpansion", aggFunc: 'sum' },
    { headerName: "Electricity", minWidth: 95, field: "schHaveElectricity", aggFunc: 'sum' },
    { headerName: "Functional Electricity", minWidth: 100, field: "schHaveFuncElectricity", aggFunc: 'sum' },
    { headerName: "Solar Panel", minWidth: 105, field: "schHaveSolarPanels", aggFunc: 'sum' },
    { headerName: "Playground", minWidth: 105, field: "schHavePlayground", aggFunc: 'sum' },
    {
      headerName: "Library or Reading Corner or Book Bank",
      minWidth: 150,
      field: "schHaveLibrary", aggFunc: 'sum'
    },
    { headerName: "Librarian", minWidth: 90, field: "schHaveLibrarian", aggFunc: 'sum' },
    { headerName: "Newspaper", minWidth: 105, field: "schHaveNewsPaperSubscription", aggFunc: 'sum' },
    { headerName: "Kitchen Garden", minWidth: 90, field: "schHaveKitchenGarden", aggFunc: 'sum' },
    { headerName: "Furniture", minWidth: 90, field: "schHaveFurnitureForStudents", aggFunc: 'sum' },
    { headerName: "Boy's Toilet", minWidth: 100, field: "schHaveBoysToilet", aggFunc: 'sum' },
    { headerName: "Functional Boy's Toilet", field: "schHaveFuncBoysToilet", aggFunc: 'sum' },
    { headerName: "Girl's Toilet", minWidth: 100, field: "schHaveGirlsToilet", aggFunc: 'sum' },
    { headerName: "Functional Girl's Toilet", minWidth: 110, field: "schHaveFuncGirlsToilet", aggFunc: 'sum' },
    { headerName: "Toilet Facility", field: "schHaveToilet", aggFunc: 'sum' },
    { headerName: "Functional Toilet Facility", field: "schHaveFuncToilet", aggFunc: 'sum' },
    { headerName: "Functional Urinal Boy's", field: "schHaveFuncBoysUrinals", aggFunc: 'sum' },
    { headerName: "Functional Urinal", field: "schHaveFuncUrinals", aggFunc: 'sum' },
    {
      headerName: "Functional Urinal Girl's",
      field: "schHaveFuncGirlsUrinals", aggFunc: 'sum'
    },
    { headerName: "Drinking Water", field: "schHaveDrinkWater", aggFunc: 'sum' },
    { headerName: "Functional Drinking Water", field: "schHaveFuncDrinkWater", aggFunc: 'sum' },
    { headerName: "Water Purifier", field: "schHaveWaterPurifier", aggFunc: 'sum' },
    {
      headerName: "Rain Water Harvesting",
      field: "schHaveRainWaterHarvesting", aggFunc: 'sum'
    },
    { headerName: "Water Tested", field: "schHaveTestedWater", aggFunc: 'sum', rowPinned: 'bottom' },
    { headerName: "Handwash", field: "schHaveHandwashWithSoapForToilets", aggFunc: 'sum', rowPinned: 'bottom' },
    { headerName: "Incinerator", field: "schHaveIncineratorInGirlsToilets", aggFunc: 'sum', rowPinned: 'bottom' },
    {
      headerName: "WASH Facility(Drinking Water, Toilet and Handwash)",
      minWidth: 200,
      field: "schHaveHandwashWithSoapBeforeAfterMeal", aggFunc: 'sum', rowPinned: 'bottom'
    },
    { headerName: "Ramps", minWidth: 90, field: "schHaveRamps", aggFunc: 'sum', rowPinned: 'bottom' },
    { headerName: "Hand-Rails", minWidth: 100, field: "schHaveHandRails", aggFunc: 'sum', rowPinned: 'bottom' },
    { headerName: "Medical Checkup", minWidth: 100, field: "schHaveMedicalCheckup", aggFunc: 'sum', rowPinned: 'bottom' },
    {
      headerName: "Complete Medical Checkup",
      field: "schHaveCompleteMedicalCheckup", aggFunc: 'sum', rowPinned: 'bottom'
    },
    { headerName: "Internet", minWidth: 100, field: "schHaveInternet" },
    { headerName: "Computer Available", minWidth: 100, field: "schHaveComputers" },
  ]);

  const pinedBottomRowData = [
    {
      schTypeDesc: 'Total',
      schHaveInternet: calculateTotal('schHaveInternet'),
      schHaveFuncGirlsUrinals: calculateTotal('schHaveFuncGirlsUrinals'),
      schHaveComputers: calculateTotal('schHaveComputers'),
      totalSchools: calculateTotal("totalSchools"),
      schHaveSeparateRoomForHM: calculateTotal("schHaveSeparateRoomForHM"),
      schHaveComputers: calculateTotal("schHaveComputers"),
      schHaveCompleteMedicalCheckup: calculateTotal("schHaveCompleteMedicalCheckup"),
      schHaveMedicalCheckup: calculateTotal("schHaveMedicalCheckup"),
      schHaveHandRails: calculateTotal("schHaveHandRails"),
      schHaveRamps: calculateTotal("schHaveRamps"),
      schHaveHandwashWithSoapBeforeAfterMeal: calculateTotal("schHaveHandwashWithSoapBeforeAfterMeal"),
      schHaveIncineratorInGirlsToilets: calculateTotal("schHaveIncineratorInGirlsToilets"),
      schHaveHandwashWithSoapForToilets: calculateTotal("schHaveHandwashWithSoapForToilets"),
      schHaveTestedWater: calculateTotal("schHaveTestedWater"),
      schHaveRainWaterHarvesting: calculateTotal("schHaveRainWaterHarvesting"),
      schHaveWaterPurifier: calculateTotal("schHaveWaterPurifier"),
      schHaveFuncDrinkWater: calculateTotal("schHaveFuncDrinkWater"),
      schHaveDrinkWater: calculateTotal("schHaveDrinkWater"),
      schHaveFuncUrinals: calculateTotal("schHaveFuncUrinals"),
      schHaveFuncUrinals: calculateTotal("schHaveFuncUrinals"),
      schHaveFuncBoysUrinals: calculateTotal("schHaveFuncBoysUrinals"),
      schHaveFuncToilet: calculateTotal("schHaveFuncToilet"),
      schHaveToilet: calculateTotal("schHaveToilet"),
      schHaveFuncGirlsToilet: calculateTotal("schHaveFuncGirlsToilet"),
      schHaveGirlsToilet: calculateTotal("schHaveGirlsToilet"),
      schHaveFuncBoysToilet: calculateTotal("schHaveFuncBoysToilet"),
      schHaveBoysToilet: calculateTotal("schHaveBoysToilet"),
      schHaveFurnitureForStudents: calculateTotal("schHaveFurnitureForStudents"),
      schHaveKitchenGarden: calculateTotal("schHaveKitchenGarden"),
      schHaveNewsPaperSubscription: calculateTotal("schHaveNewsPaperSubscription"),
      schHaveLibrarian: calculateTotal("schHaveLibrarian"),
      schHaveLibrary: calculateTotal("schHaveLibrary"),
      schHavePlayground: calculateTotal("schHavePlayground"),
      schHaveSolarPanels: calculateTotal("schHaveSolarPanels"),
      schHaveFuncElectricity: calculateTotal("schHaveFuncElectricity"),
      schHaveElectricity: calculateTotal("schHaveElectricity"),
      schHaveLandForExpansion: calculateTotal("schHaveLandForExpansion"),
      schHaveSolarPanels: calculateTotal("schHaveSolarPanels"),

    },
  ];


  function calculateTotal(fieldName) {
    if (!school_data?.data?.data) return 0;
    return school_data.data.data.reduce((total, row) => total + parseFloat(row[fieldName] || 0), 0);
  }



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

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          minWidth: 225,
          maxWidth: 225,
          width: 225,
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivotMode: true,
          },
        },
      ],

      position: "right",
      defaultToolPanel: "columns",
    };
  }, []);

  useEffect(() => {
    dispatch(fetchArchiveServicesSchoolData(schoolFilterYear));

    if (dispatchCount === 1) {
      filterObj.regionType = 21;
      filterObj.regionCode = 99;
      dispatch(allFilter(filterObj));
      setDispatchCount(prev => prev + 1);
    }

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
    if (!grid_column) {
      gridApi?.columnApi?.api?.setColumnVisible("regionName", false);
    }
    if (gridApi && gridApi.columnApi) {
      gridApi.columnApi.api.setColumnVisible("regionName", grid_column);
    }
  }, [grid_column, gridApi]);
  const handleHideAndShowFilter = () => {
    setFilterShowHide((filterShowHide) => !filterShowHide);
  };

  const onBtExport = () => {
    gridApi.api.exportDataAsExcel();
  };
  const getHeaderToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();

    return columns.map((column) => {
      const { field,headerName } = column.getColDef();
      const sort = column.getSort();
      const headerNameUppercase = field[0].toUpperCase() + field.slice(1);
      const headerCell = {
        text: headerNameUppercase + (sort ? ` (${sort})` : ""),
        headerName:headerName,
        bold: true,
        margin: [0, 12, 0, 0],
      };
      return headerCell;
    });
  };
  const getRowsToExport = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();

    const getCellToExport = (column, node) => ({
      text: gridApi.api.getValue(column, node) ?? "",
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
  const styles = {
    header: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    paragraph: {
      fontSize: 12,
      marginBottom: 5,
    },
  };

  const getDocument = (gridApi) => {
    const columns = gridApi.api.getAllDisplayedColumns();
    const fontSize = 12 * 0.8;

    const headerRow = getHeaderToExport(gridApi);
    const rows = getRowsToExport(gridApi);

    // Initialize jsPDF document
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [60, 60]
    });
    const totalPagesExp = "{total_pages_count_string}";
const liveTime= `dateTime.toLocaleString('en-US', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true`

    // Function to add header
    const addHeader = () => {
      doc.setFontSize(25);
      doc.setTextColor("blue");
      doc.setFont("bold");
      doc.text("UDISE+", 0.6, 1);
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text("Number of Schools by Availability of Infrastructure and Facilities, School Management and School Category", 0.6, 1.4,{ fontSize: 12, color: "red" });
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text(`Report type : ${stateName}`, 0.6, 1.8,{ fontSize: 12, color: "red" });
      doc.setFontSize(25);
      doc.setTextColor("blue");
      doc.setFont("bold");
      doc.text(`Report Id : ${id}` , doc.internal.pageSize.width - 1, 1,{ align: 'right' });
      doc.text(`Academic Year : ${local_year}` , doc.internal.pageSize.width - 1, 1.8,{ align: 'right' });
     
      doc.text(`Report generated on : ${dateTime}` , doc.internal.pageSize.width - 1, doc.internal.pageSize.height - 0.7, { align: 'right' });
    };
   
    // Function to add footer
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 1, doc.internal.pageSize.height - 0.5, { align: 'right' });
      }
    };

    const table = [];
    table.push(headerRow.map(cell => cell.headerName));
    rows.forEach(row => {
      table.push(row.map(cell => cell.text));
    });

    doc.autoTable({
      head: [table[0]],
      body: table.slice(1),
      startY: 2.2,
      afterPageContent: addFooter
    });

    
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 0; i < totalPages; i++) {
      doc.setPage(i + 1);
     
      addHeader(); 
      doc.autoTable({
        startY: 3.5,
        
      });
    }

    return doc;
};



  const exportToPDF = () => {
    const doc = getDocument(gridApi);
    doc.save("Number of Schools by Availability of Infrastructure and Facilities, School Management and School Category.pdf");
  };


  const handleGroupButtonClick = (e) => {

    const groupObj = { "School Category": "schCategoryDesc", "School Management": "schManagementDesc", "Urban/Rural": "schLocationDesc" }

    const groupByColumn = groupObj[e];
    setViewDataBy((prevViewDataBy) => (prevViewDataBy === e ? "" : e))
    setCol((prevDefs) =>
      prevDefs.map((colDef) => ({
        ...colDef,
        rowGroup: viewDataBy === e ? false : colDef.field === groupByColumn,
      }))
    );

  };

  const scrollToRight = () => {
    setHideScrollBtn(hideScrollBtn => hideScrollBtn + 1);
    columns.map((item, idx) => {
      if ((idx + 1) === columnCount) {
        console.log((idx + 1), '--------', columnCount)
        gridApi.columnApi.api.ensureColumnVisible(item.field);
        if (columnCount <= 43) {
          setColumnCount(prevColumnCount => prevColumnCount + 10);
        }
      }
    })
  };
  const scrollToLeft = () => {
    setHideScrollBtn(20);
    gridApi.columnApi.api.ensureColumnVisible("schLocationDesc");
  };
  return (
    <>
      {school_data.isLoading && <GlobalLoading />}
      <ScrollToTopOnMount />
      <section className="infrastructure-main-card p-0" id="content">
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
                  activeKey={viewDataBy}
                  id="uncontrolled-tab-example"
                  className=""
                  onSelect={(e) => handleGroupButtonClick(e)}
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

              <div className="col-md-12 col-lg-12">
                {/* <div className="tab-text-infra download-rep" onClick={onBtExport}>*/}
                <div
                  className="tab-text-infra download-rep"
                  onClick={exportToPDF}
                >
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
              <div className="col-md-12">
                <h4 className="brudcrumb_heading">
                  Showing Result for : <span>&nbsp;{local_state}</span>
                  <span className="material-icons-round">chevron_right</span>
                  {
                    local_district !== "District" && <>
                      <span>{local_district}</span>
                      <span className="material-icons-round">chevron_right</span>
                    </>
                  }
                  {
                    local_block !== "Block" && <>
                      <span>{local_block}</span>
                      <span className="material-icons-round">chevron_right</span>
                    </>
                  }

                  <span>{local_year}</span>
                </h4>
              </div>
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
                    <div className="col-md-12 d-flex justify-content-end">
                      {/* {hideScrollBtn!==3 && (<button onClick={() => scrollToRight()} className="scroll-right-btn" title="Scroll to Right "><span className="material-icons-round">arrow_right_alt</span> </button>)}
                    {hideScrollBtn==3 && (<button onClick={() => scrollToLeft()} className="scroll-right-btn" title="Scroll to Right "><span className="material-icons-round">west</span> </button>)}
                                     
                   */}
                    </div>
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz"
                      style={{ height: 450 }}
                    >



                      <AgGridReact
                        rowData={
                          school_data?.data?.data === ""
                            ? []
                            : school_data?.data?.data
                        }
                        columnDefs={columns}
                        defaultColDef={defColumnDefs}
                        onGridReady={onGridReady}
                        sideBar={filterShowHide ? sideBar : false}
                        pagination={true}
                        paginateChildRows={true}
                        pinnedBottomRowData={pinedBottomRowData}

                      //groupIncludeFooter={true}

                      // groupIncludeTotalFooter={true}
                      />
                      {/* <button onClick={() => scrollToLeft()}>Scroll to Left</button> */}
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title="Chart"></Tab>
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
