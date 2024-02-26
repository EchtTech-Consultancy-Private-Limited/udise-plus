import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../services/external-utilityv1';

const fetchBlockByDistrictCode = createAsyncThunk(
  "block/fetchBlockData",
  async ({district_code,year_id}) => {
    const response = await axios.get(`/blocks/${district_code}/${year_id}`);
    return response.data;
  }
);

const removeAllBlock = createAsyncThunk(
  "block/removeAllBlockData",
  async () => {
    return [];
  }
);
export  {fetchBlockByDistrictCode,removeAllBlock};