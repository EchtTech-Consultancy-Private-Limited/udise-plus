import { createAsyncThunk } from "@reduxjs/toolkit";

import externalUtilityv1 from "../../services/external-utilityv1";

const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  
  async ({yearId, dashboardRegionType, dashboardRegionCode}) => {
    console.log("response",yearId)
    const response = await externalUtilityv1.get(`summarised-stats/public/${yearId}/n/${dashboardRegionCode}`);
    console.log("response",response)
    return response.data;
  }
);



export  {fetchDashboardData};