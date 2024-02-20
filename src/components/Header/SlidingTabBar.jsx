import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDispatch } from "react-redux";
import { updateHeaderName } from "../../redux/slice/headerSlice";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { urls } from "../../constants/constants";
import { useSelector } from "react-redux";

export default function SlidingTabBar() {
  const header_name = useSelector((state) => state.header);

  const location = useLocation();
  const navigate = useNavigate();
  const path_name = location.pathname.split("-")[0]?.toUpperCase()?.slice(1);
  const dispatch = useDispatch();

  function handleSelect(e) {
    dispatch(updateHeaderName(e));
    navigate("/");
  }
  function handleNavigate(e) {
    dispatch(updateHeaderName(e));
  }
  return (
    <>
      {urls.includes(location.pathname) ? (
        <>
          <div className="header-breadcrumb">
            <div className="title-brd">
              <Link
                to="/reports"
                className="text-black"
                onClick={() => handleNavigate("All Reports")}
              >
                Reports
              </Link>{" "}
              <span className="material-icons-round">chevron_right</span>{" "}
              <span className="internalpagename">{path_name}</span>{" "}
            </div>
          </div>
        </>
      ) : (
        <Tabs
          defaultActiveKey={header_name.headerName}
          id="uncontrolled-tab-example"
          onSelect={(e) => handleSelect(e)}
        >
          <Tab eventKey="Education Dashboard" title="Education Dashboard"></Tab>
          <Tab eventKey="School Dashboard" title="School Dashboard"></Tab>
          <Tab eventKey="Teacher Dashboard" title="Teacher Dashboard"></Tab>
          <Tab eventKey="Student Dashboard" title="Student Dashboard"></Tab>
          <Tab eventKey="All Reports" title="All Reports"></Tab>
        </Tabs>
      )}
    </>
  );
}
