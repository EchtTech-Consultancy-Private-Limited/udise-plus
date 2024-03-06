import { createSlice } from "@reduxjs/toolkit";

const dashboardFilterSlice = createSlice({
  name: 'header',
  initialState: {
    yearId: 8,
    regionType: "n",
    regionCode: 99,
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    locationCode: 0,
    schoolTypeCode:0
  },


  reducers: {
    changeYearFilter(state, action) {
     
      state.yearId = action.payload;
    },
    changeDistrictFilter(state, action) {
      state.regionCode = action.payload;
    },
    changeStateFilter(state, action) {
     
      state.regionType = action.payload;
    },
    allFilter(state, action) {
      
      Object.assign(state, action.payload);
    }
  },
})

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, allFilter } = dashboardFilterSlice.actions
export default dashboardFilterSlice.reducer