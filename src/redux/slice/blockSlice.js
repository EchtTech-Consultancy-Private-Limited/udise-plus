import { createSlice } from "@reduxjs/toolkit";
import {fetchBlockByDistrictCode,removeAllBlock} from "../thunks/blockThunk";

const blockSlice = createSlice({
  name: "block",
  initialState: {
    data:{
      data:[]
    },
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockByDistrictCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockByDistrictCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchBlockByDistrictCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data.data = [];
      })
       /*<><><><><><><><><><><><><><><>Make District List Blank<><><><><><><><><><><><><><><><><>*/ 
       .addCase(removeAllBlock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.data = [];
      })
  },
});

export default blockSlice.reducer;