import { createAsyncThunk } from "@reduxjs/toolkit";
import axios  from '../../services/utility';

const fetchDistrictData = createAsyncThunk(
  "district/fetchDistrictData",
  async () => {
    const response = await axios.get(`districts/`);
    return response.data;
  }
);

export  {fetchDistrictData};