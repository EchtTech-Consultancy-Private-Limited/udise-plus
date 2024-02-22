import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./slice/headerSlice";
import districtSlice from "./slice/districtSlice";
import yearSlice from "./slice/yearSlice";
import stateSlice from "./slice/stateSlice";
import archiveServicesSlice from "./slice/archiveServicesSlice";
import schoolFilterSlice from "./slice/schoolFilterSlice";
import darkLightMode from "./slice/darkLightModeSlice";
import dataGridAPISlice from "./slice/dataGridAPISlice";

const store = configureStore({
    reducer:{
        header:headerSlice,
        schoolFilter:schoolFilterSlice,
        state:stateSlice,
        distrct:districtSlice,
        year:yearSlice,
        school:archiveServicesSlice,
        toggle:darkLightMode,
        column:dataGridAPISlice
        
    }
  });

export default store;