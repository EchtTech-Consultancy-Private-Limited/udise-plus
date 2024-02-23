import React, { useEffect,useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from "react-redux";
import { fetchStateData } from "../../redux/thunks/stateThunk";
import { fetchDistrictDataByStateId } from "../../redux/thunks/districtThunk";
import { fetchYearData } from "../../redux/thunks/yearThunk";
import { changeYearFilter,changeStateFilter,allFilter } from "../../redux/slice/schoolFilterSlice";

import {hideShowColumn } from "../../redux/slice/dataGridAPISlice";
import { filterItemsStatePerPage, filterItemsYearPerPage } from "../../constants/constants";
import { fetchBlockByDistrictCode } from "../../redux/thunks/blockThunk";

export default function FilterDropdown() {
  const [itemsPerPage] = useState(filterItemsStatePerPage);
  const [yearItemsPerPage] = useState(filterItemsYearPerPage);
  const dispatch = useDispatch();
  const stateData=useSelector(state=>state.state);
  const yearData=useSelector(state=>state.year);
  const gridApi=useSelector(state=>state.gridApi);
  const schoolFilter=useSelector(state=>state.schoolFilter);
  const districtData=useSelector(state=>state.distrct);
  const blockData=useSelector(state=>state.block);
  const [selectedState,setSelectedState] = useState('All India/National');
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedYear, setSelectedYear] = useState("2020-21");
  const [selectedBlock, setSelectedBlock] = useState("Block");
  const filterObj = structuredClone(schoolFilter);
  useEffect(()=>{
    dispatch(fetchStateData());
    dispatch(fetchYearData());
  },[]);

  const handleSchoolFilterYear = (year,year_report)=>{
    setSelectedYear(year_report);
    dispatch(changeYearFilter(year));
    hideOpendFilterBox();
  }
  const handleSchoolFilterState = (state_id,state_name,state_code)=>{
    setSelectedState(state_name);
    setSelectedDistrict("");
    
   
    // dispatch(changeStateFilter(state_id));
    dispatch(fetchDistrictDataByStateId(state_id));
    if(state_name==="All India/National"){

      filterObj.region_type = "n";
      filterObj.region_code = "99";
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));

    }else if(state_name==="State Wise"){

      filterObj.region_type = "sw";
      filterObj.region_code = "99";
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));

    }else{
      filterObj.region_type = "s";
      filterObj.region_code = state_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
    }
    hideOpendFilterBox();
  }

  const handleSchoolFilterDistrict = (district_name,district_code)=>{
    if(district_name==="District Wise"){
      filterObj.region_type = "dw";
      dispatch(allFilter(filterObj));
      // dispatch(hideShowColumn(true));

    }else{
      filterObj.region_type = "d";
      filterObj.region_code = district_code;
      dispatch(fetchBlockByDistrictCode({district_code:district_code,year_id:filterObj.year_id}));
      dispatch(allFilter(filterObj));
      // dispatch(hideShowColumn(false));
    }
    setSelectedDistrict(district_name);
    hideOpendFilterBox();
  }


  const hideOpendFilterBox = ()=>{
    const boxes = document.querySelectorAll('.dropdown-menu');
    boxes.forEach(box => {
      box.classList.remove('show');
    });
  }

  const renderStateListGroup = () => {
    const groups = [];
    let extra_col = JSON.parse(JSON.stringify(stateData.data.data)); 
    extra_col.unshift({state_id:"sw",state_name:"State Wise"});
    extra_col.unshift({state_id:"n",state_name:"All India/National"});
    for (let i = 0; i < extra_col.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < extra_col.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} onClick={()=>handleSchoolFilterState(extra_col[j].state_id,extra_col[j].state_name,extra_col[j].state_code)}>
            {extra_col[j].state_name}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup >{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  const renderYearListGroup = () => {
    const yearGroups = [];
    for (let i = 0; i < yearData.data.data.length; i += yearItemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + yearItemsPerPage && j < yearData.data.data.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} onClick={()=>handleSchoolFilterYear(yearData.data.data[j].year_id,yearData.data.data[j].report_year)}>
            {yearData.data.data[j].report_year}
          </MDBListGroupItem>
        );
      }
      yearGroups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup >{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return yearGroups;
  };


  const renderDistrictListGroup = () => {
    const groups = [];
    let extra_col = JSON.parse(JSON.stringify(districtData?.data?.data)); 

    extra_col.unshift({udise_district_code:filterObj.region_code,district_name:"District Wise"});

    for (let i = 0; i < extra_col.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < extra_col.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} onClick={()=>handleSchoolFilterDistrict(extra_col[j].district_name,extra_col[j].udise_district_code)}>
            {extra_col[j].district_name}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup >{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  const renderBlockListGroup = () => {
    const groups = [];
    for (let i = 0; i < blockData?.data?.data.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < blockData?.data?.data?.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} onClick={()=>handleSchoolFilterDistrict(blockData?.data?.data[j].udiseBlockCode,blockData?.data?.data[j].udiseBlockName)}>
            {blockData?.data?.data[j].udiseBlockName}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup >{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  return (
    <>
      <div className="filter_drodown">
        <div className="filter-content">
          <h6 className="mb-0">Apply Filters</h6>
          <div className="select-box from-control">
            <MDBNavbar expand='lg' light>
              <MDBContainer fluid className="p-0">
                <MDBNavbarNav className='me-auto ps-lg-0'>

                  <MDBNavbarItem className='position-static'>
                    <MDBDropdown>
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select State</div>
                       {selectedState}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className='mt-0 w-100 justify-content-center'
                        style={{
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                        }}
                      >
                        <MDBContainer className="droplist">
                          <MDBRow className='my-1'>
                      
                          {<>{renderStateListGroup()}</>}
                           
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>
                  
                  <MDBNavbarItem className='position-static'>
                    <MDBDropdown className="disabled">
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select District</div>
                       {selectedDistrict}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className='mt-0 w-100 justify-content-center'
                        style={{
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                        }}
                      >
                        <MDBContainer className="droplist">
                          <MDBRow className='my-1'>
                      
                          {<>{renderDistrictListGroup()}</>}
                           
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>

                  <MDBNavbarItem className='position-static'>
                    <MDBDropdown className="disabled">
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select Block</div>
                       {selectedBlock}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className='mt-0 w-100 justify-content-center'
                        style={{
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                        }}
                      >
                        <MDBContainer className="droplist">
                          <MDBRow className='my-1'>
                      
                          {<>{renderBlockListGroup()}</>}
                           
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>
                  



                  <MDBNavbarItem className='position-static'>
                    <MDBDropdown>
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select Year</div>
                       {selectedYear}
                      </MDBDropdownToggle>
                      <MDBDropdownMenu
                        className='mt-0 w-100 justify-content-center'
                        style={{
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',  
                        }}>
                        <MDBContainer className="droplist">
                          <MDBRow className='my-1'>
                           

                           {<>{renderYearListGroup()}</>}
                         
                           
                          </MDBRow>
                        </MDBContainer>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>


                </MDBNavbarNav>
              </MDBContainer>
            </MDBNavbar>
          </div>
        </div>





      </div>
    </>
  )
}