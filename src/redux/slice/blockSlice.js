import { createSlice } from "@reduxjs/toolkit";
import {fetchBlockByDistrictCode} from "../thunks/blockThunk";

const blockSlice = createSlice({
  name: "block",
  initialState: {
    data:[],
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
        state.data = action.payload;
      })
      .addCase(fetchBlockByDistrictCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data.data = [];
      });
  },
});

export default blockSlice.reducer;