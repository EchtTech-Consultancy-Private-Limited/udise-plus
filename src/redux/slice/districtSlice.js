import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictData } from "../thunks/districtThunk";

const distrcitSlice = createSlice({
  name: "district",
  initialState: {
    data: null,
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistrictData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDistrictData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDistrictData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default distrcitSlice.reducer;