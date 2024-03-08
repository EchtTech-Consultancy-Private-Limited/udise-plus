import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header',
  initialState: {
    yearId: 8,
    regionType: 10,  //21 //10 for all india 
    regionCode: "99",
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:"n",
    dashboardRegionCode:100
  },


  reducers: {
    changeYearFilter(state, action) {
      console.log("changeYearFilter", state,action)
      state.yearId = action.payload;
    },
    changeDistrictFilter(state, action) {
      state.regionCode = action.payload;
    },
    changeStateFilter(state, action) {
      console.log("changeYearFilter", state,action)
      state.regionType = action.payload;
    },
    allFilter(state, action) {
      console.log("allFilter", action.payload)
      Object.assign(state, action.payload);
    }
  },
})

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, allFilter } = schoolFilterSlice.actions
export default schoolFilterSlice.reducer