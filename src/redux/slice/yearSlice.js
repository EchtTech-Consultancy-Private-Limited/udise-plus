import { createSlice } from "@reduxjs/toolkit";
import { fetchYearData } from "../thunks/yearThunk";

const yearSlice = createSlice({
  name: "year",
  initialState: {
    data: {
      data:[{
        "id": 1,
        "report_year": "",
        "year_id": 0
      }],
      statusCode:0,
      message:"",
      success:false
    },

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