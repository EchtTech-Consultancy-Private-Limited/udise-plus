import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tableicon from '../../assets/images/table_cells.png'
import Download from '../../assets/images/download.png'
import graph from '../../assets/images/circular-graphic.png'
import { Link } from "react-router-dom";

export default function Reports() {

    return (     
        <> 
        <section className="infrastructure-main-card p-0">
            <div className="bg-grey ptb-30">
                <div className="container tab-for-graph">
                    <div className="row align-items-center">
                        <div className="col-md-12 col-lg-12">
                            <div className="common-content text-start map-heading-map">
                                <h2 className="heading-sm mb-4">
                                    Reports
                                </h2>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-6">
                            <div className="filter-card">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h2 className="heading-sm1 mb-2">Search For Reports</h2>
                                        <input type="search" className="form-control border-only-bottom" placeholder="Search" />
                                    </div>
                                    <div className="col-md-3 col-lg-3">
                                        <div className="button-group-filter mt-3 pt-1">
                                            <div className="indicator-select">
                                                <label className="bg-grey2">Tags</label>
                                                <select className="form-select bg-grey2">
                                                    <option value="All Reports">All Reports</option>
                                                    <option value="">Report 1</option>
                                                    <option value="">Report 2</option>
                                                    <option value="">Report 3</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-lg-3 mt-3 pt-1">
                                        <button className="header-dropdown-btn">SUBMIT</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-6">
                            <div className="filter-card">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <h2 className="heading-sm1">Download UDISE+ <br /> Yearly Report</h2>
                                    </div>
                                    <div className="col-md-3 col-lg-3">
                                        <div className="button-group-filter mt-2 mb-2 pt-1">
                                            <div className="indicator-select">
                                                <label className="bg-grey2">Select Year</label>
                                                <select className="form-select bg-grey2">
                                                    <option value="All Reports">2019-2020</option>
                                                    <option value="">2018-2019</option>
                                                    <option value="">2017-2018</option>
                                                    <option value="">2016-2017</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-lg-3 mt-2 mb-2 pt-1">
                                        <button className="header-dropdown-btn">DOWNLOAD</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="Allreport-table-card mb-4">
                        <div className="col-md-12">
                            <TableContainer className="mt-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={5}> <h2 className="heading-sm heading-sm2">Frequently Used Reports</h2> </TableCell>
                                        </TableRow>
                                        <TableRow className="">
                                            <TableCell className="bg-grey2">S.no</TableCell>
                                            <TableCell className="bg-grey2">Id</TableCell>
                                            <TableCell className="bg-grey2">Report Name</TableCell>
                                            <TableCell className="bg-grey2">Tags</TableCell>
                                            <TableCell className="bg-grey2">Action</TableCell>                                          
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>3016</TableCell>
                                            <TableCell>Number of Schools having Electricity Connection by School Category and Management</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/all-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/all-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/all-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>2</TableCell>
                                            <TableCell>1005</TableCell>
                                            <TableCell>Number of Schools by Type of School and School Category</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/school-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>3</TableCell>
                                            <TableCell>1003</TableCell>
                                            <TableCell>Number of Schools by School Management and School Category</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/school-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>4</TableCell>
                                            <TableCell>2008</TableCell>
                                            <TableCell>Number of Teachers by Social Category , Gender and School Management</TableCell>
                                            <TableCell>Teacher</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>5</TableCell>
                                            <TableCell>2007</TableCell>
                                            <TableCell>Pupil Teacher Ratio (PTR)</TableCell>
                                            <TableCell>Teacher</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                      
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <div className="Allreport-table-card mb-4">
                        <div className="col-md-12">
                            <TableContainer className="mt-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={5}> <h2 className="heading-sm heading-sm2">School</h2> </TableCell>
                                        </TableRow>
                                        <TableRow className="">
                                            <TableCell className="bg-grey2">S.no</TableCell>
                                            <TableCell className="bg-grey2">Id</TableCell>
                                            <TableCell className="bg-grey2">Report Name</TableCell>
                                            <TableCell className="bg-grey2">Tags</TableCell>
                                            <TableCell className="bg-grey2">Action</TableCell>                                          
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>                                        
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>1005</TableCell>
                                            <TableCell>Number of Schools by Type of School and School Category</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/school-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>2</TableCell>
                                            <TableCell>1003</TableCell>
                                            <TableCell>Number of Schools by School Management and School Category</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/school-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/school-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>                                                                           
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <div className="Allreport-table-card mb-4">
                        <div className="col-md-12">
                            <TableContainer className="mt-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={5}> <h2 className="heading-sm heading-sm2">Teacher</h2> </TableCell>
                                        </TableRow>
                                        <TableRow className="">
                                            <TableCell className="bg-grey2">S.no</TableCell>
                                            <TableCell className="bg-grey2">Id</TableCell>
                                            <TableCell className="bg-grey2">Report Name</TableCell>
                                            <TableCell className="bg-grey2">Tags</TableCell>
                                            <TableCell className="bg-grey2">Action</TableCell>                                          
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>2008</TableCell>
                                            <TableCell>Number of Teachers by Social Category , Gender and School Management</TableCell>
                                            <TableCell>Teacher</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>2</TableCell>
                                            <TableCell>2007</TableCell>
                                            <TableCell>Pupil Teacher Ratio (PTR)</TableCell>
                                            <TableCell>Teacher</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/teacher-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>
                                      
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <div className="Allreport-table-card mb-4">
                        <div className="col-md-12">
                            <TableContainer className="mt-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={5}> <h2 className="heading-sm heading-sm2">Infrastructure</h2> </TableCell>
                                        </TableRow>
                                        <TableRow className="">
                                            <TableCell className="bg-grey2">S.no</TableCell>
                                            <TableCell className="bg-grey2">Id</TableCell>
                                            <TableCell className="bg-grey2">Report Name</TableCell>
                                            <TableCell className="bg-grey2">Tags</TableCell>
                                            <TableCell className="bg-grey2">Action</TableCell>                                          
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>1</TableCell>
                                            <TableCell>3013</TableCell>
                                            <TableCell>Number of Schools by Availability of Infrastructure and Facilities, School Management and School Category</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/infrastructure-reports3013"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/infrastructure-reports3013"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/infrastructure-reports3013"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>                                      
                                        <TableRow>
                                            <TableCell>2</TableCell>
                                            <TableCell>3016</TableCell>
                                            <TableCell>Number of Schools having Electricity Connection by School Category and Management</TableCell>
                                            <TableCell>School</TableCell>
                                            <TableCell>
                                                <Link className="action-icon" to="/all-reports"><img src={Tableicon} alt="" /></Link>
                                                <Link className="action-icon" to="/all-reports"><img src={graph} alt="" /></Link>
                                                <Link className="action-icon" to="/all-reports"><img src={Download} alt="" /></Link>
                                            </TableCell>                                          
                                        </TableRow>                                      
                                      
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                </div>
            </div>

        </section>

        </> 
    )
}