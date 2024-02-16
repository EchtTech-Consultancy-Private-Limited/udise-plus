import { createSlice } from "@reduxjs/toolkit";
import { fetchArchiveServicesSchoolData } from "../thunks/archiveServicesThunk";

const archiveServicesSlice = createSlice({
  name: "archiveServices",
  initialState: {
    data: [{
            "regionType": "",
            "regionCode": "",
            "yearId": 0,
            "schCategoryCode": 0,
            "schManagementCode": 0,
            "totalSchool": 0,
            "schHavingFuncElectricity":0,
            "schHavingInternet": 0,
            "schHavingLibrary": 0,
            "schHavingRampFacility": 0,
            "schHavingSolarPanel": 0,
            "schHavingFuncDrinkingWater":0,
            "schHavingFuncToilet": 0,
            "schHavingFuncToiletBoys": 0,
            "schHavingFuncToiletGirls": 0
    }],
    isLoading:false,
    isError:false,
    error:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchiveServicesSchoolData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchiveServicesSchoolData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchArchiveServicesSchoolData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default archiveServicesSlice.reducer;