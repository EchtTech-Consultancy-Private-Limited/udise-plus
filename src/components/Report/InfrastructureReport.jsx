import React, { useEffect, useCallback } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allFilter } from "../../redux/slice/schoolFilterSlice3016";
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
  const local_state = window.localStorage.getItem("state");
  const local_district = window.localStorage.getItem("district");
  const local_block = window.localStorage.getItem("block");
  const local_year = window.localStorage.getItem("year");
  const filterObj = structuredClone(schoolFilter);
  const [dispatchCount, setDispatchCount] = useState(1);
  const [report, setReport] = useState(null);
  const grid_column = useSelector((state) => state?.column3016);
  const [gridApi, setGridApi] = useState();
  const [viewDataBy, setViewDataBy] = useState("");
  const [arrGroupedData, setArrGroupedData] = useState([]);
  const [groupKeys,setGroupKeys] = useState({schManagementDesc:false,schCategoryDesc:false,schTypeDesc:false,schLocationDesc:false});
  const [mgtDetails,setMgtDetail] = useState(false);
  const [catDetails,setCatDetail] = useState(false);

  const [mgt,setMgt] = useState("");
  const [mgt_Details,setMgtDetails] = useState("");
  
  const [cat,setCat] = useState("");
  const [cat_Details,setCatDetails] = useState("");

  const [sch_type,setSchType] = useState("");
  const [ur,setUR] = useState("");
  const [multiMgt,setMultiMgt] = useState("");
  const [multiCat,setMultiCat] = useState("");



  const filter_query = (filterObj.regionType === 21 && filterObj.regionCode === "11") || (filterObj.regionType === 22 && filterObj.regionCode === "02") || (filterObj.regionType === 23 && filterObj.regionCode === "0202");

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


  useEffect(() => {
    if (viewDataBy === "School Management") {
      setGroupKeys({ ...groupKeys, schManagementDesc: true });
    }else{
      setGroupKeys({ ...groupKeys, schManagementDesc: false });
    }

    if (viewDataBy === "Urban/Rural") {
      setGroupKeys({ ...groupKeys, schLocationDesc: true });
    }else{
      setGroupKeys({ ...groupKeys, schLocationDesc: false });
    } 
     if (viewDataBy === "School Category") {
      setGroupKeys({ ...groupKeys, schCategoryDesc: true });
    }else{
      setGroupKeys({ ...groupKeys, schCategoryDesc: true });
    }
    
     if (viewDataBy === "School Type") {
      setGroupKeys({ ...groupKeys, schTypeDesc: true});
    } else {
      setGroupKeys({ ...groupKeys, schTypeDesc: false});
    }
    const allFalse = Object.values(groupKeys).every(value => value === false);
    if(viewDataBy==="" && allFalse){
      schoolLocationRow();
    }else{
      multiGroupingRows();
    }
    
  }, [viewDataBy,school_data]);

  useEffect(()=>{
    const allFalse = Object.values(groupKeys).every(value => value === false);
    if(viewDataBy==="" && allFalse){
      schoolLocationRow();
    }else{
      multiGroupingRows();
    }
  },[groupKeys])


  const [columns, setCol] = useState([
    {
      headerName: "Location",
      field: "regionName",
    },
    {
      headerName: "School Management",
      field: "schManagementDesc",
    },
    {
      headerName: "School Category",
      field: "schCategoryDesc",
    },
    {
      headerName: "School Type",
      field: "schTypeDesc",
    },
    {
      headerName: "Urban/Rural",
      field: "schLocationDesc",
    },
    {
      headerName: "No. Of Schools having Electricity",
      field: "schHaveElectricity",
    },
  ]);

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
    if (columnId === "schManagementDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schManagementDesc: visible
      }));
    } else if (columnId === "schCategoryDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schCategoryDesc: visible
      }));
    } else if (columnId === "schTypeDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schTypeDesc: visible
      }));
    } else if (columnId === "schLocationDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schLocationDesc: visible
      }));
    }
  }
  
  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }, []);

  const handleFilter = (value,e) => {
    // const parentLi = e.target.closest(".nav-item");
    // const parentLi1 = document.querySelectorAll(".nav-item");

    // if (e.target.classList.contains("multibtn")) {
    //   parentLi.classList.remove("multibtn");
    //   parentLi1.classList.remove("multibtn");
    // } else {
    //   parentLi.classList.add("multibtn");
    // }


    if(value==="School Management" || value==="Mgt Details"){
      if(value==="School Management"){
        if(mgt==="active"){
          setMgt("");
        }else{
          setMgt("active");
        }
      }else{
        setMgt("");
      }
  
      if(value==="Mgt Details"){
        if(mgt_Details==="active"){
          setMgtDetails("");
        }else{
          setMgtDetails("active");
        }
      }else{
        setMgtDetails("");
      }

      /*hide and show multi button class for details view*/
      if(value==="School Management"){
        if(mgt==="active"){
          setMultiMgt("")
        }else{
          setMultiMgt("multibtn")
        }
      }
      if(value==="Mgt Details"){
        if(mgt_Details==="active"){
          setMultiMgt("")
        }else{
          setMultiMgt("multibtn")
        }
      }

     


      /*end here*/
    
  
    }
    
    
    if(value==="School Category" || value==="Cat Details"){
      if(value==="School Category"){
        if(cat==="active"){
          setCat("");
        }else{
          setCat("active");
        }
      }else{
        setCat("");
      }
  
      if(value==="Cat Details"){
        if(cat_Details==="active"){
          setCatDetails("");
        }else{
          setCatDetails("active");
        }

          }else{
            setCatDetails("");
          }
          

          if(value==="School Category"){
            if(cat==="active"){
              setMultiCat("")
            }else{
              setMultiCat("multibtn")
            }
          }
          if(value==="Cat Details"){
            if(cat_Details==="active"){
              setMultiCat("")
            }else{
              setMultiCat("multibtn")
            }
          }
    }
    
    if(value==="School Type"){
      if(sch_type==="active"){
        setSchType("");
      }else{
        setSchType("active");
      }
    }

    if(value==="Urban/Rural"){
      if(ur==="active"){
        setUR("");
      }else{
        setUR("active");
      }
    }

    

    // const navLinks = document.querySelectorAll(".dark-active");

    // navLinks.forEach((link) => {
    //   if (link !== e.target && link.classList.contains("active")) {
    //     link.classList.remove("active");
    //   }
    // });

 
    // if (!e.target.classList.contains("active")) {
    //   e.target.classList.add("active");
    // } else {
    //   e.target.classList.remove("active");
    // }
  };


  useEffect(() => {
    if (!grid_column) {
      gridApi?.columnApi?.api?.setColumnVisible("schManagementDesc", false);
      gridApi?.columnApi?.api?.setColumnVisible("schCategoryDesc", false);
      gridApi?.columnApi?.api?.setColumnVisible("schLocationDesc", false);
      gridApi?.columnApi?.api?.setColumnVisible("schTypeDesc", false);
    }
    if (gridApi && gridApi.columnApi) {
      gridApi.columnApi.api.setColumnVisible(
        "schManagementDesc",
        grid_column.column_mgt
      );
      gridApi.columnApi.api.setColumnVisible(
        "schCategoryDesc",
        grid_column.column_cat
      );
      gridApi?.columnApi?.api?.setColumnVisible(
        "schLocationDesc",
        grid_column.column_ur
      );
      gridApi?.columnApi?.api?.setColumnVisible(
        "schTypeDesc",
        grid_column.column_sch_type
      );
    }
  }, [grid_column, gridApi]);

  const handleGroupButtonClick = (e,currObj) => {
    handleFilter(e,currObj);
    setViewDataBy((prevViewDataBy) => (prevViewDataBy === e ? "" : e));
    
  if(e==="School Management"){
      if(viewDataBy===e){
        setGroupKeys({...groupKeys,schManagementDesc:false});
      }else{
        setGroupKeys({...groupKeys,schManagementDesc:true});
      }
    }else if(e==="School Category"){
      if(viewDataBy===e){
        setGroupKeys({...groupKeys,schCategoryDesc:false});
      }else{
        setGroupKeys({...groupKeys,schCategoryDesc:true});
      }
    }else if(e==="School Type"){
      if(viewDataBy===e){
        setGroupKeys({...groupKeys,schTypeDesc:false});
      }else{
        setGroupKeys({...groupKeys,schTypeDesc:true});
      }
    }else{
      if(viewDataBy===e){
        setGroupKeys({...groupKeys,schLocationDesc:false});
      }else{
        setGroupKeys({...groupKeys,schLocationDesc:true});
      }
    }
    const allFalse = Object.values(groupKeys).every(value => value === false);
    if(viewDataBy==="" && allFalse){
      schoolLocationRow();
    }else{
      multiGroupingRows();
    }


//     const darkActiveTabs = document.querySelectorAll(".dark-active");
//     const darkActiveTabss = document.querySelectorAll(".dark-active.active");
// let arr=[darkActiveTabs,darkActiveTabss]
//     darkActiveTabs.forEach((element) => {
//       element.addEventListener('click', function() {
//         for(let i=0; i<arr.length;i++){
//           if(arr[0]){
//             if (element.classList.contains('active')) {
         
//               element.classList.remove('active');
//             }
//           }
//           if(arr[1]){
       
//               element.classList.add('active');
           
//           }
//         }
         
//       }); 
//     });
    




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
          totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
        });

        const appended = {
          regionName: item,
          schHaveElectricity: totalSchoolsHaveElectricity,
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

  const schoolLocationRowFilterWise = (filter_type = null,flag) => {
    let state_gov_mgt_code = ["1", "2", "3", "6", "89", "90", "91"];
    let gov_aided_mgt_code = ["4", "7"];
    let pvt_uaided_mgt_code = ["5"];
    let ctrl_gov_mgt_code = ["92", "93", "94", "95", "96", "101"];
    let other_mgt_code = ["8", "97", "99", "98", "102"];

    const primaryKeys = ["regionName", "schManagementCode"];
    let state_gov_total = 0;
    let gov_aided_total = 0;
    let pvt_uaided_total = 0;
    let ctrl_gov_total = 0;
    let other_total = 0;

    if (filter_type === "particular_or_state_wise") {
      const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
      const updatedArrGroupedData = [];

      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData)?.forEach((item) => {
          const itemsArray = groupedData[item];
          itemsArray.forEach((dataItem) => {
            if (state_gov_mgt_code.includes(item.split("@")[1])) {
              state_gov_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schManagementDesc: "State Government",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (gov_aided_mgt_code.includes(item.split("@")[1])) {
              gov_aided_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schManagementDesc: "Govt. Aided",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (pvt_uaided_mgt_code.includes(item.split("@")[1])) {
              pvt_uaided_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schManagementDesc: "Private Unaided",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (ctrl_gov_mgt_code.includes(item.split("@")[1])) {
              ctrl_gov_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schManagementDesc: "Central Government",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else {
              // other
              if (other_mgt_code.includes(item.split("@")[1])) {
                other_total += parseInt(dataItem.schHaveElectricity);
                updatedArrGroupedData.push({
                  regionName: dataItem.regionName,
                  schManagementDesc: "Others",
                  schHaveElectricity: parseInt(dataItem.schHaveElectricity),
                });
              }
            }
          });
        });
      }

      const primaryKeys2 = ["regionName", "schManagementDesc"];
      const groupedData2 = groupByKey(updatedArrGroupedData, primaryKeys2);
      const updatedArrGroupedData2 = [];

      const state_gov = "State Government";
      const gov_aided = "Govt. Aided";
      const pvt_unaided = "Private Unaided";
      const ctrl_gov = "Central Government";
      const others = "Others";
     
    state_gov_total = 0;
     gov_aided_total = 0;
     pvt_uaided_total = 0;
     ctrl_gov_total = 0;
     other_total = 0;
      Object.keys(groupedData2)?.forEach((item) => {
        const itemsArray = groupedData2[item];
        itemsArray.forEach((dataItem) => {
          if (state_gov === item.split("@")[1]) {
            state_gov_total += parseInt(dataItem.schHaveElectricity);
          } else if (gov_aided === item.split("@")[1]) {
            gov_aided_total += parseInt(dataItem.schHaveElectricity);
          } else if (pvt_unaided === item.split("@")[1]) {
            pvt_uaided_total += parseInt(dataItem.schHaveElectricity);
          } else if (ctrl_gov === item.split("@")[1]) {
            ctrl_gov_total += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (others === item.split("@")[1]) {
              other_total += parseInt(dataItem.schHaveElectricity);
            }
          }
        });
        if (state_gov === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schManagementDesc: item.split("@")[1],
            schHaveElectricity: state_gov_total,
          });
        } else if (gov_aided === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schManagementDesc: item.split("@")[1],
            schHaveElectricity: gov_aided_total,
          });
        } else if (pvt_unaided === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schManagementDesc: item.split("@")[1],
            schHaveElectricity: pvt_uaided_total,
          });
        } else if (ctrl_gov === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schManagementDesc: item.split("@")[1],
            schHaveElectricity: ctrl_gov_total,
          });
        } else {
          // other
          if (others === item.split("@")[1]) {
            updatedArrGroupedData2.push({
              regionName: item.split("@")[0],
              schManagementDesc: item.split("@")[1],
              schHaveElectricity: other_total,
            });
          }
        }
      });

      setArrGroupedData(updatedArrGroupedData2);

      gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", true);
      gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
      gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
    }
  };

  const schoolCategoryRow = () => {
    const primaryKeys = ["schCategoryDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      let pr_sch_code = ["1"];
      let upr_pr_code = ["2", "4"];
      let hr_sec_code = ["3", "5", "10", "11"];
      let sec_sch_code = ["6", "7", "8"];
      let pre_pr_sch_code = ["12"];

      let pr_sch_total = 0;
      let upr_pr_total = 0;
      let hr_sec_total = 0;
      let sec_sch_total = 0;
      let pre_pr_sch_total = 0;

      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];

        itemsArray.forEach((dataItem) => {
          if (pr_sch_code.includes(dataItem.schCategoryCode)) {
            pr_sch_total += parseInt(dataItem.schHaveElectricity);
          } else if (upr_pr_code.includes(dataItem.schCategoryCode)) {
            upr_pr_total += parseInt(dataItem.schHaveElectricity);
          } else if (hr_sec_code.includes(dataItem.schCategoryCode)) {
            hr_sec_total += parseInt(dataItem.schHaveElectricity);
          } else if (sec_sch_code.includes(dataItem.schCategoryCode)) {
            sec_sch_total += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (pre_pr_sch_code.includes(dataItem.schCategoryCode)) {
              pre_pr_sch_total += parseInt(dataItem.schHaveElectricity);
            }
          }
        });
      });

      const broadCatArr = [
        { schCategoryDesc: "Primary (PRY)", schHaveElectricity: pr_sch_total },
        {
          schCategoryDesc: "Upper Primary (UPR)",
          schHaveElectricity: upr_pr_total,
        },
        {
          schCategoryDesc: "Higher Secondary (HSEC)",
          schHaveElectricity: hr_sec_total,
        },
        {
          schCategoryDesc: "Secondary (SEC)",
          schHaveElectricity: sec_sch_total,
        },
        {
          schCategoryDesc: "Pre-Primary (PRY)",
          schHaveElectricity: pre_pr_sch_total,
        },
      ];
      updatedArrGroupedData.push(broadCatArr);
      setArrGroupedData(updatedArrGroupedData.flat());
      gridApi.columnApi.api.setColumnVisible("schCategoryDesc", true);
      gridApi.columnApi.api.setColumnVisible("schManagementDesc", false);
      gridApi.columnApi.api.setColumnVisible("regionName", false);
      gridApi.columnApi.api.setColumnVisible("schLocationDesc", false);
      gridApi.columnApi.api.setColumnVisible("schTypeDesc", false);
    }
  };

  const schoolManagementRow = () => {
    const primaryKeys = ["schManagementDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      let state_gov_mgt_code = ["1", "2", "3", "6", "89", "90", "91"];
      let gov_aided_mgt_code = ["4", "7"];
      let pvt_uaided_mgt_code = ["5"];
      let ctrl_gov_mgt_code = ["92", "93", "94", "95", "96", "101"];
      let other_mgt_code = ["8", "97", "99", "98", "102"];

      let state_gov_total = 0;
      let gov_aided_total = 0;
      let pvt_uaided_total = 0;
      let ctrl_gov_total = 0;
      let other_total = 0;

      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];

        itemsArray.forEach((dataItem) => {
          if (state_gov_mgt_code.includes(dataItem.schManagementCode)) {
            state_gov_total += parseInt(dataItem.schHaveElectricity);
          } else if (gov_aided_mgt_code.includes(dataItem.schManagementCode)) {
            gov_aided_total += parseInt(dataItem.schHaveElectricity);
          } else if (pvt_uaided_mgt_code.includes(dataItem.schManagementCode)) {
            pvt_uaided_total += parseInt(dataItem.schHaveElectricity);
          } else if (ctrl_gov_mgt_code.includes(dataItem.schManagementCode)) {
            ctrl_gov_total += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (other_mgt_code.includes(dataItem.schManagementCode)) {
              other_total += parseInt(dataItem.schHaveElectricity);
            }
          }
        });
      });

      const broadMgtArr = [
        {
          schManagementDesc: "State Government",
          schHaveElectricity: state_gov_total,
        },
        {
          schManagementDesc: "Govt. Aided",
          schHaveElectricity: gov_aided_total,
        },
        {
          schManagementDesc: "Private Unaided",
          schHaveElectricity: pvt_uaided_total,
        },
        {
          schManagementDesc: "Central Government",
          schHaveElectricity: ctrl_gov_total,
        },
        { schManagementDesc: "Others", schHaveElectricity: other_total },
      ];
      updatedArrGroupedData.push(broadMgtArr);
      setArrGroupedData(updatedArrGroupedData.flat());
      gridApi.columnApi.api.setColumnVisible("schManagementDesc", true);
      gridApi.columnApi.api.setColumnVisible("schCategoryDesc", false);
      gridApi.columnApi.api.setColumnVisible("regionName", false);
      gridApi.columnApi.api.setColumnVisible("schTypeDesc", false);
    }
  };

  const schoolUrbanRuralRow = () => {
    const primaryKeys = ["schLocationDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      let urban_total = 0;
      let rural_total = 0;

      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];

        itemsArray.forEach((dataItem) => {
          if (dataItem.schLocationDesc === "Rural") {
            rural_total += parseInt(dataItem.schHaveElectricity);
          }
          if (dataItem.schLocationDesc === "Urban") {
            urban_total += parseInt(dataItem.schHaveElectricity);
          }
        });
      });

      const broadURArr = [
        { schLocationDesc: "Urban", schHaveElectricity: urban_total },
        { schLocationDesc: "Rural", schHaveElectricity: rural_total },
      ];

      updatedArrGroupedData.push(broadURArr);

      setArrGroupedData(updatedArrGroupedData.flat());
      gridApi.columnApi.api.setColumnVisible("schLocationDesc", true);
      gridApi.columnApi.api.setColumnVisible("schCategoryDesc", false);
      gridApi.columnApi.api.setColumnVisible("schManagementDesc", false);
      gridApi.columnApi.api.setColumnVisible("regionName", false);
      gridApi.columnApi.api.setColumnVisible("schTypeDesc", false);
    }
  };

  const schoolTypeRow = () => {
    const primaryKeys = ["schTypeDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      let boys_total = 0;
      let girls_total = 0;
      let coed_total = 0;

      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];

        itemsArray.forEach((dataItem) => {
          if (dataItem.schTypeDesc === "Boys") {
            boys_total += parseInt(dataItem.schHaveElectricity);
          }
          if (dataItem.schTypeDesc === "Girls") {
            girls_total += parseInt(dataItem.schHaveElectricity);
          }
          if (dataItem.schTypeDesc === "Co-ed") {
            coed_total += parseInt(dataItem.schHaveElectricity);
          }
        });
      });

      const broadURArr = [
        { schTypeDesc: "Boys", schHaveElectricity: boys_total },
        { schTypeDesc: "Girls", schHaveElectricity: girls_total },
        { schTypeDesc: "Co-ed", schHaveElectricity: coed_total },
      ];

      updatedArrGroupedData.push(broadURArr);

      setArrGroupedData(updatedArrGroupedData.flat());
      gridApi.columnApi.api.setColumnVisible("schTypeDesc", true);
      gridApi.columnApi.api.setColumnVisible("schLocationDesc", false);
      gridApi.columnApi.api.setColumnVisible("schCategoryDesc", false);
      gridApi.columnApi.api.setColumnVisible("schManagementDesc", false);
      gridApi.columnApi.api.setColumnVisible("regionName", false);
    }
  };

  const managementRowDetails = () => {
    const primaryKeys = ["schManagementDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;

        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
        });

        const appended = {
          schManagementDesc: item,
          schHaveElectricity: totalSchoolsHaveElectricity,
        };

        updatedArrGroupedData.push(appended);
      });

      setArrGroupedData(updatedArrGroupedData);
    }

    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc",true);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("regionName", false);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
  };

  const categoryRowDetails = () => {
    
    const primaryKeys = ["schCategoryDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;

        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
        });

        const appended = {
          schCategoryDesc: item,
          schHaveElectricity: totalSchoolsHaveElectricity,
        };

        updatedArrGroupedData.push(appended);
      });

      setArrGroupedData(updatedArrGroupedData);
    }

    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", true);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc",false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("regionName", false);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
  };

  const schoolTypeRowFilterWise = (filter_type = null,flag) => {
    let girls = "Girls";
    let boys = "Boys";
    let co_ed = "Co-ed";

    const primaryKeys = ["regionName", "schTypeDesc"];

    let girls_total = 0;
    let boys_total = 0;
    let co_ed_total = 0;

    if (filter_type === "particular_or_state_wise") {
      const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
      const updatedArrGroupedData = [];

      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData)?.forEach((item) => {
          const itemsArray = groupedData[item];

          itemsArray.forEach((dataItem) => {
            if (girls === item.split("@")[1]) {
              girls_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schTypeDesc: "Girls",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (boys === item.split("@")[1]) {
              boys_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schTypeDesc: "Boys",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else {
              // other
              if (co_ed === item.split("@")[1]) {
                co_ed_total += parseInt(dataItem.schHaveElectricity);
                updatedArrGroupedData.push({
                  regionName: dataItem.regionName,
                  schTypeDesc: "Co-ed",
                  schHaveElectricity: parseInt(dataItem.schHaveElectricity),
                });
              }
            }
          });
        });
      }

      const primaryKeys2 = ["regionName", "schTypeDesc"];
      const groupedData2 = groupByKey(updatedArrGroupedData, primaryKeys2);
      const updatedArrGroupedData2 = [];

      let girls_ = 0;
      let boys_ = 0;
      let co_ed_ = 0;

      Object.keys(groupedData2)?.forEach((item) => {
        const itemsArray = groupedData2[item];
        itemsArray.forEach((dataItem) => {
          if (girls === item.split("@")[1]) {
            girls_ += parseInt(dataItem.schHaveElectricity);
          } else if (boys === item.split("@")[1]) {
            boys_ += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (co_ed === item.split("@")[1]) {
              co_ed_ += parseInt(dataItem.schHaveElectricity);
            }
          }
        });

        if (girls === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schTypeDesc: item.split("@")[1],
            schHaveElectricity: girls_,
          });
        } else if (boys === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schTypeDesc: item.split("@")[1],
            schHaveElectricity: boys_,
          });
        } else {
          // other
          if (co_ed === item.split("@")[1]) {
            updatedArrGroupedData2.push({
              regionName: item.split("@")[0],
              schTypeDesc: item.split("@")[1],
              schHaveElectricity: co_ed_,
            });
          }
        }
      });

      setArrGroupedData(updatedArrGroupedData2);
      gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
      gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", true);
    }
  };

  const schoolUrbanRuralRowFilterWise = (filter_type = null,flag) => {
    let urban = "Urban";
    let rural = "Rural";

    const primaryKeys = ["regionName", "schLocationDesc"];

    let urban_total = 0;
    let rural_total = 0;

    if (filter_type === "particular_or_state_wise") {
      const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
      const updatedArrGroupedData = [];

      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData)?.forEach((item) => {
          const itemsArray = groupedData[item];

          itemsArray.forEach((dataItem) => {
            if (urban === item.split("@")[1]) {
              urban_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schLocationDesc: "Urban",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else {
              // other
              if (rural === item.split("@")[1]) {
                rural_total += parseInt(dataItem.schHaveElectricity);
                updatedArrGroupedData.push({
                  regionName: dataItem.regionName,
                  schLocationDesc: "Rural",
                  schHaveElectricity: parseInt(dataItem.schHaveElectricity),
                });
              }
            }
          });
        });
      }

      const primaryKeys2 = ["regionName", "schLocationDesc"];
      const groupedData2 = groupByKey(updatedArrGroupedData, primaryKeys2);
      const updatedArrGroupedData2 = [];

      let urban_ = 0;
      let rural_ = 0;

      Object.keys(groupedData2)?.forEach((item) => {
        const itemsArray = groupedData2[item];
        itemsArray.forEach((dataItem) => {
          if (urban === item.split("@")[1]) {
            urban_ += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (rural === item.split("@")[1]) {
              rural_ += parseInt(dataItem.schHaveElectricity);
            }
          }
        });

        if (urban === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schLocationDesc: item.split("@")[1],
            schHaveElectricity: urban_,
          });
        } else {
          // other
          if (rural === item.split("@")[1]) {
            updatedArrGroupedData2.push({
              regionName: item.split("@")[0],
              schLocationDesc: item.split("@")[1],
              schHaveElectricity: rural_,
            });
          }
        }
      });

      setArrGroupedData(updatedArrGroupedData2);
      gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", true);
      gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
      gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
    }
  };

  const schoolCategoryRowFilterWise = (filter_type = null,flag) => {
    let pr_sch_code = ["1"];
    let upr_pr_code = ["2", "4"];
    let hr_sec_code = ["3", "5", "10", "11"];
    let sec_sch_code = ["6", "7", "8"];
    let pre_pr_sch_code = ["12"];


    const primaryKeys = ["regionName", "schCategoryCode"];

      let pr_sch_total = 0;
      let upr_pr_total = 0;
      let hr_sec_total = 0;
      let sec_sch_total = 0;
      let pre_pr_sch_total = 0;

    if (filter_type === "particular_or_state_wise") {
      const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
      const updatedArrGroupedData = [];

      if (groupedData && typeof groupedData === "object") {
        Object.keys(groupedData)?.forEach((item) => {
          const itemsArray = groupedData[item];
          itemsArray.forEach((dataItem) => {
            if (pr_sch_code.includes(item.split("@")[1])) {
              pr_sch_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schCategoryDesc: "Primary (PRY)",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (upr_pr_code.includes(item.split("@")[1])) {
              upr_pr_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schCategoryDesc: "Upper Primary (UPR)",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (hr_sec_code.includes(item.split("@")[1])) {
              hr_sec_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schCategoryDesc: "Higher Secondary (HSEC)",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else if (sec_sch_code.includes(item.split("@")[1])) {
              sec_sch_total += parseInt(dataItem.schHaveElectricity);
              updatedArrGroupedData.push({
                regionName: dataItem.regionName,
                schCategoryDesc: "Secondary (SEC)",
                schHaveElectricity: parseInt(dataItem.schHaveElectricity),
              });
            } else {
              // other
              if (pre_pr_sch_code.includes(item.split("@")[1])) {
                pre_pr_sch_total += parseInt(dataItem.schHaveElectricity);
                updatedArrGroupedData.push({
                  regionName: dataItem.regionName,
                  schCategoryDesc: "Pre-Primary (PRY)",
                  schHaveElectricity: parseInt(dataItem.schHaveElectricity),
                });
              }
            }
          });
        });
      }

      const primaryKeys2 = ["regionName", "schCategoryDesc"];
      const groupedData2 = groupByKey(updatedArrGroupedData, primaryKeys2);
      const updatedArrGroupedData2 = [];

      const pr_sch_ = "Primary (PRY)";
      const upr_pr_ = "Upper Primary (UPR)";
      const hr_sec_ = "Higher Secondary (HSEC)";
      const sec_sch_ = "Secondary (SEC)";
      const pre_pr_sch_ = "Pre-Primary (PRY)";

       pr_sch_total = 0;
       upr_pr_total = 0;
       hr_sec_total = 0;
       sec_sch_total = 0;
       pre_pr_sch_total = 0;

      Object.keys(groupedData2)?.forEach((item) => {
        const itemsArray = groupedData2[item];
        itemsArray.forEach((dataItem) => {
          if (pr_sch_ === item.split("@")[1]) {
            pr_sch_total += parseInt(dataItem.schHaveElectricity);
          } else if (upr_pr_ === item.split("@")[1]) {
            upr_pr_total += parseInt(dataItem.schHaveElectricity);
          } else if (hr_sec_ === item.split("@")[1]) {
            hr_sec_total += parseInt(dataItem.schHaveElectricity);
          } else if (sec_sch_ === item.split("@")[1]) {
            sec_sch_total += parseInt(dataItem.schHaveElectricity);
          } else {
            // other
            if (pre_pr_sch_ === item.split("@")[1]) {
              pre_pr_sch_total += parseInt(dataItem.schHaveElectricity);
            }
          }
        });
        if (pr_sch_ === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schCategoryDesc: item.split("@")[1],
            schHaveElectricity: pr_sch_total,
          });
        } else if (upr_pr_ === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schCategoryDesc: item.split("@")[1],
            schHaveElectricity: upr_pr_total,
          });
        } else if (hr_sec_ === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schCategoryDesc: item.split("@")[1],
            schHaveElectricity: hr_sec_total,
          });
        } else if (sec_sch_ === item.split("@")[1]) {
          updatedArrGroupedData2.push({
            regionName: item.split("@")[0],
            schCategoryDesc: item.split("@")[1],
            schHaveElectricity: sec_sch_total,
          });
        } else {
          // other
          if (pre_pr_sch_ === item.split("@")[1]) {
            updatedArrGroupedData2.push({
              regionName: item.split("@")[0],
              schCategoryDesc: item.split("@")[1],
              schHaveElectricity: pre_pr_sch_total,
            });
          }
        }
      });

      setArrGroupedData(updatedArrGroupedData2);

      gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", true);
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
      gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
      gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
    }
  };

  /*Details*/
  const schoolManagementDetailsRow = (filter_type=null,flag) => {
    const primaryKeys = ["regionName","schManagementDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
        });

        const appended = {
          regionName: item.split('@')[0],
          schManagementDesc:item.split("@")[1],
          schHaveElectricity: totalSchoolsHaveElectricity,
        };

        updatedArrGroupedData.push(appended);
      });

      setArrGroupedData(updatedArrGroupedData);
    }

    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", true);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
    gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", false);
  };

  const schoolCategoryDetailsRow = (filter_type=null,flag) => {
    const primaryKeys = ["regionName","schCategoryDesc"];
    const groupedData = groupByKey(school_data?.data?.data, primaryKeys);
    const updatedArrGroupedData = [];

    if (groupedData && typeof groupedData === "object") {
      Object.keys(groupedData)?.forEach((item) => {
        const itemsArray = groupedData[item];
        let totalSchoolsHaveElectricity = 0;
        itemsArray.forEach((dataItem) => {
          totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
        });

        const appended = {
          regionName: item.split('@')[0],
          schCategoryDesc:item.split("@")[1],
          schHaveElectricity: totalSchoolsHaveElectricity,
        };

        updatedArrGroupedData.push(appended);
      });

      setArrGroupedData(updatedArrGroupedData);
    }

    gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", true);
    gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", false);
    gridApi?.columnApi?.api.setColumnVisible("regionName", flag);
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
          let totalSchoolsHaveElectricity = 0;
          let regionName = "";
          itemsArray.forEach((dataItem) => {
            regionName = dataItem.regionName;
            totalSchoolsHaveElectricity += parseInt(dataItem.schHaveElectricity);
          });
  
          const appended = {};
          primaryKeys.forEach((key, index) => {
            appended.regionName = regionName
            appended[key] = item.split("@")[index];
          });
          appended.schHaveElectricity = totalSchoolsHaveElectricity;
          updatedArrGroupedData.push(appended);
        });
  
        setArrGroupedData(updatedArrGroupedData);
      }
      
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", groupKeys.schManagementDesc);
      gridApi?.columnApi?.api.setColumnVisible("schCategoryDesc", groupKeys.schCategoryDesc);
      gridApi?.columnApi?.api.setColumnVisible("schTypeDesc", groupKeys.schTypeDesc);
      gridApi?.columnApi?.api.setColumnVisible("schLocationDesc", groupKeys.schLocationDesc);
      gridApi?.columnApi?.api.setColumnVisible("regionName", filter_query);
    }
  };

  /*end here*/
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
                {/* <Tabs
                  activeKey={viewDataBy}
                  id="uncontrolled-tab-example"
                  onSelect={(e) => handleGroupButtonClick(e)}
                >
                  <Tab
                    eventKey="School Management"
                    title="School Management"
                  ></Tab>
                  
                  <Tab
                    eventKey="Mgt Details"
                    title="Details"
                  ></Tab>

                  <Tab eventKey="School Category" title="School Category"></Tab>
                  
                  <Tab
                    eventKey="Cat Details"
                    title="Details"
                  ></Tab>


                  <Tab eventKey="School Type" title="School Type"></Tab>
                  <Tab eventKey="Urban/Rural" title="Urban / Rural"></Tab>
                </Tabs> */}

                <ul className="nav nav-tabs mul-tab-main">

                  <li className={`nav-item ${multiMgt}`}>
                    <button type="button" className={`nav-link dark-active ${mgt}`}  onClick={(e)=>handleGroupButtonClick("School Management",e)}>School Management(Broad) </button>
                    <button type="button" className={`nav-link dark-active details-multi ${mgt_Details}`} id="school_mgt_details" onClick={(e)=>handleGroupButtonClick("Mgt Details",e)}>Datails View</button>
                  </li>
                
                  <li className={`nav-item ${multiCat}`}>
                    <button type="button" className={`nav-link dark-active1 ${cat}`}  onClick={(e)=>handleGroupButtonClick("School Category",e)}>School Category(Broad)</button>
                    <button type="button" className={`nav-link details-multi dark-active1 ${cat_Details}`}  onClick={(e)=>handleGroupButtonClick("Cat Details",e)}>Datails View</button>
                  </li>     
                              
                  <li className="nav-item">
                    <button type="button" className={`nav-link ${sch_type}`}  onClick={(e)=>handleGroupButtonClick("School Type",e)}>School Type</button>
                  </li>
                  <li className="nav-item">
                    <button type="button" className={`nav-link ${ur}`}  onClick={(e)=>handleGroupButtonClick("Urban/Rural",e)}>Urban / Rural</button>
                  </li>
                </ul>
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
                    <div
                      className="ag-theme-material ag-theme-custom-height ag-theme-quartz"
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
