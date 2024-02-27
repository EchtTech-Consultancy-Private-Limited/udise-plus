import { createAsyncThunk } from "@reduxjs/toolkit";
import externalAxios  from '../../services/external-utilityv1';

const fetchDistrictDataByStateCode = createAsyncThunk(
  "district/fetchDistrictData",
  async ({state_code,year_id}) => {
    const response = await externalAxios.get(`districts/${state_code}/${year_id}`);
    return response.data;
  }
);

const removeAllDistrict = createAsyncThunk(
  "district/removeAllDistrct",
  async () => {
    return [];
  }
);

const updateFilterDistrict = createAsyncThunk(
  "district/searchDistrict",
  async (searchDistrict) => {
    return searchDistrict;
  }
);
export  {fetchDistrictDataByStateCode,removeAllDistrict,updateFilterDistrict};