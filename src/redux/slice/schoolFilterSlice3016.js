import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header/report-3016',
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
    allFilter(state, action) {
      Object.assign(state, action.payload);
    }
  },
})

export const {allFilter } = schoolFilterSlice.actions
export default schoolFilterSlice.reducer