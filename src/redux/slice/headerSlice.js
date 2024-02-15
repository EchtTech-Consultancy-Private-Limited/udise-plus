import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name: 'header',
    initialState:{
        headerName:"Education Dashboard",
        removeBeforeAfterClass:'main-card-home'
    },
    reducers: {
      updateHeaderName(state,action) {
        state.headerName=action.payload;
      },
      removeBeforeAfterClass(state,action){
        state.removeBeforeAfterClass=action.payload
      }
    },
  })
  
  export const { updateHeaderName,removeBeforeAfterClass } = headerSlice.actions
  export default headerSlice.reducer