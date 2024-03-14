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
import groupByKey from "../../utils/groupBy";


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
  
  const [groupKeys,setGroupKeys] = useState({schManagementDesc:false,schManagementBroad:false,schCategoryDesc:false,schCategoryBroad:false,schTypeDesc:false,schLocationDesc:false});

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
  const [data,setData] = useState([]);



  const filter_query = (filterObj.regionType === 21 && filterObj.regionCode === "11") || (filterObj.regionType === 22 && filterObj.regionCode === "02") || (filterObj.regionType === 23 && filterObj.regionCode === "0202");

 
  function calculateTotal(fieldName) {
    if (!school_data?.data?.data) return 0;
    return school_data.data.data.reduce((total, row) => total + parseFloat(row[fieldName] || 0), 0);
    
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
    dispatch(fetchArchiveServicesSchoolData(schoolFilterYear));
    if (dispatchCount === 1) {
      filterObj.regionType = 10;
      filterObj.regionCode = 99;
      dispatch(allFilter(filterObj));
      setDispatchCount((prev) => prev + 1);
    }
    // eslint-disable-next-line
  }, [schoolFilterYear]);
 

 
  useEffect(()=>{

      const allFalse = Object.values(groupKeys).every(value => value === false);
      if(viewDataBy==="" && allFalse){
        schoolLocationRow();
      }else{
          handleCustomKeyInAPIResponse();
          multiGroupingRows();
      }

  },[school_data?.data?.data]);
  

  useEffect(()=>{

  const allFalse = Object.values(groupKeys).every(value => value === false);
    if(viewDataBy==="" && allFalse){
      schoolLocationRow();
    }else{
        handleCustomKeyInAPIResponse();
        multiGroupingRows();
    }
  },[groupKeys])


  useEffect(()=>{
    multiGroupingRows();
  },[data]);

  const [columns, setCol] = useState([
    {
      headerName: "Location",
      field: "regionName",
    },
    {
      headerName: "School Management(Broad)",
      field: "schManagementBroad",
    },
    {
      headerName: "School Management(Detailed)",
      field: "schManagementDesc",
    },
    {
      headerName: "School Category(Broad)",
      field: "schCategoryBroad",
    },
    {
      headerName: "School Category(Detailed)",
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
    const columnId = event?.column?.getColId();
    const visible = event.visible;
    if (columnId === "schManagementDesc") {

      setGroupKeys(prev => ({
        ...prev,
        schManagementDesc: visible
      }));
      setMgt(()=>visible?"active":"");
      setMultiMgt(()=>visible?"multibtn":"")
    } 
    else if (columnId === "schTypeDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schTypeDesc: visible
      }));
      setSchType(()=>visible?"active":"");
    }
    else if (columnId === "schCategoryDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schCategoryDesc: visible
      }));
      setCat(()=>visible?"active":"");
      setMultiCat(()=>visible?"multibtn":"");

    }  else if (columnId === "schLocationDesc") {
      setGroupKeys(prev => ({
        ...prev,
        schLocationDesc: visible
      }));
      setUR(()=>visible?"active":"");
    }
  }
  
  
  const onGridReady = useCallback((params) => {
    setGridApi(params);
  }, []);

  
  const handleCustomKeyInAPIResponse = ()=>{
    
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
    school_data.data.data.forEach((item,idx)=>{
      let appendedObj  ={...item};

      /* broad management key added*/
        if(state_gov_mgt_code.includes(item.schManagementCode)){
          appendedObj.schManagementBroad= 'State Government';
        }else if(gov_aided_mgt_code.includes(item.schManagementCode)){
          appendedObj.schManagementBroad= 'Govt. Aided';
        }
        else if(pvt_uaided_mgt_code.includes(item.schManagementCode)){
          appendedObj.schManagementBroad= 'Private Unaided';
        }
        else if(ctrl_gov_mgt_code.includes(item.schManagementCode)){
          appendedObj.schManagementBroad= 'Central Government';
        }
        else if(other_mgt_code.includes(item.schManagementCode)){
          appendedObj.schManagementBroad= 'Others';
        }
        
        /* broad category key added*/
         if(pr_sch_code.includes(item.schCategoryCode)){
          appendedObj.schCategoryBroad= 'Primary (PRY)';
        }
        else if(upr_pr_code.includes(item.schCategoryCode)){
          appendedObj.schCategoryBroad= 'Upper Primary (UPR)';
        }
        else if(hr_sec_code.includes(item.schCategoryCode)){
          appendedObj.schCategoryBroad= 'Higher Secondary (HSEC)';
        }
        else if(sec_sch_code.includes(item.schCategoryCode)){
          appendedObj.schCategoryBroad= 'Secondary (SEC)';
        }
        else if(pre_pr_sch_code.includes(item.schCategoryCode)){
          appendedObj.schCategoryBroad= 'Pre-Primary (PRY)';
        }
        arr.push(appendedObj);
      })
      setData(arr);
  }

  
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


  const handleGroupButtonClick = (e, currObj) => {
    handleFilter(e, currObj);
    setViewDataBy(prevViewDataBy => (prevViewDataBy === e ? "" : e));

    const updatedGroupKeys = { ...groupKeys };
    if (e === "School Management") {
        updatedGroupKeys.schManagementBroad = !groupKeys.schManagementBroad;
        updatedGroupKeys.schManagementDesc = false;
    } 
    else if (e === "Mgt Details") {
      updatedGroupKeys.schManagementDesc = !groupKeys.schManagementDesc;
      updatedGroupKeys.schManagementBroad = false;
    }

    else if (e === "School Category") {
      updatedGroupKeys.schCategoryDesc =  false;
      updatedGroupKeys.schCategoryBroad =!groupKeys.schCategoryDesc;
    } 
    else if (e === "Cat Details") {
      updatedGroupKeys.schCategoryDesc = !groupKeys.schCategoryDesc;
      updatedGroupKeys.schCategoryBroad = false;
    } 


    else if (e === "School Type") {
        updatedGroupKeys.schTypeDesc = !groupKeys.schTypeDesc;
    } else if (e === "Urban/Rural") {
        updatedGroupKeys.schLocationDesc = !groupKeys.schLocationDesc;
    }

    setGroupKeys(updatedGroupKeys);
    const allFalse = Object.values(updatedGroupKeys).every(value => value === false);
     
    if (viewDataBy === "" && allFalse) {
        schoolLocationRow();
    } else {
      handleCustomKeyInAPIResponse();
      multiGroupingRows();
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
      
      gridApi?.columnApi?.api.setColumnVisible("schManagementBroad", groupKeys.schManagementBroad);
      gridApi?.columnApi?.api.setColumnVisible("schManagementDesc", groupKeys.schManagementDesc);
      gridApi?.columnApi?.api.setColumnVisible("schCategoryBroad", groupKeys.schCategoryBroad);
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
             

                <ul className="nav nav-tabs mul-tab-main">

                  <li className={`nav-item ${multiMgt}`}>
                    <button type="button" className={`nav-link dark-active ${mgt}`}  onClick={(e)=>handleGroupButtonClick("School Management",e)}>School Management(Broad) </button>
                    <button type="button" className={`nav-link dark-active details-multi ${mgt_Details}`} id="school_mgt_details" onClick={(e)=>handleGroupButtonClick("Mgt Details",e)}>Datailed View</button>
                  </li>
                
                  <li className={`nav-item ${multiCat}`}>
                    <button type="button" className={`nav-link dark-active1 ${cat}`}  onClick={(e)=>handleGroupButtonClick("School Category",e)}>School Category(Broad)</button>
                    <button type="button" className={`nav-link details-multi dark-active1 ${cat_Details}`}  onClick={(e)=>handleGroupButtonClick("Cat Details",e)}>Datailed View</button>
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

              <div className="col-md-12 col-lg-12">
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
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="pinnedData">Total</h6>
                        </div>
                        <div className="col-md-6 text-end">
                          <h6 className="pinnedData">{calculateTotal('schHaveElectricity')}</h6>
                        </div>
                      </div>
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
