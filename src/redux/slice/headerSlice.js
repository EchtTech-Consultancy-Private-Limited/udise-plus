import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name: 'header',
    initialState:{
        headerName:"Education Dashboard"
    },
    reducers: {
      updateHeaderName(state,action) {
        state.headerName=action.payload;
      },
    },
  })
  
  export const { updateHeaderName } = headerSlice.actions
  export default headerSlice.reducer