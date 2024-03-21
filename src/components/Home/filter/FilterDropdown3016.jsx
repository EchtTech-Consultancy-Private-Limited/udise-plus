import React, { useEffect, useState } from "react";
import {
  district,
  block,
  nWiseregionType,
  nWiseregionCode,
  selectedDYear,
  allSWiseregionType,
  allSWiseregionCode,
  specificSWiseregionType,
  allDWiseregionType,
  specificDWiseregionType,
  allBWiseregionType,
  specificBWiseregionType,
  nationalWiseName,
  stateWiseName,
  districtWiseName,
  blockWiseName,
} from "../../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStateData,
  updateFilterState,
} from "../../../redux/thunks/stateThunk";
import {
  fetchDistrictDataByStateCode,
  removeAllDistrict,
  updateFilterDistrict,
} from "../../../redux/thunks/districtThunk";
import { fetchYearData } from "../../../redux/thunks/yearThunk";
import { allFilter } from "../../../redux/slice/schoolFilterSlice3016";
import { hideShowColumn } from "../../../redux/slice/dataGridAPISlice";
import {
  updateUdiseBlockCode,
  updateUdiseDistrictCode,
} from "../../../redux/slice/DistBlockWiseSlice";
import {
  fetchBlockByDistrictCode,
  removeAllBlock,
  updateFilterBlock,
} from "../../../redux/thunks/blockThunk";
import { Select } from "antd";
export default function FilterDropdown() {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state.state);
  const stateDataClone = useSelector((state) => state.state.dataClone);
  const yearData = useSelector((state) => state.year);
  const schoolFilter = useSelector((state) => state.schoolFilter);
  const districtData = useSelector((state) => state.distrct);
  const districtDataClone = useSelector((state) => state.distrct.dataClone);
  const blockData = useSelector((state) => state.block);
  const blockDataClone = useSelector((state) => state.block.dataClone);
  const [selectedState, setSelectedState] = useState(nationalWiseName);
  const [selectedStateW, setSelectedStateW] = useState("State Wise");
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [selectedDistrictclone, setSelectedDistrictClone] = useState(district);
  const [selectedYear, setSelectedYear] = useState(selectedDYear);
  const [selectedBlock, setSelectedBlock] = useState(block);
  const [selectedBlockClone, setSelectedBlockClone] = useState(block);
  const distBlockWiseData = useSelector((state) => state.distBlockWise);
  const filterObj = structuredClone(schoolFilter);
  window.localStorage.setItem("state", selectedState);
  window.localStorage.setItem("state_wise", selectedStateW);
  window.localStorage.setItem("district", selectedDistrict);
  window.localStorage.setItem("block", selectedBlock);
  window.localStorage.setItem("year", selectedYear);
 
  useEffect(() => {
    dispatch(fetchStateData(filterObj.yearId));
    dispatch(fetchYearData());
    const children = document.getElementsByClassName("position-static");
    let filter_drodown = document.getElementsByClassName("filter_drodown")[0];
    if (children.length == 2) {
      filter_drodown?.classList?.add("small-filter-box");
    } else {
      filter_drodown?.classList?.remove("small-filter-box");
    }

    document.getElementById('content').addEventListener("click",function(e){
      setShow(false);
    })
    return ()=>{
      document.getElementById('content').removeEventListener('click');
    }
  }, []);

  const handleSchoolFilterYear = (e) => {
    const splittedArr = e.split("@");
    const year = splittedArr[0];
    const year_report = splittedArr[1];
    setSelectedYear(year_report);
    filterObj.yearId = year;
    dispatch(allFilter(filterObj));
    window.localStorage.setItem("year", year_report);
    hideOpendFilterBox();
  };
  const handleSchoolFilterState = (e) => {
    const splittedArr = e.split("@");
    const state_code = splittedArr[0];
    const state_name = splittedArr[1];
    setSelectedState(state_name);
    setSelectedStateW(state_name);
    setSelectedDistrict(district);
    setSelectedBlock(block);
    setSelectedBlockClone(block);
    //
    dispatch(updateUdiseDistrictCode(state_code));
    //
    /*--------------------Filter by National----------------------*/
    if (state_name === nationalWiseName) {
      filterObj.regionType = nWiseregionType;
      filterObj.regionCode = nWiseregionCode;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else if (state_name === stateWiseName) {
      /*--------------------Filter by State Wise----------------------*/
      filterObj.regionType = allSWiseregionType;
      filterObj.regionCode = allSWiseregionCode;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(district);
    } else {
      /*--------------------Filter by Particular State ----------------------*/
      filterObj.regionType = specificSWiseregionType;
      filterObj.regionCode = state_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
      dispatch(
        fetchDistrictDataByStateCode({
          state_code: state_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(removeAllDistrict());
      dispatch(removeAllBlock());
      setSelectedDistrictClone(state_name);
    }
    dispatch(updateFilterState(stateDataClone.data));
    window.localStorage.setItem("state", state_name);
    hideOpendFilterBox();
  };
  const handleSchoolFilterDistrict = (e) => {
    const splittedArr = e.split("@");
    const district_code = splittedArr[0];
    const district_name = splittedArr[1];
    dispatch(updateUdiseBlockCode(district_code));
    if (district_name === districtWiseName) {
      filterObj.regionType = allDWiseregionType;
      filterObj.regionCode = district_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
      dispatch(removeAllBlock());
      setSelectedBlockClone(block);
    } else {
      filterObj.regionType = specificDWiseregionType;
      filterObj.regionCode = district_code;
      dispatch(
        fetchBlockByDistrictCode({
          district_code: district_code,
          yearId: filterObj.yearId,
        })
      );
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
      setSelectedBlockClone(district_name);
    }
    dispatch(updateFilterDistrict(districtDataClone.data));
    dispatch(removeAllBlock());
    setSelectedDistrict(district_name);
    setSelectedBlock(block);
    window.localStorage.setItem("district", district_name);
    hideOpendFilterBox();
  };
  const handleSchoolFilterBlock = (e) => {
    const splittedArr = e.split("@");
    const block_code = splittedArr[0];
    const block_name = splittedArr[1];
    if (block_name === blockWiseName) {
      filterObj.regionType = allBWiseregionType;
      filterObj.regionCode = block_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(true));
    } else {
      filterObj.regionType = specificBWiseregionType;
      filterObj.regionCode = block_code;
      dispatch(allFilter(filterObj));
      dispatch(hideShowColumn(false));
    }
    dispatch(updateFilterBlock(blockDataClone.data));
    setSelectedBlock(block_name);
    window.localStorage.setItem("block", block_name);
    hideOpendFilterBox();
  };
  //
  const stateDropdownOptions = () => {
    let extra_col;
    if (stateData.data && stateData.data.data) {
      extra_col = JSON.parse(JSON.stringify(stateData.data.data));
    } else {
      extra_col = [];
    }
    extra_col.unshift({
      udiseStateCode: allSWiseregionType.toString(),
      udiseStateName: stateWiseName,
    });
    extra_col.unshift({
      udiseStateCode: nWiseregionType.toString(),
      udiseStateName: nationalWiseName,
    });
    return extra_col;
  };
  const districtDropdownOptions = () => {
    let extra_col;
    if (districtData.data && districtData.data.data) {
      extra_col = JSON.parse(JSON.stringify(districtData?.data?.data));
    } else {
      extra_col = [];
    }
    if (selectedDistrictclone !== district) {
      extra_col.unshift({
        udiseDistrictCode: distBlockWiseData.districtUdiseCode,
        udiseDistrictName: "District Wise",
      });
    }
    return extra_col;
  };
  const blockDropdownOptions = () => {
    let extra_col;
    if (blockData.data && blockData.data.data) {
      extra_col = JSON.parse(JSON.stringify(blockData.data.data));
    } else {
      extra_col = [];
    }
    if (selectedBlockClone !== block) {
      extra_col.unshift({
        udiseBlockCode: distBlockWiseData.blockUdiseCode,
        udiseBlockName: "Block Wise",
      });
    }
    return extra_col;
  };
  //
  const hideOpendFilterBox = () => {
    const boxes = document.querySelectorAll(".dropdown-menu");
    boxes.forEach((box) => {
      box.classList.remove("show");
    });
  };
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="Side_filter" onClick={() => setShow(!show)}>
        <div className="open-btn">
          {!show ? (
            <span className="material-icons-round">sort</span>
          ) : (
            <span className="material-icons-round">expand_more</span>
          )}
        </div>
      </div>
      <div
        className={`custmize-filter-column ${show ? "show" : ""}`}
        id="customize_filter"
      >
        <div className="search-f-box">
          <div className="heading-sm main-title d-flex align-items-center">
            <span className="material-icons-round text-blue me-3">sort</span>{" "}
            Apply Filters
          </div>
          <div className="box-cont-cust">
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select Year</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedYear}
                value={selectedYear}
                onChange={handleSchoolFilterYear}
                style={{
                  width: "100%",
                }}
                options={yearData?.data?.data.map((item) => ({
                  value: item.year_id + "@" + item.report_year,
                  label: item.report_year,
                }))}
              />
            </div>
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select State</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedState}
                value={selectedState}
                onChange={handleSchoolFilterState}
                style={{
                  width: "100%",
                }}
                options={stateDropdownOptions().map((item) => ({
                  value: item.udiseStateCode + "@" + item.udiseStateName,
                  label: item.udiseStateName,
                }))}
              />
            </div>
            <div className="search-box-div mb-3">
              <span className="select-lable-title">Select District</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder={selectedDistrict}
                value={selectedDistrict}
                onChange={handleSchoolFilterDistrict}
                style={{
                  width: "100%",
                }}
                options={districtDropdownOptions().map((item) => ({
                  value: item.udiseDistrictCode + "@" + item.udiseDistrictName,
                  label: item.udiseDistrictName,
                }))}
              />
            </div>
            <div className="search-box-div">
              <span className="select-lable-title">Select Block</span>
              <Select
                mode="single"
                showSearch={true}
                placeholder="Inserted are removed"
                value={selectedBlock}
                onChange={handleSchoolFilterBlock}
                style={{
                  width: "100%",
                }}
                options={blockDropdownOptions().map((item) => ({
                  value: item.udiseBlockCode + "@" + item.udiseBlockName,
                  label: item.udiseBlockName,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
