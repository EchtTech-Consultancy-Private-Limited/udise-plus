import { createSlice } from "@reduxjs/toolkit";

const testschoolFilterSlice = createSlice({
  name: 'header',
  initialState: {
    yearId: 8,
    regionType: 21,
    regionCode: 99,
    categoryCode: 0,
    managementCode: 0,
    locationCode: 0,
    locationCode: 0
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

export const { changeYearFilter, changeDistrictFilter, changeStateFilter, allFilter } = testschoolFilterSlice.actions
export default testschoolFilterSlice.reducer