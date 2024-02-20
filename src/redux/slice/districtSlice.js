import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictData,fetchDistrictDataByStateId } from "../thunks/districtThunk";

const distrcitSlice = createSlice({
  name: "district",
  initialState: {
    data:{
      data:[{
        "id": "0",
        "district_id": 0,
        "udise_district_code": 0,
        "udise_state_code": 0,
        "state_id": 0,
        "district_name": "",
        "inityear": ""
    }],
    statusCode:0,
    message:"",
    success:false
    },
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(fetchDistrictData.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(fetchDistrictData.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.data = action.payload;
      // })
      // .addCase(fetchDistrictData.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      // })

      .addCase(fetchDistrictDataByStateId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDistrictDataByStateId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDistrictDataByStateId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default distrcitSlice.reducer;