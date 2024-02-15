import { createSlice } from "@reduxjs/toolkit";
import { fetchStateData } from "../thunks/stateThunk";

const stateSlice = createSlice({
  name: "state",
  initialState: {
    data: null,
    isLoading:false,
    isError:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStateData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStateData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchStateData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default stateSlice.reducer;