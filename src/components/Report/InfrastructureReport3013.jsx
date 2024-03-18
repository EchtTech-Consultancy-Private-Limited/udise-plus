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
import groupByKey from "../../utils/groupBy";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import useCheckError from "../hooks/useCheckError";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Infrastructure3013() {
  const [gridApi, setGridApi] = useState();
 
  const [report, setReport] = useState(null);
  const [viewDataBy, setViewDataBy] = useState("");
 
  const grid_column = useSelector((state) => state?.column?.column);
  const [queryParameters] = useSearchParams();
  const school_data = useSelector((state) => state?.school);
  const local_state = window.localStorage.getItem("state");
  const local_district = window.localStorage.getItem("district");
  const local_block = window.localStorage.getItem("block");
  const local_year = window.localStorage.getItem("year");
  const [columnCount, setColumnCount] = useState(20);
  const [hideScrollBtn, setHideScrollBtn] = useState(0);
  const gridApiRef = useRef(null);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const filterObj = structuredClone(schoolFilter);
  const [dispatchCount, setDispatchCount] = useState(1);
  const stateName = localStorage.getItem("state");
  const [arrGroupedData, setArrGroupedData] = useState([]);
  
  const [sch_type, setSchType] = useState("");
  const [sch_cat, setSchCat] = useState("");
  const [sch_mgt, setSchMgt] = useState("");
  const [ur, setUR] = useState("");
 
  const [groupKeys, setGroupKeys] = useState({
    schManagementDesc: true,
    schCategoryDesc: true,
    schTypeDesc: true,
    schLocationDesc: true,
  });
  const [groupsKeys, setGroupsKeys] = useState({
    schManagementDesc: false,
    schCategoryDesc: false,
    schTypeDesc: false,
    schLocationDesc: false,
  });

  const filter_query =
    (filterObj.regionType === 21 && filterObj.regionCode === "11") ||
    (filterObj.regionType === 22 && filterObj.regionCode === "02") ||
    (filterObj.regionType === 23 && filterObj.regionCode === "0202");

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
      showRowGroup: "schLocationDesc",
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "School Category",
      minWidth: 140,
      field: "schCategoryDesc",
      suppressColumnsToolPanel: true,
      showRowGroup: "schCategoryDesc",
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "School Management",
      minWidth: 170,
      field: "schManagementDesc",
      suppressColumnsToolPanel: true,
      showRowGroup: "schManagementDesc",
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "School Type",
      field: "schTypeDesc",
      minWidth: 85,
      showRowGroup: "schTypeDesc",
      cellRenderer: "agGroupCellRenderer",
    },
    {
      headerName: "Total No. of Schools",
      minWidth: 100,
      field: "totSch",
    },
    {
      headerName: "Separate Room for Headmaster",
      minWidth: 130,
      field: "totSchSeprateRoomHm",
    },
    {
      headerName: "Land Available",
      minWidth: 90,
      field: "totSchLandAvail",
    },
    { headerName: "Electricity", minWidth: 95, field: "totSchElectricity" },
    {
      headerName: "Functional Electricity",
      minWidth: 100,
      field: "totSchFuncElectricity",
    },
    { headerName: "Solar Panel", minWidth: 105, field: "totSchSolarPanel" },
    
    { headerName: "Playground", minWidth: 105, field: "totSchPlayground" },
    {
      headerName: "Library or Reading Corner or Book Bank",
      minWidth: 150,
      field: "totSchLibrary",
    },
   
    { headerName: "Librarian", minWidth: 90, field: "totSchLibrarian" },
    {
      headerName: "Newspaper",
      minWidth: 105,
      field: "totSchNewspaper",
    },
    {
      headerName: "Kitchen Garden",
      minWidth: 90,
      field: "totSchKitchenGarden",
    },
    {
      headerName: "Furniture",
      minWidth: 90,
      field: "totSchFurniture",
    },
    { headerName: "Boy's Toilet", minWidth: 100, field: "totSchBoysToilet" },
    { headerName: "Functional Boy's Toilet", field: "totSchFuncBoysToilet" },
    { headerName: "Girl's Toilet", minWidth: 100, field: "totSchGirlsToilet" },
    {
      headerName: "Functional Girl's Toilet",
      minWidth: 110,
      field: "totSchFuncGirlsToilet",
    },
    { headerName: "Toilet Facility", field: "schHaveToilet" },
    { headerName: "Functional Toilet Facility", field: "totSchFuncBoysToilet" },
    { headerName: "Functional Urinal Boy's", field: "totSchFuncBoysUrinal" },
    { headerName: "Functional Urinal", field: "schHaveFuncUrinals" },
    {
      headerName: "Functional Urinal Girl's",
      field: "totSchFuncGirlsUrinal",
    },
    { headerName: "Drinking Water", field: "totSchDrinkingWater" },
    { headerName: "Functional Drinking Water", field: "totSchFuncWaterPurifier" },
    { headerName: "Water Purifier", field: "totSchWaterPurifier" },
    {
      headerName: "Rain Water Harvesting",
      field: "totSchRainWaterHarvesting",
    },
    {
      headerName: "Water Tested",
      field: "totSchWaterTested",
      rowPinned: "bottom",
    },
    {
      headerName: "Handwash",
      field: "totSchHandwashToilet",
      rowPinned: "bottom",
    },
    {
      headerName: "Incinerator",
      field: "totSchIncinerator",
      rowPinned: "bottom",
    },
    {
      headerName: "WASH Facility(Drinking Water, Toilet and Handwash)",
      minWidth: 200,
      field: "totSchHandwashMeals",
      rowPinned: "bottom",
    },
    {
      headerName: "Ramps",
      minWidth: 90,
      field: "totSchRamps",
      rowPinned: "bottom",
    },
    {
      headerName: "Hand-Rails",
      minWidth: 100,
      field: "totSchHandRails",
      rowPinned: "bottom",
    },
    {
      headerName: "Medical Checkup",
      minWidth: 100,
      field: "totSchMedicalCheckup",
      rowPinned: "bottom",
    },
    {
      headerName: "Complete Medical Checkup",
      field: "schHaveCompleteMedicalCheckup",
      rowPinned: "bottom",
    },
    { headerName: "Internet", minWidth: 100, field: "totSchInternet" },
    {
      headerName: "Computer Available",
      minWidth: 100,
      field: "totSchCompAvail",
    },
   
  ]);

  
  const pinedBottomRowData = [
    columns.slice(5).reduce(
      (accumulatedRow, column) => {
        accumulatedRow[column.field] = calculateTotal(column.field);
        return accumulatedRow;
      },
      { schTypeDesc: "Total" }
    ),
  ];

  function calculateTotal(fieldName) {
    if (!school_data?.data?.data) return 0;
    return school_data.data.data.reduce(
      (total, row) => total + parseFloat(row[fieldName] || 0),
      0
    );
  }
  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (viewDataBy === "" && allFalse) {
      schoolLocationRow();
    } else {
      multiGroupingRows();
    }
  }, [school_data]);

  useEffect(() => {
    multiGroupingRows();
  }, [groupKeys]);

  function onColumnVisible(event) {
    const columnId = event?.column?.getColId();
    const visible = event.visible;
    if (columnId === "schManagementDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementDesc: visible,
      }));
    } else if (columnId === "schTypeDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schTypeDesc: visible,
      }));
    } else if (columnId === "schCategoryDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryDesc: visible,
      }));
    } else if (columnId === "schLocationDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schLocationDesc: visible,
      }));
      // setUR(()=>visible?"active":"");
    }
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
      setDispatchCount((prev) => prev + 1);
    }

    // eslint-disable-next-line
  }, [schoolFilterYear]);

  const handleFilter = (value, e) => {
    if (value === "School Management") {
      if (sch_mgt === "active") {
        setSchMgt("");
      } else {
        setSchMgt("active");
      }
    }

    if (value === "School Category") {
      if (sch_cat === "active") {
        setSchCat("");
      } else {
        setSchCat("active");
      }
    }
    if (value === "School Type") {
      if (sch_type === "active") {
        setSchType("");
      } else {
        setSchType("active");
      }
    }

    if (value === "Urban/Rural") {
      if (ur === "active") {
        setUR("");
      } else {
        setUR("active");
      }
    }
  };
  const handleGroupButtonClick = (e, currObj) => {
    handleFilter(e, currObj);
    setViewDataBy((prevViewDataBy) => (prevViewDataBy === e ? "" : e));
   
    const updatedGroupKeys = { ...groupsKeys };
    if (e === "School Management") {
        updatedGroupKeys.schManagementDesc = !groupsKeys.schManagementDesc;
    } else if (e === "School Category") {
        updatedGroupKeys.schCategoryDesc = !groupsKeys.schCategoryDesc;
    } else if (e === "School Type") {
        updatedGroupKeys.schTypeDesc = !groupsKeys.schTypeDesc;
    } else if (e === "Urban/Rural") {
        updatedGroupKeys.schLocationDesc = !groupsKeys.schLocationDesc;
    }

    setGroupsKeys(updatedGroupKeys);

    const groupFields = Object.entries(updatedGroupKeys)
        .filter(([key, value]) => value)
        .map(([key]) => key);

    setCol((prevDefs) =>
        prevDefs.map((colDef) => ({
            ...colDef,
            rowGroup: groupFields.includes(colDef.field),
        }))
    );
};


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
      const { field, headerName } = column.getColDef();
      const sort = column.getSort();
      const headerNameUppercase = field[0].toUpperCase() + field.slice(1);
      const headerCell = {
        text: headerNameUppercase + (sort ? ` (${sort})` : ""),
        headerName: headerName,
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
      textAlign: "center",
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
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    // Initialize jsPDF document
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [60, 60],
    });

    // Function to add header
    const addHeader = () => {
      doc.setFontSize(25);
      doc.setTextColor("blue");
      doc.setFont("bold");
      doc.text("UDISE+", 0.6, 1);
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text(
        "Number of Schools by Availability of Infrastructure and Facilities, School Management and School Category",
        0.6,
        1.4,
        { fontSize: 12, color: "red" }
      );
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text(`Report type : ${stateName}`, 0.6, 1.8, {
        fontSize: 12,
        color: "red",
      });
      doc.setFontSize(25);
      doc.setTextColor("blue");
      doc.setFont("bold");
      doc.text(`Report Id : ${id}`, doc.internal.pageSize.width - 1, 1, {
        align: "right",
      });
      doc.text(
        `Academic Year : ${local_year}`,
        doc.internal.pageSize.width - 1,
        1.8,
        { align: "right" }
      );
      doc.setFontSize(20);
      doc.text(
        `Report generated on : ${formattedDate}`,
        doc.internal.pageSize.width - 1,
        doc.internal.pageSize.height - 0.2,
        { align: "right" }
      );
    };

    // Function to add footer
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 1,
          doc.internal.pageSize.height - 0.5,
          { align: "right" }
        );
      }
    };

    const table = [];
    table.push(headerRow.map((cell) => cell.headerName));
    rows.forEach((row) => {
      table.push(row.map((cell) => cell.text));
    });

    addHeader();

    doc.autoTable({
      head: [table[0]],
      body: table.slice(1),
      startY: 2.2,
      afterPageContent: addFooter,
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 0; i < totalPages; i++) {
      doc.setPage(i + 1);
    }

    return doc;
  };

  const exportToPDF = () => {
    const doc = getDocument(gridApi);
    doc.save(
      "Number of Schools by Availability of Infrastructure and Facilities, School Management and School Category.pdf"
    );
  };

  // const handleGroupButtonClick = (e) => {

  //   const groupObj = { "School Category": "schCategoryDesc", "School Management": "schManagementDesc", "Urban/Rural": "schLocationDesc","School Type":"schTypeDesc" }

  //   const groupByColumn = groupObj[e];
  //   console.log(groupByColumn, "groupByColumn")
  //   setViewDataBy((prevViewDataBy) => (prevViewDataBy === e ? "" : e))
  //   setCol((prevDefs) =>
  //     prevDefs.map((colDef,idx) => ({
  //       ...colDef,
  //       rowGroup: viewDataBy === e ? false : colDef.field === groupByColumn,
  //     }))
  //   );

  // };

  const scrollToRight = () => {
    setHideScrollBtn((hideScrollBtn) => hideScrollBtn + 1);
    columns.map((item, idx) => {
      if (idx + 1 === columnCount) {
        gridApi.columnApi.api.ensureColumnVisible(item.field);
        if (columnCount <= 43) {
          setColumnCount((prevColumnCount) => prevColumnCount + 10);
        }
      }
    });
  };
  const scrollToLeft = () => {
    setHideScrollBtn(20);
    gridApi.columnApi.api.ensureColumnVisible("schLocationDesc");
  };

  const schoolLocationRow = () => {
    const primaryKeys = ["regionName"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;

        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
        });

        const appended = {
          regionName: item,
          totSchElectricity: totalSchoolsHaveElectricity,
        };

        updatedArrGroupedData.push(appended);
      });
      setArrGroupedData(updatedArrGroupedData);
    }

    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("regionName", true);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
  };

  const multiGroupingRows = () => {
    const primaryKeys = Object.keys(groupKeys).filter((key) => groupKeys[key]);
    if (primaryKeys.length > 0) {
      filter_query && primaryKeys.push("regionName");

      const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
      const updatedArrGroupedData = [];

      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData).forEach((item) => {
          const itemsArray = groupedData[item];
          let regionName = "";
          const totals = {
            totSch: 0,
            totSchElectricity: 0,
            totSchSeprateRoomHm: 0,
            totSchLandAvail: 0,
            totSchFuncElectricity: 0,
            totSchSolarPanel: 0,
            totSchPlayground: 0,
            totSchLibrary: 0,
            totSchLibrarian: 0,
            totSchNewspaper: 0,
            totSchKitchenGarden: 0,
            totSchFurniture: 0,
            totSchBoysToilet: 0,
            totSchFuncBoysToilet: 0,
            totSchGirlsToilet: 0,
            totSchFuncGirlsToilet: 0,
            schHaveToilet: 0,
            totSchFuncBoysToilet: 0,
            totSchFuncBoysUrinal: 0,
            schHaveFuncUrinals: 0,
            totSchFuncGirlsUrinal: 0,
            totSchDrinkingWater: 0,
            totSchFuncWaterPurifier: 0,
            totSchWaterPurifier: 0,
            totSchRainWaterHarvesting: 0,
            totSchWaterTested: 0,
            totSchHandwashToilet: 0,
            totSchIncinerator: 0,
            totSchHandwashMeals: 0,
            totSchRamps: 0,
            totSchHandRails: 0,
            totSchMedicalCheckup: 0,
            schHaveCompleteMedicalCheckup: 0,
            totSchInternet: 0,
            totSchCompAvail: 0,
            
          };

          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            for (const field of Object.keys(totals)) {
              if (dataItem.hasOwnProperty(field)) {
                totals[field] += parseInt(dataItem[field]);
              }
            }
          });

          const appended = { regionName };
          primaryKeys.forEach((key, index) => {
            appended[key] = item.split("@")[index];
          });
          Object.assign(appended, totals);
          updatedArrGroupedData.push(appended);
        });

        setArrGroupedData(updatedArrGroupedData);
      }

      gridApi?.columnApi?.api.setColumnVisible(
        "schManagementDesc",
        groupKeys.schManagementDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schCategoryDesc",
        groupKeys.schCategoryDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schTypeDesc",
        groupKeys.schTypeDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schLocationDesc",
        groupKeys.schLocationDesc
      );
      gridApi?.columnApi?.api.setColumnVisible("regionName", filter_query);
    }
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
              {/* <div className="col-md-4 col-lg-4">
                <div className="tab-text-infra mb-1">View Data By</div>
                <Tabs
                  activeKey={viewDataBy}
                  id="uncontrolled-tab-example"
                  onSelect={(e) => handleGroupButtonClick(e)}
                >
                  <Tab eventKey="School Management" title="School Management"></Tab>
                  <Tab eventKey="School Category" title="School Category"></Tab>
                  <Tab eventKey="School Type" title="School Type"></Tab>
                  <Tab eventKey="Urban/Rural" title="Urban / Rural"></Tab>
                </Tabs>
              </div> */}

              <div className="col-md-4 col-lg-4">
                <div className="tab-text-infra mb-1">View Data By</div>

                <ul className="nav nav-tabs mul-tab-main">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link dark-active ${sch_mgt}`}
                      onClick={(e) =>
                        handleGroupButtonClick("School Management", e)
                      }
                    >
                      School Management{" "}
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link dark-active1 ${sch_cat}`}
                      onClick={(e) =>
                        handleGroupButtonClick("School Category", e)
                      }
                    >
                      School Category
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${sch_type}`}
                      onClick={(e) => handleGroupButtonClick("School Type", e)}
                    >
                      School Type
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${ur}`}
                      onClick={(e) => handleGroupButtonClick("Urban/Rural", e)}
                    >
                      Urban / Rural
                    </button>
                  </li>
                </ul>
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
                  {local_district !== "District" && (
                    <>
                      <span>{local_district}</span>
                      <span className="material-icons-round">
                        chevron_right
                      </span>
                    </>
                  )}
                  {local_block !== "Block" && (
                    <>
                      <span>{local_block}</span>
                      <span className="material-icons-round">
                        chevron_right
                      </span>
                    </>
                  )}
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
                        rowData={arrGroupedData ? arrGroupedData : []}
                        columnDefs={columns}
                        defaultColDef={defColumnDefs}
                        onGridReady={onGridReady}
                        sideBar={filterShowHide ? sideBar : false}
                        pagination={true}
                        paginateChildRows={true}
                        pinnedBottomRowData={pinedBottomRowData}
                        groupDisplayType="custom"
                        groupHideOpenParents={true}
                        onColumnVisible={onColumnVisible}
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
