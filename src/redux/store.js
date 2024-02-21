import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./slice/headerSlice";
import districtSlice from "./slice/districtSlice";
import yearSlice from "./slice/yearSlice";
import stateSlice from "./slice/stateSlice";
import archiveServicesSlice from "./slice/archiveServicesSlice";
import schoolFilterSlice from "./slice/schoolFilterSlice";
import darkLightMode from "./slice/darkLightModeSlice";

const store = configureStore({
    reducer:{
        header:headerSlice,
        schoolFilter:schoolFilterSlice,
        state:stateSlice,
        distrct:districtSlice,
        year:yearSlice,
        school:archiveServicesSlice,
        toggle:darkLightMode,
        
    }
  });

export default store;