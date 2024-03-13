import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
  name: 'header/report-3016',
  initialState: {
    yearId: 8,
    regionType: 10,  //21 //10 for all india 
    regionCode: "99",
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    schoolTypeCode:0,
  },


  reducers: {
    allFilter(state, action) {
      Object.assign(state, action.payload);
    }
  },
})

export const {  allFilter } = schoolFilterSlice.actions
export default schoolFilterSlice.reducer