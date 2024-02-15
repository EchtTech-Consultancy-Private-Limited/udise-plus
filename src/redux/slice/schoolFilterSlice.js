import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
    name: 'header',
    initialState:{
      year_id: 9,
      region_type: "sw",
      region_code: 99,
      category_code: 0,
      management_code: 0,
    },
    reducers: {
      changeYearFilter(state,action) {
        state.year_id=action.payload;
      },
      changeStateFilter(state,action) {
        state.region_type=action.payload;
      },
    },
  })
  
  export const { changeYearFilter,changeStateFilter } = schoolFilterSlice.actions
  export default schoolFilterSlice.reducer