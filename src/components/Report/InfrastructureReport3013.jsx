import React, { useEffect, useCallback, useMemo } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData, updateMergeDataToActualData } from "../../redux/thunks/archiveServicesThunk";
import { fetchSchoolCateMgtData } from "../../redux/thunks/schoolCateMgtThunk";
import { useSearchParams } from "react-router-dom";
import FilterDropdown from "../Home/FilterDropdown";
import allreportsdata from "../../json-data/allreports.json";
import { GlobalLoading } from "../GlobalLoading/GlobalLoading";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import useCheckError from "../hooks/useCheckError";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Infrastructure3013() {
  const [gridApi, setGridApi] = useState();
  const {handleSchoolAPIResopnse}=useCheckError();
  const [report, setReport] = useState(null);
  const [viewDataBy,setViewDataBy] = useState('');
  const grid_column = useSelector((state) => state?.column?.column);
  const [queryParameters] = useSearchParams();
  const id = queryParameters.get("id");
  const type = queryParameters.get("type");
   const schoolFilterYear = useSelector((state) => state?.schoolFilter);
   
  //const schoolFilterYear = useSelector((state) => state?.testschoolFilter);
  const [filterShowHide, setFilterShowHide] = useState(false);
  const dispatch = useDispatch();
  const school_data = useSelector((state) => state?.school);
  const [data,setData] = useState(school_data);
  const local_state = window.localStorage.getItem("state");
  const local_district = window.localStorage.getItem("district");
  const local_block = window.localStorage.getItem("block");
  const local_year = window.localStorage.getItem("year");
  const [columnCount,setColumnCount] = useState(20);
  const [hideScrollBtn,setHideScrollBtn] = useState(0);
  const [columns,setCol] = useState([
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
      minWidth:140,
      field: "schCategoryDesc",
       //field: "schCategoryCode",
      suppressColumnsToolPanel: true,
    },
    {
      headerName: "School Management",
      minWidth:170,
      field: "schManagementDesc",
       //field: "schManagementCode",
      suppressColumnsToolPanel: true,
    },
    { 
      headerName: "School Type", field: "schTypeCode" ,
      minWidth:85,
      valueGetter: function(params) {
        const flagValue = params?.data?.schTypeCode;
        switch (flagValue) {
          case 0:
            return "All";
          case 1:
            return "Boys";
          case 2:
            return "Girls";
          case 3:
          return "Co-Ed";
          default:
            return "";
        }
      },
  
  },
    { headerName: "Total No. of Schools",minWidth:100, field: "totalSchools" , aggFunc: 'sum' 
  
  },
    {
      headerName: "Separate Room for Headmaster",
      minWidth:130,
      field: "schHaveSeparateRoomForHM",aggFunc: 'sum'
    },
    { headerName: "Land Available",minWidth:90, field: "schHaveLandForExpansion",aggFunc: 'sum' },
    { headerName: "Electricity",minWidth:95, field: "schHaveElectricity",aggFunc: 'sum' },
    { headerName: "Functional Electricity",minWidth:100, field: "schHaveFuncElectricity",aggFunc: 'sum' },
    { headerName: "Solar Panel",minWidth:105, field: "schHaveSolarPanels",aggFunc: 'sum' },
    { headerName: "Playground",minWidth:105, field: "schHavePlayground",aggFunc: 'sum' },
    {
      headerName: "Library or Reading Corner or Book Bank",
      minWidth:150,
      field: "schHaveLibrary",aggFunc: 'sum'
    },
    { headerName: "Librarian",minWidth:90, field: "schHaveLibrarian",aggFunc: 'sum' },
    { headerName: "Newspaper",minWidth:105, field: "schHaveNewsPaperSubscription",aggFunc: 'sum' },
    { headerName: "Kitchen Garden",minWidth:90, field: "schHaveKitchenGarden",aggFunc: 'sum' },
    { headerName: "Furniture",minWidth:90, field: "schHaveFurnitureForStudents",aggFunc: 'sum' },
    { headerName: "Boy's Toilet",minWidth:100, field: "schHaveBoysToilet",aggFunc: 'sum' },
    { headerName: "Functional Boy's Toilet", field: "schHaveFuncBoysToilet",aggFunc: 'sum' },
    { headerName: "Girl's Toilet",minWidth:100, field: "schHaveGirlsToilet",aggFunc: 'sum' },
    { headerName: "Functional Girl's Toilet",minWidth:110, field: "schHaveFuncGirlsToilet" ,aggFunc: 'sum'},
    { headerName: "Toilet Facility", field: "schHaveToilet" ,aggFunc: 'sum'},
    { headerName: "Functional Toilet Facility", field: "schHaveFuncToilet",aggFunc: 'sum' },
    { headerName: "Functional Urinal Boy's", field: "schHaveFuncBoysUrinals",aggFunc: 'sum' },
    { headerName: "Functional Urinal", field: "schHaveFuncUrinals",aggFunc: 'sum' },
    {
      headerName: "Functional Urinal Girl's",
      field: "schHaveFuncGirlsUrinals",aggFunc: 'sum'
    },
    { headerName: "Drinking Water", field: "schHaveDrinkWater",aggFunc: 'sum' },
    { headerName: "Functional Drinking Water", field: "schHaveFuncDrinkWater",aggFunc: 'sum' },
    { headerName: "Water Purifier", field: "schHaveWaterPurifier",aggFunc: 'sum' },
    {
      headerName: "Rain Water Harvesting",
      field: "schHaveRainWaterHarvesting",aggFunc: 'sum'
    },
    { headerName: "Water Tested", field: "schHaveTestedWater",aggFunc: 'sum',rowPinned: 'bottom'   },
    { headerName: "Handwash", field: "schHaveHandwashWithSoapForToilets" ,aggFunc: 'sum',rowPinned: 'bottom' },
    { headerName: "Incinerator", field: "schHaveIncineratorInGirlsToilets",aggFunc: 'sum',rowPinned: 'bottom'  },
    {
      headerName: "WASH Facility(Drinking Water, Toilet and Handwash)",
      minWidth:200,
      field: "schHaveHandwashWithSoapBeforeAfterMeal",aggFunc: 'sum',rowPinned: 'bottom' 
    },
    { headerName: "Ramps",minWidth:90, field: "schHaveRamps",aggFunc: 'sum',rowPinned: 'bottom'  },
    { headerName: "Hand-Rails",minWidth:100, field: "schHaveHandRails",aggFunc: 'sum',rowPinned: 'bottom'  },
    { headerName: "Medical Checkup",minWidth:100, field: "schHaveMedicalCheckup",aggFunc: 'sum',rowPinned: 'bottom'  },
    {
      headerName: "Complete Medical Checkup",
      field: "schHaveCompleteMedicalCheckup",aggFunc: 'sum',rowPinned: 'bottom' 
    },
    { headerName: "Internet",minWidth:100, field: "schHaveInternet", aggFunc: 'sum',rowPinned: 'top'  },
    { headerName: "Computer Available",minWidth:100, field: "schHaveComputers", aggFunc: 'sum',rowPinned: 'top' },
  ]);

  const pinBottomRowData = [
    { make: 'Total', model: '',rowPinned: 'top', Internet: school_data?.data?.data?.reduce((total, row) => total + row.schHaveInternet, 0) },
    { make: 'Total', model: '', totalSchools: school_data?.data?.data?.reduce((total, row) => total + row.totalSchools, 0) },
    { make: 'Total', model: '', schHaveSeparateRoomForHM: school_data?.data?.data?.reduce((total, row) => total + row.schHaveSeparateRoomForHM, 0) },
    { make: 'Total', model: '', ComputerAvailable: school_data?.data?.data?.reduce((total, row) => total + row.schHaveComputers, 0) },
    { make: 'Total', model: '', CompleteMedicalCheckup: school_data?.data?.data?.reduce((total, row) => total + row.schHaveCompleteMedicalCheckup, 0) },
    { make: 'Total', model: '', MedicalCheckup: school_data?.data?.data?.reduce((total, row) => total + row.schHaveMedicalCheckup, 0) },
    { make: 'Total', model: '', HandRails: school_data?.data?.data?.reduce((total, row) => total + row.schHaveHandRails, 0) },
    { make: 'Total', model: '', Ramps: school_data?.data?.data?.reduce((total, row) => total + row.schHaveRamps, 0) },
    { make: 'Total', model: '', WASHFacility: school_data?.data?.data?.reduce((total, row) => total + row.schHaveHandwashWithSoapBeforeAfterMeal, 0) },
    { make: 'Total', model: '', Incinerator: school_data?.data?.data?.reduce((total, row) => total + row.schHaveIncineratorInGirlsToilets, 0) },
    { make: 'Total', model: '', Handwash: school_data?.data?.data?.reduce((total, row) => total + row.schHaveHandwashWithSoapForToilets, 0) },
    { make: 'Total', model: '', WaterTested: school_data?.data?.data?.reduce((total, row) => total + row.schHaveTestedWater, 0) },
    { make: 'Total', model: '', RainWaterHarvesting: school_data?.data?.data?.reduce((total, row) => total + row.schHaveRainWaterHarvesting, 0) },
    { make: 'Total', model: '', WaterPurifier: school_data?.data?.data?.reduce((total, row) => total + row.schHaveWaterPurifier, 0) },
    { make: 'Total', model: '', FunctionalDrinkingWater: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncDrinkWater, 0) },
    { make: 'Total', model: '', DrinkingWater: school_data?.data?.data?.reduce((total, row) => total + row.schHaveDrinkWater, 0) },
    { make: 'Total', model: '', FunctionalUrinalGirl: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncUrinals, 0) },
    { make: 'Total', model: '', FunctionalUrinal: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncUrinals, 0) },
    { make: 'Total', model: '', FunctionalUrinalBoy: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncBoysUrinals, 0) },
    { make: 'Total', model: '', FunctionalToiletFacility: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncToilet, 0) },
    { make: 'Total', model: '', ToiletFacility: school_data?.data?.data?.reduce((total, row) => total + row.schHaveToilet, 0) },
    { make: 'Total', model: '', FunctionalGirlToilet: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncGirlsToilet, 0) },
    { make: 'Total', model: '', GirlToilet: school_data?.data?.data?.reduce((total, row) => total + row.schHaveGirlsToilet, 0) },
    { make: 'Total', model: '', FunctionalBoyToilet: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncBoysToilet, 0) },
    { make: 'Total', model: '', BoyToilet: school_data?.data?.data?.reduce((total, row) => total + row.schHaveBoysToilet, 0) },
    { make: 'Total', model: '', Furniture: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFurnitureForStudents, 0) },
    { make: 'Total', model: '', KitchenGarden: school_data?.data?.data?.reduce((total, row) => total + row.schHaveKitchenGarden, 0) },
    { make: 'Total', model: '', Newspaper: school_data?.data?.data?.reduce((total, row) => total + row.schHaveNewsPaperSubscription, 0) },
    { make: 'Total', model: '', Librarian: school_data?.data?.data?.reduce((total, row) => total + row.schHaveLibrarian, 0) },
    { make: 'Total', model: '', Library: school_data?.data?.data?.reduce((total, row) => total + row.schHaveLibrary, 0) },
    { make: 'Total', model: '', Playground: school_data?.data?.data?.reduce((total, row) => total + row.schHavePlayground, 0) },
    { make: 'Total', model: '', SolarPanel: school_data?.data?.data?.reduce((total, row) => total + row.schHaveSolarPanels, 0) },
    { make: 'Total', model: '', FunctionalElectricity: school_data?.data?.data?.reduce((total, row) => total + row.schHaveFuncElectricity, 0) },
    { make: 'Total', model: '', Electricity: school_data?.data?.data?.reduce((total, row) => total + row.schHaveElectricity, 0) },
    { make: 'Total', model: '', LandAvailable: school_data?.data?.data?.reduce((total, row) => total + row.schHaveLandForExpansion, 0) },
    { make: 'Total', model: '', SolarPanel: school_data?.data?.data?.reduce((total, row) => total + row.schHaveSolarPanels, 0) },

  ];

  
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
    Promise.all([
      // dispatch(fetchSchoolCateMgtData()),
    ])
    // .then(([schoolCateMgtDataResult, archiveServicesSchoolDataResult]) => {
    //   const school_data_list =  archiveServicesSchoolDataResult?.payload?.data;
      
    //   const school_cat_mgt_list =  schoolCateMgtDataResult?.payload?.data;
    //   if(school_data_list?.length>0){
    //     const mergedData = school_data_list?.map((item)=>{
    //       const match_cate_name = school_cat_mgt_list.find((d) => d.cate_code === item.schCategoryCode);
    //       const match_cate_mgt_name = school_cat_mgt_list.find((d) => d.mgt_code == item.schManagementCode);
    //       if (match_cate_name || match_cate_mgt_name) {
    //         // return { ...item, schCategoryCode: match_cate_name?.broad_category, schManagementCode: match_cate_mgt_name?.management_details };
    //         return { ...item, schCategoryName: match_cate_name?.broad_category, schManagementName: match_cate_mgt_name?.management_details };
    //       }
    //       return item;
    //     });
    //       dispatch(updateMergeDataToActualData(mergedData));
    //   }
    // });
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
      const { field } = column.getColDef();
      const sort = column.getSort();
      const headerNameUppercase = field[0].toUpperCase() + field.slice(1);
      const headerCell = {
        text: headerNameUppercase + (sort ? ` (${sort})` : ""),
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
    // Calculate the width for each column
    const columnWidths = Array(columns.length).fill(`${100 / columns.length}%`);

    const headerRow = getHeaderToExport(gridApi);
    const rows = getRowsToExport(gridApi);

    return {
      pageOrientation: "landscape",
      content: [
        {
          table: {
            headerRows: 1,
            widths: columnWidths, // Set the width for each column

            body: [headerRow, ...rows],
            heights: (rowIndex) => (rowIndex === 0 ? 150 : 150),
          },
        },
      ],
      header: "simple text",
      footer: {
        columns: ["Left part", { text: "Right part", alignment: "right" }],
      },
      styles: {
        // Adjust the font size for the entire document
        defaultStyle: { fontSize: fontSize },
      },
    };
  };

  const exportToPDF = () => {
    const doc = getDocument(gridApi);
    pdfMake.createPdf(doc).open();
  };

  const handleGroupButtonClick = (e) => {

    const groupObj = {"School Category":"schCategoryDesc","School Management":"schManagementDesc","Urban/Rural":"schLocationDesc"}

    const groupByColumn = groupObj[e];
    setViewDataBy((prevViewDataBy) => (prevViewDataBy === e ? "" : e))
    setCol((prevDefs) =>
        prevDefs.map((colDef) => ({
            ...colDef,
            rowGroup: viewDataBy ===e ? false : colDef.field === groupByColumn,
          }))
    );

  };
 
  
 
  const scrollToRight = () => {
    setHideScrollBtn(hideScrollBtn=>hideScrollBtn+1);
    columns.map((item,idx)=>{
        if((idx+1)===columnCount){
          console.log((idx+1),'--------',columnCount)
          gridApi.columnApi.api.ensureColumnVisible(item.field);
          if(columnCount<=43){
            setColumnCount(prevColumnCount=>prevColumnCount+10);
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
      <ScrollToTopOnMount/>
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
               <div className="tab-text-infra download-rep" onClick={onBtExport}>
               {/* <div
                  className="tab-text-infra download-rep"
                  onClick={exportToPDF}
                >  */}
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
                    local_district!=="District" && <>
                    <span>{local_district}</span>
                     <span className="material-icons-round">chevron_right</span> 
                    </>
                  }
                  {
                    local_block!=="Block" && <>
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
                        pinBottomRowData={pinBottomRowData}
                        groupIncludeFooter={true}
                        groupIncludeTotalFooter={true}
                        getRowStyle={(params) => {
                          console.log("ghsgas",params.node)
                          if (params.node.data && params.node.data.rowPinned === 'top') {
                              // Customize background color for pinBottomRowData rows
                              return { backgroundColor: 'lightblue' };
                          }
                          // Return null if you don't want to apply any style to other rows
                          return null;
                      }}
                     
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
