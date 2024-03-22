import React, { useEffect, useCallback } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchiveServicesSchoolData } from "../../redux/thunks/archiveServicesThunk";
import allreportsdata from "../../json-data/allreports.json";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import groupByKey from "../../utils/groupBy";
import Infraicon from "../../assets/images/infra-power.svg";
import { jsPDF } from "jspdf";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);
require('highcharts/modules/treemap')(Highcharts);

export default function Infrastructure({ id, type }) {
  const dispatch = useDispatch();
  const school_data = useSelector((state) => state.school);
  const schoolFilter = useSelector((state) => state.schoolFilter3016);
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  const local_state = window.localStorage.getItem("state_wise");
  const local_district = window.localStorage.getItem("district");
  const local_block = window.localStorage.getItem("block");
  const local_year = window.localStorage.getItem("year");
  const filterObj = structuredClone(schoolFilter);
  const [report, setReport] = useState(null);
  const [gridApi, setGridApi] = useState();
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const stateName = localStorage.getItem("state");
  const [groupKeys, setGroupKeys] = useState({
    schManagementDesc: false,
    schManagementBroad: false,
    schCategoryDesc: false,
    schCategoryBroad: false,
    schTypeDesc: false,
    schLocationDesc: false,
  });
  const [showTransposed, setShowTransposed] = useState(false);
  const [showTransposedMgt, setShowTransposedMgt] = useState(false);
  const [mgt, setMgt] = useState("");
  const [mgt_Details, setMgtDetails] = useState("");
  const [cat, setCat] = useState("");
  const [cat_Details, setCatDetails] = useState("");
  const [sch_type, setSchType] = useState("");
  const [ur, setUR] = useState("");
  const [multiMgt, setMultiMgt] = useState("");
  const [multiCat, setMultiCat] = useState("");
  const [data, setData] = useState([]);
  const [cloneFilterData, setCloneFilterData] = useState([]);
  const [customColumnName, setCustomColumn] = useState("");
  const [pinnedBottomRowDataByRows, setPinnedBottomRowDataByRows] = useState([]);

  (function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
      const series = this,
        chart = series.chart,
        points = series.points,
        {
          animation
        } = series.options,
        {
          startAngleRad
        } = series;

      function fanAnimate(point, startAngleRad) {
        const graphic = point.graphic,
          args = point.shapeArgs;

        if (graphic && args) {

          graphic
            // Set inital animation values
            .attr({
              start: startAngleRad,
              end: startAngleRad,
              opacity: 1
            })
            // Animate to the final position
            .animate({
              start: args.start,
              end: args.end
            }, {
              duration: animation.duration / points.length
            }, function () {
              // On complete, start animating the next point
              if (points[point.index + 1]) {
                fanAnimate(points[point.index + 1], args.end);
              }
              // On the last point, fade in the data labels, then
              // apply the inner size
              if (point.index === series.points.length - 1) {
                series.dataLabelsGroup.animate({
                  opacity: 1
                },
                  void 0,
                  function () {
                    points.forEach(point => {
                      point.opacity = 1;
                    });
                    series.update({
                      enableMouseTracking: true
                    }, false);
                    chart.update({
                      plotOptions: {
                        pie: {
                          innerSize: '40%',
                          borderRadius: 8
                        }
                      }
                    });
                  });
              }
            });
        }
      }

      if (init) {
        // Hide points on init
        points.forEach(point => {
          point.opacity = 0;
        });
      } else {
        fanAnimate(points[0], startAngleRad);
      }
    };
  }(Highcharts));

  const filter_query =
    (filterObj.regionType === 21 && filterObj.regionCode === "11") ||
    (filterObj.regionType === 22 &&
      filterObj.regionCode === distBlockWiseData.districtUdiseCode) ||
    (filterObj.regionType === 23 &&
      filterObj.regionCode === distBlockWiseData.blockUdiseCode);

  const filter_query_by_location =
    local_state === "State Wise" ||
    local_district === "District Wise" ||
    local_block === "Block Wise";

  const [columns, setColumn] = useState([
    {
      headerName: "Location",
      field: "regionName",
      hide: filter_query_by_location,
    },
    {
      headerName: "School Management(Broad)",
      field: "schManagementBroad",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Management(Detailed)",
      field: "schManagementDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Category(Broad)",
      field: "schCategoryBroad",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Category(Detailed)",
      field: "schCategoryDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "School Type",
      field: "schTypeDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "Urban/Rural",
      field: "schLocationDesc",
      suppressColumnsToolPanel: true,
      hide: true,
    },
    {
      headerName: "Total No. of Schools",
      field: "totSch",
    },
    {
      headerName: "No. of Schools having Electricity",
      field: "totSchElectricity",
    },
    {
      headerName: "Functional Electricity",
      field: "totSchFuncElectricity",
    },]);

  const getLastTrueToShowTotal = () => {
    const lastTrueKey = Object.keys(groupKeys).reduce((lastKey, key) => {
      if (groupKeys[key]) {
        return key;
      }
      return lastKey;
    }, null);
    return lastTrueKey;
  };

  function calculateTotal(fieldName) {
    if (!arrGroupedData) return 0;
    return arrGroupedData.reduce(
      (total, row) => total + parseFloat(row[fieldName] || 0),
      0
    );
  }

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
    dispatch(fetchArchiveServicesSchoolData(schoolFilter));
    // eslint-disable-next-line
  }, [schoolFilter]);

  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
    gridApi?.columnApi?.api.setColumnVisible("regionName", filter_query_by_location);
  }, [school_data?.data?.data]);

  useEffect(() => {
    const allFalse = Object.values(groupKeys).every((value) => value === false);
    if (allFalse) {
      schoolLocationRow();
    } else {
      // handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }
  }, [groupKeys]);

  useEffect(() => {
    multiGroupingRows();
    if (showTransposed) {
      switchColumnsToRows(false, true);
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt(false, true);
    }
  }, [data]);

  useEffect(() => {
    if (showTransposed) {
      switchColumnsToRows(false, true);
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt(false, true);
    }
  }, [cloneFilterData, groupKeys])

  useEffect(() => {
    if (showTransposed || showTransposedMgt) {
      const appendedObj = {};
      columns.forEach((item) => {
        if (item.field === customColumnName) {
          appendedObj[item.field] = "Total";
        } else {
          appendedObj[item.field] = calculateTotal(item.field);
        }
      });
      setPinnedBottomRowDataByRows([appendedObj]);
    }
  }, [columns]);


  const [defColumnDefs] = useState({
    flex: 1,
    minWidth: 150,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    filter: true,
  });

  function onColumnVisible(event) {
    const columnId = event.column.getColId();
    const visible = event.visible;
    if (columnId === "schManagementBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementBroad: visible,
      }));
      setMgt(() => (visible ? "active" : ""));
      setMultiMgt(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schManagementDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schManagementDesc: visible,
      }));
      setMgtDetails(() => (visible ? "active" : ""));
      setMultiMgt(() => (visible ? "multibtn" : ""));
    }

    if (columnId === "schCategoryBroad") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryBroad: visible,
      }));
      setCat(() => (visible ? "active" : ""));
      setMultiCat(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schCategoryDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schCategoryDesc: visible,
      }));
      setCatDetails(() => (visible ? "active" : ""));
      setMultiCat(() => (visible ? "multibtn" : ""));
    }
    if (columnId === "schTypeDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schTypeDesc: visible,
      }));
      setSchType(() => (visible ? "active" : ""));
    }
    if (columnId === "schLocationDesc") {
      setGroupKeys((prev) => ({
        ...prev,
        schLocationDesc: visible,
      }));
      setUR(() => (visible ? "active" : ""));
    }
  }

  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }, []);

  const handleCustomKeyInAPIResponse = () => {
    let state_gov_mgt_code = ["1", "2", "3", "6", "89", "90", "91"];
    let gov_aided_mgt_code = ["4", "7"];
    let pvt_uaided_mgt_code = ["5"];
    let ctrl_gov_mgt_code = ["92", "93", "94", "95", "96", "101"];
    let other_mgt_code = ["8", "97", "99", "98", "102"];
    let pr_sch_code = ["1"];
    let upr_pr_code = ["2", "4"];
    let hr_sec_code = ["3", "5", "10", "11"];
    let sec_sch_code = ["6", "7", "8"];
    let pre_pr_sch_code = ["12"];
    const arr = [];
    school_data.data.data.forEach((item, idx) => {
      let appendedObj = { ...item };
      /* broad management key added*/
      if (state_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "State Government";
      } else if (gov_aided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Govt. Aided";
      } else if (pvt_uaided_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Private Unaided";
      } else if (ctrl_gov_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Central Government";
      } else if (other_mgt_code.includes(item.schManagementCode)) {
        appendedObj.schManagementBroad = "Others";
      }
      /* broad category key added*/
      if (pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Primary (PRY)";
      } else if (upr_pr_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Upper Primary (UPR)";
      } else if (hr_sec_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Higher Secondary (HSEC)";
      } else if (sec_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Secondary (SEC)";
      } else if (pre_pr_sch_code.includes(item.schCategoryCode)) {
        appendedObj.schCategoryBroad = "Pre-Primary (PRY)";
      }
      arr.push(appendedObj);
    });
    setData(arr);
  };

  const handleFilter = (value, e) => {
    if (value === "School Management" || value === "Mgt Details") {
      if (value === "School Management") {
        if (mgt === "active") {
          setMgt("");
        } else {
          setMgt("active");
        }
      } else {
        setMgt("");
      }
      if (value === "Mgt Details") {
        if (mgt_Details === "active") {
          setMgtDetails("");
        } else {
          setMgtDetails("active");
        }
      } else {
        setMgtDetails("");
      }
      /*hide and show multi button class for details view*/
      if (value === "School Management") {
        if (mgt === "active") {
          setMultiMgt("");
        } else {
          setMultiMgt("multibtn");
        }
      }
      if (value === "Mgt Details") {
        if (mgt_Details === "active") {
          setMultiMgt("");
        } else {
          setMultiMgt("multibtn");
        }
      }
      /*end here*/
    }
    if (value === "School Category" || value === "Cat Details") {
      if (value === "School Category") {
        if (cat === "active") {
          setCat("");
        } else {
          setCat("active");
        }
      } else {
        setCat("");
      }
      if (value === "Cat Details") {
        if (cat_Details === "active") {
          setCatDetails("");
        } else {
          setCatDetails("active");
        }
      } else {
        setCatDetails("");
      }
      if (value === "School Category") {
        if (cat === "active") {
          setMultiCat("");
        } else {
          setMultiCat("multibtn");
        }
      }
      if (value === "Cat Details") {
        if (cat_Details === "active") {
          setMultiCat("");
        } else {
          setMultiCat("multibtn");
        }
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
    const updatedGroupKeys = { ...groupKeys };
    if (e === "School Management") {
      updatedGroupKeys.schManagementBroad = !groupKeys.schManagementBroad;
      updatedGroupKeys.schManagementDesc = false;
    } else if (e === "Mgt Details") {
      updatedGroupKeys.schManagementDesc = !groupKeys.schManagementDesc;
      updatedGroupKeys.schManagementBroad = false;
    } else if (e === "School Category") {
      updatedGroupKeys.schCategoryBroad = !groupKeys.schCategoryBroad;
      updatedGroupKeys.schCategoryDesc = false;
    } else if (e === "Cat Details") {
      updatedGroupKeys.schCategoryDesc = !groupKeys.schCategoryDesc;
      updatedGroupKeys.schCategoryBroad = false;
    } else if (e === "School Type") {
      updatedGroupKeys.schTypeDesc = !groupKeys.schTypeDesc;
    } else if (e === "Urban/Rural") {
      updatedGroupKeys.schLocationDesc = !groupKeys.schLocationDesc;
    }
    setGroupKeys(updatedGroupKeys);
    const allFalse = Object.values(updatedGroupKeys).every(
      (value) => value === false
    );

    if (allFalse) {
      schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
    }

    if (showTransposed) {
      switchColumnsToRows();
    } else if (showTransposedMgt) {
      switchColumnsToRowsMgt();
    }


  };

  const schoolLocationRow = () => {
    const primaryKeys = ["regionName"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];
    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        let totalFunElectricity = 0;
        let totalSchools = 0;
        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
          totalSchools += parseInt(dataItem.totSch);
          totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
        });
        const appended = {
          regionName: item,
          totSch: totalSchools,
          totSchElectricity: totalSchoolsHaveElectricity,
          totSchFuncElectricity: totalFunElectricity,
        };
        updatedArrGroupedData.push(appended);
      });
      setArrGroupedData(updatedArrGroupedData);
      setCloneFilterData(updatedArrGroupedData);
    }
    gridApi?.columnApi?.api.setColumnVisible("regionName", true);
    gridApi?.columnApi?.api.setColumnVisible("schManagementBroad", false);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryBroad", false);
    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
  };

  const multiGroupingRows = () => {
    const primaryKeys = Object.keys(groupKeys).filter((key) => groupKeys[key]);
    if (primaryKeys.length > 0) {
      filter_query && primaryKeys.push("regionName");
      const groupedData = groupByKey(data, primaryKeys);
      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData).forEach((item) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
          let totalFunElectricity = 0;
          let totalSchools = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
            totalSchools += parseInt(dataItem.totSch);
            totalFunElectricity += parseInt(dataItem.totSchFuncElectricity);
          });
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName;
            appended[key] = item.split("@")[index];
          });
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          appended.totSch = totalSchools;
          appended.totSchFuncElectricity = totalFunElectricity;
          updatedArrGroupedData.push(appended);
        });
        setCloneFilterData(updatedArrGroupedData);
        setArrGroupedData(updatedArrGroupedData);
      }
      gridApi?.columnApi?.api.setColumnVisible(
        "schManagementBroad",
        groupKeys.schManagementBroad
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schManagementDesc",
        groupKeys.schManagementDesc
      );
      gridApi?.columnApi?.api.setColumnVisible(
        "schCategoryBroad",
        groupKeys.schCategoryBroad
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


  /*------------Export data to Excel and PDF-------------*/
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

  const getDocument = (gridApi) => {
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
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [20, 20],
    });
    // Function to add header
    const addHeader = () => {
      doc.setFontSize(25);
      doc.setTextColor("blue");
      doc.setFont("bold");
      doc.text("UDISE+", 0.6, 1);
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text(`${report.report_name}`, 0.6, 1.4, {
        fontSize: 12,
        color: "red",
      });
      doc.setFontSize(20);
      doc.setTextColor("blue");
      doc.text(`Report type : ${stateName}`, 0.6, 1.8, {
        fontSize: 12,
        color: "red",
      });
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
      doc.autoTable({
        startY: 3.5,
      });
    }
    return doc;
  };

  const exportToPDF = () => {
    const doc = getDocument(gridApi);
    doc.save(`${report.report_name}.pdf`);
  };

  const exportToExcel = () => {
    gridApi.api.exportDataAsExcel();
  };

  const handleExportData = (e) => {
    const { value } = e.target;
    if (value === "export_pdf") {
      exportToPDF();
    }
    if (value === "export_excel") {
      exportToExcel();
    }
  };
  /*----------------end here---------------------*/


  /*-----------Transposed rows  and column wise data------------*/
  const countTotalPinnedWithRight = (obj) => {
    let total = 0;
    for (const key in obj) {
      const value = obj[key];
      if (Number.isInteger(value)) {
        total += value;
      }
    }
    return total;
  };
 

  const custom = ()=>{
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();
      let customColumnName = "";
      const primaryKey = Object.keys(groupKeys).filter((key) => groupKeys[key]);
      // filter_query && primaryKey.push("regionName");
      const groupedData = groupByKey(data, primaryKey);
      /*Grouperd data*/
      const updatedArrGroupedData = [];
      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData).forEach((item) => {
          const itemsArray = groupedData[item];
          let totalSchoolsHaveElectricity = 0;
         
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.totSchElectricity);
          });
          const appended = {};
          primaryKey.forEach((key, index) => {
            appended.regionName = regionName;
            appended[key] = item.split("@")[index];
          });
          appended.totSchElectricity = totalSchoolsHaveElectricity;
          updatedArrGroupedData.push(appended);
        });
       console.log(updatedArrGroupedData,'grouperd data')
      }

      /*end groupedData*/

      cloneFilterData.forEach((row) => {
        let location;
        let key;
        
        /*----If school type and Urban/Rural are false-----*/
        if(groupKeys.schTypeDesc===false && groupKeys.schLocationDesc===false){
          if (groupKeys.schManagementBroad) {
            location = row.schManagementBroad;
            customColumnName = "School Management(Broad)";
            setCustomColumn("School Management(Broad)");
          } else if (groupKeys.schManagementDesc) {
            location = row.schManagementDesc;
            customColumnName = "School Management(Detailed)";
            setCustomColumn("School Management(Detailed)");
          } else {
            location = row.regionName;
            customColumnName = "Location";
            setCustomColumn("Location");
          }
        }
      /*end if block here*/        

        /*row wise data for category*/
        if (groupKeys.schCategoryBroad) {
          key = row.schCategoryBroad;
        } else if (groupKeys.schCategoryDesc) {
          key = row.schCategoryDesc;
        }
        /*end here*/
        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }
      });

      const primaryKeys = Object.keys(groupKeys).filter((key) => groupKeys[key] && (key === 'schTypeDesc' || key === 'schLocationDesc'));
      let newArrayCol = primaryKeys.filter(value => value !=='');
      const columnHeaders = [
        customColumnName,
        newArrayCol,
        ...Array.from(uniqueKeys),
        "Total",
      ];

      console.log(columnHeaders.flat(),' column header')
     
    


      /*static grouped data*/

      /*without selecting school type and urban /rural*/
      let counts = {};
      updatedArrGroupedData.forEach(entry => {
        const { schCategoryBroad, schManagementBroad, totSchElectricity } = entry;
        
        // If the management type does not exist in the counts object, create it
        if (!counts[schManagementBroad]) {
            counts[schManagementBroad] = {};
        }
    
        // If the category does not exist in the management type, create it
        if (!counts[schManagementBroad][schCategoryBroad]) {
            counts[schManagementBroad][schCategoryBroad] = 0;
        }
    
        // Increment the total electricity count
        counts[schManagementBroad][schCategoryBroad] += totSchElectricity;
    });
    console.log(counts,' counts')
    /*end here*/

    const newArr = arr.map((item) => {
      return { ...item, Total: countTotalPinnedWithRight(item) };
    });




