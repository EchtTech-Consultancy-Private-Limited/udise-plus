import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tableicon from "../../assets/images/table_cells.png";
import Download from "../../assets/images/download.png";
import graph from "../../assets/images/circular-graphic.png";
import { Link } from "react-router-dom";
import allreportsdata from "../../json-data/allreports.json";
import udise_2021_22_Booklet from "../../assets/document/UDISE+2021_22_Booklet.pdf";
import udise_2020_21_Booklet from "../../assets/document/UDISE+2020_21_Booklet.pdf";
import udise_2019_20_Booklet from "../../assets/document/UDISE+2019_20_Booklet.pdf";
import udise_2018_19_Booklet from "../../assets/document/UDISE+2018_19_Booklet.docx";
import { ScrollToTopOnMount } from "../Scroll/ScrollToTopOnMount";
import { useTranslation } from "react-i18next";

export default function Reports() {
  const [reportList, setReportList] = useState(allreportsdata);
  const [cloneReportList] = useState(allreportsdata);
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("2021");
  const [reportType, setReportType] = useState("All");
  const handleReportType = (e) => {
    setReportType(e.target.value);
  };

  const handleFilterReport = () => {
    let isBlockTrue = false;
    let input_search = "";
    Object.keys(cloneReportList).forEach((category) => {
      if (isBlockTrue === false) {
        if (reportType === "All") {
          setReportList(cloneReportList);
          isBlockTrue = true;
        } else {
          if (reportType === category) {
            setReportList({ [reportType]: cloneReportList[category] });
            isBlockTrue = true;
            input_search = { [reportType]: cloneReportList[category] };
          }
        }
      }
    });
    if (searchQuery !== "") {
      if (reportType === "All") {
        handleSearch(cloneReportList);
      } else {
        handleSearch(input_search);
      }
    }
  };

  const handleSearch = (input_search) => {
    const filteredResults = {};
    Object.keys(input_search).forEach((category) => {
      const categoryResults = input_search[category].filter((report) =>
        report.report_name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      );
      if (categoryResults.length > 0) {
        filteredResults[category] = categoryResults;
      }
    });
    setReportList(filteredResults);
  };

  const handleDownloadReport = (e) => {
    e.preventDefault();
    let doc_path = "";
    let file_name = "";

    if (year === "2021") {
      doc_path = udise_2021_22_Booklet;
      file_name = "udise_2021_22_Booklet.pdf";
    } else if (year === "2020") {
      doc_path = udise_2020_21_Booklet;
      file_name = "udise_2020_21_Booklet.pdf";
    } else if (year === "2019") {
      doc_path = udise_2019_20_Booklet;
      file_name = "udise_2019_20_Booklet.pdf";
    } else {
      doc_path = udise_2018_19_Booklet;
      file_name = "udise_2018_19_Booklet.docx";
    }
    downloadReport(doc_path, file_name);
  };

  const downloadReport = (doc_path, file_name) => {
    const link = document.createElement("a");
    link.href = doc_path;
    document.body.appendChild(link);
    link.download = file_name;
    link.click();
    document.body.removeChild(link);
  };
  const { t } = useTranslation();

  return (
    <>
    <ScrollToTopOnMount/>
      <section className="infrastructure-main-card p-0" id="content">
        <div className="bg-grey ptb-30">
          <div className="container tab-for-graph">
            <div className="row align-items-center">
              <div className="col-md-12 col-lg-12">
                <div className="common-content text-start map-heading-map">
                  <h2 className="heading-sm mb-4">{t("all_reports_page.reports")}</h2>
                </div>
              </div>

              <div className="col-md-6 col-lg-6">
                <div className="filter-card">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h2 className="heading-sm1 mb-2">{t("all_reports_page.search_for_reports")}</h2>
                      <input
                        type="search"
                        className="form-control border-only-bottom"
                        placeholder="Search"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <div className="button-group-filter mt-3 pt-1">
                        <div className="indicator-select">
                          <label className="bg-grey2">Tags</label>
                          <select
                            className="form-select bg-grey2"
                            onChange={handleReportType}
                          >
                            <option value="All">All Reports</option>
                            <option value="School">School</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Infrastructure">
                              Infrastructure
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-3 mt-3 pt-1">
                      <button
                        className="header-dropdown-btn"
                        onClick={handleFilterReport}>
                        SUBMIT
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-6">
                <div className="filter-card">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <h2 className="heading-sm1" style={{ whiteSpace: 'pre-line' }}>
                        {t("all_reports_page.download_udise_yearly_report")}
                      </h2>
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <div className="button-group-filter mt-2 mb-2 pt-1">
                        <div className="indicator-select">
                          <label className="bg-grey2">Select Year</label>
                          <select
                            className="form-select bg-grey2"
                            onChange={(e) => setYear(e.target.value)}
                          >
                            <option value="2021">2021-2022</option>
                            <option value="2020">2020-2021</option>
                            <option value="2019">2019-2020</option>
                            <option value="2018">2018-2019</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-3 mt-2 mb-2 pt-1">
                      <button
                        className="header-dropdown-btn"
                        onClick={handleDownloadReport}
                      >
                        DOWNLOAD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(reportList).map((category) => (
              <div className="Allreport-table-card mb-4">
                <div className="col-md-12">
                  <TableContainer className="mt-4">
                    <Table className="table-bordered">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={5}>
                            {" "}
                            <h2 className="heading-sm heading-sm2">
                              {category}
                            </h2>{" "}
                          </TableCell>
                        </TableRow>
                        <TableRow className="">
                          <TableCell className="bg-grey2">S.no</TableCell>
                          <TableCell className="bg-grey2">Id</TableCell>
                          <TableCell className="bg-grey2 report-name-width-50">
                            Report Name
                          </TableCell>
                          <TableCell className="bg-grey2">Tags</TableCell>
                          <TableCell className="bg-grey2">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportList[category].map((report, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{report.id}</TableCell>
                            <TableCell>{report.report_name}</TableCell>
                            <TableCell>{report.tags}</TableCell>
                            <TableCell className="text-nowrap">
                              <Link
                                className="action-icon"
                                to={`/${report.url}?id=${report.id}&type=table`}
                              >
                                <img src={Tableicon} alt="" />
                              </Link>
                              <Link
                                className="action-icon"
                                to={`/${report.url}?id=${report.id}&type=graph`}
                              >
                                <img src={graph} alt="" />
                              </Link>
                              <Link
                                className="action-icon"
                                to={`/${report.url}?id=${report.id}&type=about`}
                              >
                                <img src={Download} alt="" />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
  