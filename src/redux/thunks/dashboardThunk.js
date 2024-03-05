import { createAsyncThunk } from "@reduxjs/toolkit";

import externalUtilityv1 from "../../services/external-utilityv1";

const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  
  async ({yearId, dashboardRegionType, dashboardRegionCode}) => {
    const response = await externalUtilityv1.get(`summarised-stats/public/${yearId}/${dashboardRegionType}/${dashboardRegionCode}`);
    return response.data;
  }
);



export  {fetchDashboardData};