//when school type urban/rural selected
// updatedArrGroupedData.forEach(entry => {
//       const { schCategoryBroad, totSchElectricity } = entry;
  
//       entry[schCategoryBroad] = totSchElectricity;
//       delete entry.totSchElectricity;
//       delete entry.schCategoryBroad;
//   });
//     console.log(updatedArrGroupedData,' after selecting type or urban/rural')
      /*static grouped data end here*/

  }
  
  
  const switchColumnsToRows = (e,flag=false) => {
    setShowTransposedMgt(false);
    if (flag || !showTransposed) {
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();
      let customColumnName = "";
      custom();
      cloneFilterData.forEach((row) => {
        let location;
        let key;
        if (groupKeys.schManagementBroad) {
          location = row.schManagementBroad;
          customColumnName = "School Management(Broad)";
          setCustomColumn("School Management(Broad)");
        } else if (groupKeys.schManagementDesc) {
          location = row.schManagementDesc;
          customColumnName = "School Management(Detailed)";
          setCustomColumn("School Management(Detailed)");
        } else {
          location = row.regionName;
          customColumnName = "Location";
          setCustomColumn("Location");
        }
        /*row wise data for category*/
        if (groupKeys.schCategoryBroad) {
          key = row.schCategoryBroad;
        } else if (groupKeys.schCategoryDesc) {
          key = row.schCategoryDesc;
        }
        /*end here*/
        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }
        const existingDataIndex = arr.findIndex((data) => data[customColumnName] === location);
        if (existingDataIndex !== -1) {
          arr[existingDataIndex][key] = (arr[existingDataIndex][key] || 0) + parseInt(row.totSchElectricity, 10);
        } else {
          let newData = { [customColumnName]: location, Total: 0 };
          newData[key] = parseInt(row.totSchElectricity, 10);
          arr.push(newData);
        }
      });

      const columnHeaders = [
        customColumnName,
        ...Array.from(uniqueKeys),
        "Total",
      ];
      setColumn(
        columnHeaders.map((header) => ({
          headerName: header,
          field: header?.replace(/\./g, ""),
        }))
      );
      const newArr = arr.map((item) => {
        return { ...item, Total: countTotalPinnedWithRight(item) };
      });
      setArrGroupedData(newArr);
    } else {
      setArrGroupedData(cloneFilterData);
      setColumn([
        {
          headerName: "Location",
          field: "regionName",
          hide: !filter_query,
        },
        {
          headerName: "School Management(Broad)",
          field: "schManagementBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementBroad,
        },
        {
          headerName: "School Management(Detailed)",
          field: "schManagementDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementDesc,
        },
        {
          headerName: "School Category(Broad)",
          field: "schCategoryBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryBroad,
        },
        {
          headerName: "School Category(Detailed)",
          field: "schCategoryDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryDesc,
        },
        {
          headerName: "School Type",
          field: "schTypeDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schTypeDesc,
        },
        {
          headerName: "Urban/Rural",
          field: "schLocationDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schLocationDesc,
        },
        {
          headerName: "Total No. of Schools",
          field: "totSch",
        },
        {
          headerName: "No. of Schools having Electricity",
          field: "totSchElectricity",
        },
        {
          headerName: "Functional Electricity",
          field: "totSchFuncElectricity",
        },
      ]);
    }

    if (!flag) {
      setShowTransposed(!showTransposed);
    }

  };

  const switchColumnsToRowsMgt = (e, flag = false) => {
    setShowTransposed(false);
    if (flag || !showTransposedMgt) {
      const arr = [];
      const uniqueLocation = new Set();
      const uniqueKeys = new Set();
      let customColumnName = "";
      cloneFilterData.forEach((row) => {
        let location;
        let key;
        if (groupKeys.schCategoryBroad) {
          location = row.schCategoryBroad;
          customColumnName = "School Category(Broad)";
          setCustomColumn("School Category(Broad)");
        } else if (groupKeys.schCategoryDesc) {
          location = row.schCategoryDesc;
          customColumnName = "School Category(Detailed)";
          setCustomColumn("School Category(Detailed)");
        } else {
          location = row.regionName;
          customColumnName = "Location";
          setCustomColumn("Location");
        }
        /*row wise data for category*/
        if (groupKeys.schManagementBroad) {
          key = row.schManagementBroad;
        } else if (groupKeys.schManagementDesc) {
          key = row.schManagementDesc;
        }
        /*end here*/
        uniqueLocation.add(location);
        key = key?.replace(/\./g, "");
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
        }
        const existingDataIndex = arr.findIndex(
          (data) => data[customColumnName] === location
        );
        if (existingDataIndex !== -1) {
          arr[existingDataIndex][key] =
            (arr[existingDataIndex][key] || 0) +
            parseInt(row.totSchElectricity, 10);
        } else {
          const newData = { [customColumnName]: location };
          newData[key] = parseInt(row.totSchElectricity, 10);
          arr.push(newData);
        }
      });
      const columnHeaders = [
        customColumnName,
        ...Array.from(uniqueKeys),
        "Total",
      ];
      setColumn(
        columnHeaders.map((header) => ({
          headerName: header,
          field: header?.replace(/\./g, ""),
        }))
      );
      const newArr = arr.map((item) => {
        return { ...item, Total: countTotalPinnedWithRight(item) };
      });
      setArrGroupedData(newArr);
    } else {
      setArrGroupedData(cloneFilterData);
      setColumn([
        {
          headerName: "Location",
          field: "regionName",
          hide: !filter_query,
        },
        {
          headerName: "School Management(Broad)",
          field: "schManagementBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementBroad,
        },
        {
          headerName: "School Management(Detailed)",
          field: "schManagementDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schManagementDesc,
        },
        {
          headerName: "School Category(Broad)",
          field: "schCategoryBroad",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryBroad,
        },
        {
          headerName: "School Category(Detailed)",
          field: "schCategoryDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schCategoryDesc,
        },
        {
          headerName: "School Type",
          field: "schTypeDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schTypeDesc,
        },
        {
          headerName: "Urban/Rural",
          field: "schLocationDesc",
          suppressColumnsToolPanel: true,
          hide: !groupKeys.schLocationDesc,
        },
        {
          headerName: "Total No. of Schools",
          field: "totSch",
        },
        {
          headerName: "No. of Schools having Electricity",
          field: "totSchElectricity",
        },
        {
          headerName: "Functional Electricity",
          field: "totSchFuncElectricity",
        },
      ]);
    }
    if (!flag) {
      setShowTransposedMgt(!showTransposedMgt);
    }
  };
  /*------------------End here------------------*/

  const pinedBottomRowData = [
    {
      ...(getLastTrueToShowTotal()
        ? { [getLastTrueToShowTotal()]: "Total" }
        : { regionName: "Total" }),
      totSch: calculateTotal("totSch"),
      totSchElectricity: calculateTotal("totSchElectricity"),
      totSchFuncElectricity: calculateTotal("totSchFuncElectricity"),
    },
  ];

  return (
    <>
      <ScrollToTopOnMount />
      <section className="infrastructure-main-card p-0" id="content">
        <div className="bg-grey2 pb-4 pt-0 header-bar tab-for-graph">
          <div className="blue-strip">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-10 col-lg-10">
                  <div className="common-content text-start map-heading-map">
                    {report && (
                      <div className="common-content text-start map-heading-map d-flex align-items-center">
                        <span className="me-3">Reports ID: {report.id}</span>
                        <h2 className="heading-sm1 mb-0 mt-0">{report.report_name}</h2>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-2 col-lg-2">
                  <div className="select-infra button-group-filter">

                    <div className="indicator-select">
                      {/* <img src={Dropicon} alt="dropicon" className="dropicon" /> */}
                      <select
                        className="form-select bg-grey2"
                        onChange={handleExportData}
                        defaultValue={""}
                      >
                        <option className="option-hide">
                          Download Report
                        </option>

                        <option value="export_pdf">Download as PDF </option>
                        <option value="export_excel">Download as Excel</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-12 d-flex align-items-center">
                <div className="tab-text-infra me-4">View Data By</div>

                <ul className="nav nav-tabs mul-tab-main">
                  <li className={`nav-item ${multiMgt}`}>
                    <button
                      type="button"
                      className={`nav-link dark-active ${mgt}`}
                      onClick={(e) =>
                        handleGroupButtonClick("School Management", e)
                      }
                    >
                      School Management(Broad){" "}
                    </button>
                    <button
                      type="button"
                      className={`nav-link dark-active details-multi ${mgt_Details}`}
                      id="school_mgt_details"
                      onClick={(e) => handleGroupButtonClick("Mgt Details", e)}
                    >
                      Detailed View
                    </button>
                    <button
                      type="button"
                      className={`nav-link dark-active details-multi`}
                      id="mgt_row_column"
                      onClick={(e) => switchColumnsToRowsMgt()}
                    >
                      By {showTransposedMgt ? 'Column' : 'Rows'}
                    </button>

                  </li>
                  <li className={`nav-item ${multiCat}`}>
                    <button
                      type="button"
                      className={`nav-link dark-active1 ${cat}`}
                      onClick={(e) =>
                        handleGroupButtonClick("School Category", e)
                      }
                    >
                      School Category(Broad)
                    </button>
                    <button
                      type="button"
                      className={`nav-link details-multi dark-active1 ${cat_Details}`}
                      onClick={(e) => handleGroupButtonClick("Cat Details", e)}
                    >
                      Detailed View
                    </button>
                    <button
                      type="button"
                      className={`nav-link dark-active details-multi`}
                      id="cat_row_column"
                      onClick={(e) => switchColumnsToRows()}
                    >
                      By {showTransposed ? "Column" : "Rows"}
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
              {/* <div className="col-md-2 col-lg-2 text-right pt-1 pe-0"> */}
              {/* <button
                className="header-dropdown-btn customize-btn"
                onClick={() => setShow(!show)}
              >
                <span className="material-icons-round">dashboard</span>{" "}
                Customize
              </button> */}
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
              </div> */}
              {/* Customize Filter END*/}


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
              <div className="col-md-12 col-lg-12 table-text-i">
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
                  <Tab
                    eventKey="table"
                    title="Table"
                    className="tabledata-ukkl"
                  >
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz h-300"
                      style={{ height: 450 }}
                    >
                      <AgGridReact
                        rowData={arrGroupedData ? arrGroupedData : []}
                        columnDefs={columns}
                        defaultColDef={defColumnDefs}
                        onGridReady={onGridReady}
                        groupDisplayType="custom"
                        groupHideOpenParents={true}
                        onColumnVisible={onColumnVisible}
                        pinnedBottomRowData={
                          showTransposed || showTransposedMgt
                            ? pinnedBottomRowDataByRows
                            : pinedBottomRowData
                        }
                      />
                      {/* <div className="row">
                        <div className="col-md-3">
                          <h6 className="pinnedData">Total</h6>
                        </div>
                        <div className="col-md-3 text-end">
                          <h6 className="pinnedData">
                            {calculateTotal("totSch")}
                          </h6>
                        </div>
                        <div className="col-md-3 text-end">
                          <h6 className="pinnedData">
                            {calculateTotal("totSchFuncElectricity")}
                          </h6>
                        </div>
                        <div className="col-md-3 text-end">
                          <h6 className="pinnedData">
                            {calculateTotal("totSchElectricity")}
                          </h6>
                        </div>
                      </div> */}
                    </div>
                  </Tab>
                  <Tab eventKey="graph" title="Chart">

                    <div className="card-box-impact tab-for-graph mt-4">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">Top Five States Having School Having Functional Electricty Connection</h2>
                            </div>

                            <Tabs defaultActiveKey="State" id="uncontrolled-tab-example" className="">

                              <Tab eventKey="State" title="State">

                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>KPI</h6>
                                      <h2 className="heading-md">
                                        Functional Electricity
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={
                                        {
                                          chart: {
                                            type: 'packedbubble',
                                            // height: '80%'
                                          },
                                          title: {
                                            text: 'KPI Functional Electricity'
                                          },
                                          subTitle: {
                                            text: 'Coffee consumption'
                                          },
                                          tooltip: {
                                            valueSuffix: '%'
                                          },
                                          credits: {
                                            enabled: false
                                          },
                                          plotOptions: {
                                            packedbubble: {
                                              minSize: 50,
                                              maxSize: 320,
                                              dataLabels: {
                                                enabled: true,
                                                format: '{point.name}',
                                                style: {
                                                  color: 'black',
                                                  textOutline: 'none',
                                                  fontWeight: 'normal'
                                                }
                                              },
                                              minPointSize: 5
                                            }
                                          },
                                          series: [{
                                            showInLegend: false,
                                            name: 'Uttar Pradesh',
                                            color: "#bce263",
                                            data: [{
                                              value: 65,
                                              // name: 'Uttar Pradesh',
                                              name: '65%',
                                              color: "#bce263",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Goa',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              // name: 'Goa',
                                              name: '5%',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Assam',
                                            color: "#e6694a",
                                            data: [{
                                              value: 10,
                                              name: '10%',
                                              // name: 'Assam',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Bihar',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              name: '5%',
                                              // name: 'Bihar',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Arunanchal Pradesh',
                                            color: '#f5bf55',
                                            data: [{
                                              value: 15,
                                              name: '15%',
                                              // name: 'Arunanchal Pradesh',
                                              color: '#f5bf55'
                                            }]
                                          }]

                                        }
                                      }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>

                              </Tab>
                              <Tab eventKey="District" title="District">
                              <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>KPI</h6>
                                      <h2 className="heading-md">
                                        Functional Electricity
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={
                                        {
                                          chart: {
                                            type: 'packedbubble',
                                            // height: '80%'
                                          },
                                          title: {
                                            text: 'KPI Functional Electricity'
                                          },
                                          subTitle: {
                                            text: 'Coffee consumption'
                                          },
                                          tooltip: {
                                            valueSuffix: '%'
                                          },
                                          credits: {
                                            enabled: false
                                          },
                                          plotOptions: {
                                            packedbubble: {
                                              minSize: 50,
                                              maxSize: 320,
                                              dataLabels: {
                                                enabled: true,
                                                format: '{point.name}',
                                                style: {
                                                  color: 'black',
                                                  textOutline: 'none',
                                                  fontWeight: 'normal'
                                                }
                                              },
                                              minPointSize: 5
                                            }
                                          },
                                          series: [{
                                            showInLegend: false,
                                            name: 'Uttar Pradesh',
                                            color: "#bce263",
                                            data: [{
                                              value: 65,
                                              // name: 'Uttar Pradesh',
                                              name: '65%',
                                              color: "#bce263",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Goa',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              // name: 'Goa',
                                              name: '5%',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Assam',
                                            color: "#e6694a",
                                            data: [{
                                              value: 10,
                                              name: '10%',
                                              // name: 'Assam',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Bihar',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              name: '5%',
                                              // name: 'Bihar',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Arunanchal Pradesh',
                                            color: '#f5bf55',
                                            data: [{
                                              value: 15,
                                              name: '15%',
                                              // name: 'Arunanchal Pradesh',
                                              color: '#f5bf55'
                                            }]
                                          }]

                                        }
                                      }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>
                              <Tab eventKey="Block" title="Block">
                              <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>KPI</h6>
                                      <h2 className="heading-md">
                                        Functional Electricity
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={
                                        {
                                          chart: {
                                            type: 'packedbubble',
                                            // height: '80%'
                                          },
                                          title: {
                                            text: 'KPI Functional Electricity'
                                          },
                                          subTitle: {
                                            text: 'Coffee consumption'
                                          },
                                          tooltip: {
                                            valueSuffix: '%'
                                          },
                                          credits: {
                                            enabled: false
                                          },
                                          plotOptions: {
                                            packedbubble: {
                                              minSize: 50,
                                              maxSize: 320,
                                              dataLabels: {
                                                enabled: true,
                                                format: '{point.name}',
                                                style: {
                                                  color: 'black',
                                                  textOutline: 'none',
                                                  fontWeight: 'normal'
                                                }
                                              },
                                              minPointSize: 5
                                            }
                                          },
                                          series: [{
                                            showInLegend: false,
                                            name: 'Uttar Pradesh',
                                            color: "#bce263",
                                            data: [{
                                              value: 65,
                                              // name: 'Uttar Pradesh',
                                              name: '65%',
                                              color: "#bce263",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Goa',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              // name: 'Goa',
                                              name: '5%',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Assam',
                                            color: "#e6694a",
                                            data: [{
                                              value: 10,
                                              name: '10%',
                                              // name: 'Assam',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Bihar',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              name: '5%',
                                              // name: 'Bihar',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Arunanchal Pradesh',
                                            color: '#f5bf55',
                                            data: [{
                                              value: 15,
                                              name: '15%',
                                              // name: 'Arunanchal Pradesh',
                                              color: '#f5bf55'
                                            }]
                                          }]

                                        }
                                      }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>

                            </Tabs>


                          </div>


                        </div>

                        <div className="col-md-12 col-lg-12">
                          <div className="impact-box-content-education">
                            <div className="text-btn-d">
                              <h2 className="heading-sm">Performance By School Management</h2>
                            </div>

                            <Tabs defaultActiveKey="State" id="uncontrolled-tab-example" className="">

                              <Tab eventKey="State" title="State">

                                <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-12">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                    options={
                                      {
                                        colorAxis: {
                                            minColor: '#FFFFFF',
                                            maxColor: Highcharts.getOptions().colors[0]
                                        },
                                        series: [{
                                            type: 'treemap',
                                            layoutAlgorithm: 'squarified',
                                            clip: false,
                                            data: [{
                                                name: 'A',
                                                value: 6,
                                                colorValue: 1
                                            }, {
                                                name: 'B',
                                                value: 6,
                                                colorValue: 2
                                            }, {
                                                name: 'C',
                                                value: 4,
                                                colorValue: 3
                                            }, {
                                                name: 'D',
                                                value: 3,
                                                colorValue: 4
                                            }, {
                                                name: 'E',
                                                value: 2,
                                                colorValue: 5
                                            }, {
                                                name: 'F',
                                                value: 2,
                                                colorValue: 6
                                            }, {
                                                name: 'G',
                                                value: 1,
                                                colorValue: 7
                                            }]
                                        }],
                                        title: {
                                            text: 'Highcharts Treemap'
                                        }
                                    }
                                    }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>

                              </Tab>
                              <Tab eventKey="District" title="District">
                              <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>KPI</h6>
                                      <h2 className="heading-md">
                                        Functional Electricity
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={
                                        {
                                          chart: {
                                            type: 'packedbubble',
                                            // height: '80%'
                                          },
                                          title: {
                                            text: 'KPI Functional Electricity'
                                          },
                                          subTitle: {
                                            text: 'Coffee consumption'
                                          },
                                          tooltip: {
                                            valueSuffix: '%'
                                          },
                                          credits: {
                                            enabled: false
                                          },
                                          plotOptions: {
                                            packedbubble: {
                                              minSize: 50,
                                              maxSize: 320,
                                              dataLabels: {
                                                enabled: true,
                                                format: '{point.name}',
                                                style: {
                                                  color: 'black',
                                                  textOutline: 'none',
                                                  fontWeight: 'normal'
                                                }
                                              },
                                              minPointSize: 5
                                            }
                                          },
                                          series: [{
                                            showInLegend: false,
                                            name: 'Uttar Pradesh',
                                            color: "#bce263",
                                            data: [{
                                              value: 65,
                                              // name: 'Uttar Pradesh',
                                              name: '65%',
                                              color: "#bce263",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Goa',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              // name: 'Goa',
                                              name: '5%',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Assam',
                                            color: "#e6694a",
                                            data: [{
                                              value: 10,
                                              name: '10%',
                                              // name: 'Assam',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Bihar',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              name: '5%',
                                              // name: 'Bihar',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Arunanchal Pradesh',
                                            color: '#f5bf55',
                                            data: [{
                                              value: 15,
                                              name: '15%',
                                              // name: 'Arunanchal Pradesh',
                                              color: '#f5bf55'
                                            }]
                                          }]

                                        }
                                      }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>
                              <Tab eventKey="Block" title="Block">
                              <div className="piechart-box row mt-4 align-items-center">
                                  <div className="col-md-3">
                                    <div className="chart-left-text">
                                      <h6>KPI</h6>
                                      <h2 className="heading-md">
                                        Functional Electricity
                                      </h2>
                                    </div>
                                  </div>
                                  <div className="col-md-9">
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      options={
                                        {
                                          chart: {
                                            type: 'packedbubble',
                                            // height: '80%'
                                          },
                                          title: {
                                            text: 'KPI Functional Electricity'
                                          },
                                          subTitle: {
                                            text: 'Coffee consumption'
                                          },
                                          tooltip: {
                                            valueSuffix: '%'
                                          },
                                          credits: {
                                            enabled: false
                                          },
                                          plotOptions: {
                                            packedbubble: {
                                              minSize: 50,
                                              maxSize: 320,
                                              dataLabels: {
                                                enabled: true,
                                                format: '{point.name}',
                                                style: {
                                                  color: 'black',
                                                  textOutline: 'none',
                                                  fontWeight: 'normal'
                                                }
                                              },
                                              minPointSize: 5
                                            }
                                          },
                                          series: [{
                                            showInLegend: false,
                                            name: 'Uttar Pradesh',
                                            color: "#bce263",
                                            data: [{
                                              value: 65,
                                              // name: 'Uttar Pradesh',
                                              name: '65%',
                                              color: "#bce263",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Goa',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              // name: 'Goa',
                                              name: '5%',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Assam',
                                            color: "#e6694a",
                                            data: [{
                                              value: 10,
                                              name: '10%',
                                              // name: 'Assam',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Bihar',
                                            color: "#e6694a",
                                            data: [{
                                              value: 5,
                                              name: '5%',
                                              // name: 'Bihar',
                                              color: "#e6694a",
                                            }]
                                          }, {
                                            showInLegend: false,
                                            name: 'Arunanchal Pradesh',
                                            color: '#f5bf55',
                                            data: [{
                                              value: 15,
                                              name: '15%',
                                              // name: 'Arunanchal Pradesh',
                                              color: '#f5bf55'
                                            }]
                                          }]

                                        }
                                      }
                                      // allowChartUpdate={true}
                                      immutable={true}
                                    />
                                  </div>
                                </div>
                              </Tab>

                            </Tabs>


                          </div>


                        </div>

                      </div>
                    </div>

                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        {/* devider */}
        <div className="right-devider-icon">
          <img src={Infraicon} alt="icon" className="icon-infra" />
        </div>
      </section>
    </>
  );
}
