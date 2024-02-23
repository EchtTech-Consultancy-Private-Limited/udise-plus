import { createSlice } from "@reduxjs/toolkit";

const schoolFilterSlice = createSlice({
    name: 'header',
    initialState:{
      year_id: 8,
      region_type: "sw",
      region_code: 99,
      category_code: 0,
      management_code: 0,
      location_code:0,
      school_type_code:0
    },
    reducers: {
      changeYearFilter(state,action) {
        state.year_id=action.payload;
      },
      changeDistrictFilter(state,action) {
        state.region_code=action.payload;
      },
      changeStateFilter(state,action) {
        state.region_type=action.payload;
      },
      allFilter(state,action){
        Object.assign(state, action.payload);
      }
    },
  })
  
  export const { changeYearFilter,changeDistrictFilter,changeStateFilter,allFilter } = schoolFilterSlice.actions
  export default schoolFilterSlice.reducer