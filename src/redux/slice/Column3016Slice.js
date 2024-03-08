import { createSlice } from "@reduxjs/toolkit";

const Column3016Slice = createSlice({
    name: 'column/ag-grid',
    initialState:{
        column_mgt:false,
        column_cat:false,
    },
    reducers: {
      hideShowColumnMgt(state,action) {
        state.column_mgt=action.payload;
      },
      hideShowColumnCat(state,action) {
        state.column_cat=action.payload;
      }
    },
  })
  
  export const { hideShowColumnMgt,hideShowColumnCat } = Column3016Slice.actions
  export default Column3016Slice.reducer