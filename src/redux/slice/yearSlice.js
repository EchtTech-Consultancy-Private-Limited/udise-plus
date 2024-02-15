import { createSlice } from "@reduxjs/toolkit";
import { fetchYearData } from "../thunks/yearThunk";

const yearSlice = createSlice({
  name: "year",
  initialState: {
    data: [{
      "id": 0,
      "report_year": "",
      "year_id": 0
  }],
    isLoading:false,
    isError:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchYearData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchYearData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default yearSlice.reducer;