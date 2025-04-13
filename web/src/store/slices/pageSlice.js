import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_HEADER_TITLE, DEFAULT_TAB_TITLE } from '../../values/strings';

const pageSlice = createSlice({
  name: "page",
  initialState: {
    tabTitle: DEFAULT_TAB_TITLE,
    headerTitle: DEFAULT_HEADER_TITLE,
    data: {},
  },
  reducers: {
    setTitle: (state, action) => {
      state.tabTitle = action.payload.tabTitle ?? action.payload.general ?? DEFAULT_TAB_TITLE;
      state.headerTitle = action.payload.headerTitle ?? action.payload.general ?? DEFAULT_HEADER_TITLE;
      document.title = state.tabTitle;
    },
    setPageData: (state, action) => {
      state.data = action.payload;
    },
  }
})

export const { setTitle, setPageData } = pageSlice.actions;
export const pageReducer = pageSlice.reducer;