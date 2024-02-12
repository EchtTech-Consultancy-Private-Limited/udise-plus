import React from "react";
import {
  MDBContainer,
  MDBCol,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from 'mdb-react-ui-kit';

export default function FilterDropdown() {
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
                        <MDBContainer>
                          <MDBRow className='my-2'>
                            <MDBCol md='6' lg='4' className='mb-3 mb-lg-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Lorem ipsum
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Dolor sit
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Amet consectetur
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Adipisicing elit
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                            <MDBCol md='6' lg='4' className='mb-3 mb-lg-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Explicabo voluptas
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Perspiciatis quo
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Laudantium maiores
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Provident dolor
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                            <MDBCol md='6' lg='4' className='mb-3 mb-md-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Iste quaerato
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Est iure
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Praesentium
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Laboriosam
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                           
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
                        }}
                      >
                        <MDBContainer>
                          <MDBRow className='my-2'>
                            <MDBCol md='6' lg='4' className='mb-3 mb-lg-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Lorem ipsum
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Dolor sit
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Amet consectetur
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Adipisicing elit
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                            <MDBCol md='6' lg='4' className='mb-3 mb-lg-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Explicabo voluptas
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Perspiciatis quo
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Laudantium maiores
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Provident dolor
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                            <MDBCol md='6' lg='4' className='mb-3 mb-md-0'>
                              <MDBListGroup flush>
                                <MDBListGroupItem className='text-uppercase font-weight-bold' tag='a' href='#' action>
                                  Iste quaerato
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Cras justo odio
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Est iure
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Praesentium
                                </MDBListGroupItem>
                                <MDBListGroupItem tag='a' href='#' action>
                                  Laboriosam
                                </MDBListGroupItem>
                              </MDBListGroup>
                            </MDBCol>
                           
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