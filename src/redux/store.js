import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "./slice/headerSlice";
import districtSlice from "./slice/districtSlice";
import yearSlice from "./slice/yearSlice";
import stateSlice from "./slice/stateSlice";

const store = configureStore({
    reducer:{
        header:headerSlice,
        state:stateSlice,
        distrct:districtSlice,
        year:yearSlice,
    }
  });

export default store;