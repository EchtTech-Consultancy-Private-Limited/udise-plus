import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header',
  initialState: {
    yearId: 8,
    regionType: 21,  //21statewise //10 for all india 
    regionCode: "11", // 11statewise //99 for all india
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
    dashboardRegionType:"n",
    dashboardRegionCode:100
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

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, allFilter } = schoolFilterSlice.actions
export default schoolFilterSlice.reducer