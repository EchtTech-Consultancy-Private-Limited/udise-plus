import { createAsyncThunk } from "@reduxjs/toolkit";
import axios  from '../../services/utility';

const fetchStateData = createAsyncThunk(
  "state/fetchStateData",
  async () => {
    const response = await axios.get(`states/get-all`);
    return response.data;
  }
);

export  {fetchStateData};