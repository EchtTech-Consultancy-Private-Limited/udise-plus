import { createSlice } from "@reduxjs/toolkit";
import { fetchDistrictDataByStateCode,removeAllDistrict } from "../thunks/districtThunk";

const distrcitSlice = createSlice({
  name: "district",
  initialState: {
    data:{
      data:[],
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
      .addCase(fetchDistrictDataByStateCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDistrictDataByStateCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchDistrictDataByStateCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.data.data = [];
      })

      /*<><><><><><><><><><><><><><><>Make District List Blank<><><><><><><><><><><><><><><><><>*/ 
      .addCase(removeAllDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data.data = [];
      })
  },
});

export default distrcitSlice.reducer;