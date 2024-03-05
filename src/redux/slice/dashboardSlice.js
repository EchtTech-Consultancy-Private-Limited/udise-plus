import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData } from "../thunks/dashboardThunk"; 

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {
      data:[],
      statusCode:0,
      message:"",
      success:false
    },
    
    isLoading:false,
    isError:false
  },

  
  reducers: {},
  extraReducers: (builder) => {
    console.log("shdjsh",builder)
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        console.log("pending")
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        console.log("fulfilled")
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        console.log("rejected")
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboardSlice.reducer;