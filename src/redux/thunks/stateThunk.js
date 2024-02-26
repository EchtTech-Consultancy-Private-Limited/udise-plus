import { createAsyncThunk } from "@reduxjs/toolkit";

import externalUtilityv1 from "../../services/external-utilityv1";

const fetchStateData = createAsyncThunk(
  "state/fetchStateData",
  async (year_id) => {
    const response = await externalUtilityv1.get(`states/${year_id}`);
    return response.data;
  }
);

export  {fetchStateData};