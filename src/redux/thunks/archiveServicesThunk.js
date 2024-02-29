import { createAsyncThunk } from "@reduxjs/toolkit";
import externalAxios  from '../../services/external-utility';

// const fetchArchiveServicesSchoolData = createAsyncThunk(
//   "archive-services/fetchArchiveServicesSchoolData",
//   async ({year_id,region_type,region_code,category_code,management_code,location_code,school_type_code}) => {
//     const response = await externalAxios.post(`${year_id}/${region_type}/${region_code}/${category_code}/${management_code}/${location_code}/${school_type_code}`);
    
//     return response.data;
//   }
// );
const fetchArchiveServicesSchoolData = createAsyncThunk(
  "archive-services/fetchArchiveServicesSchoolData",
  async (filterObj) => {
    const response = await externalAxios.post(`/public`,filterObj);
    
    return response.data;
  }
);

const updateMergeDataToActualData = createAsyncThunk(
  "archive-services/updateMergeDataToActualData",
  async (merged_data) => {
    return merged_data;
  }
);

export  {fetchArchiveServicesSchoolData,updateMergeDataToActualData};