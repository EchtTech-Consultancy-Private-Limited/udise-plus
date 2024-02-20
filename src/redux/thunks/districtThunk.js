import { createAsyncThunk } from "@reduxjs/toolkit";
import axios  from '../../services/utility';

const fetchDistrictData = createAsyncThunk(
  "district/fetchDistrictData",
  async () => {
    const response = await axios.get(`districts/get-all`);
    return response.data;
  }
);

const fetchDistrictDataByStateId = createAsyncThunk(
  "district/fetchDistrictData",
  async (state_id) => {
    console.log(state_id,' state id ')
    const response = await axios.get(`districts/get-state-by-id/${state_id}`);
    return response.data;
  }
);
export  {fetchDistrictData,fetchDistrictDataByStateId};