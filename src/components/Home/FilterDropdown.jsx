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
import { fetchYearData } from "../../redux/thunks/yearThunk";

export default function FilterDropdown() {
  const [itemsPerPage] = useState(10);
  const [yearItemsPerPage] = useState(4);
  const dispatch = useDispatch();
  const stateData=useSelector(state=>state.state);
  const yearData=useSelector(state=>state.year);

  useEffect(()=>{
    dispatch(fetchStateData());
    dispatch(fetchYearData());
  },[]);



  const renderStateListGroup = () => {
    const groups = [];
    for (let i = 0; i < stateData.data.length; i += itemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + itemsPerPage && j < stateData.data.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} tag='a' href='#' action>
            {stateData.data[j].state_name}
          </MDBListGroupItem>
        );
      }
      groups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup flush>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return groups;
  };

  const renderYearListGroup = () => {
    const yearGroups = [];
    for (let i = 0; i < yearData.data.length; i += yearItemsPerPage) {
      const groupItems = [];
      for (let j = i; j < i + yearItemsPerPage && j < yearData.data.length; j++) {
        groupItems.push(
          <MDBListGroupItem key={j} tag='a' href='#' action>
            {yearData.data[j].report_year}
          </MDBListGroupItem>
        );
      }
      yearGroups.push(
        <MDBCol key={i} md='6' lg='4' className='mb-3 mb-lg-0'>
          <MDBListGroup flush>{groupItems}</MDBListGroup>
        </MDBCol>
      );
    }
    return yearGroups;
  };


  return (
    <>
      <div className="filter_drodown">
        <div className="filter-content">
          <h6 className="mb-0">Apply Filters</h6>
          <div className="select-box from-control">
            <MDBNavbar expand='lg' light>
              <MDBContainer fluid>
                <MDBNavbarNav className='me-auto ps-lg-0'>

                  <MDBNavbarItem className='position-static'>
                    <MDBDropdown>
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select State</div>
                       National
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
                    <MDBDropdown>
                      <MDBDropdownToggle tag='a' className='nav-link'>
                       <div className="menu-sub-heading">Select Year</div>
                       2019-2020
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