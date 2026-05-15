import { createTheme, responsiveFontSizes } from "@mui/material";

let appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#444444',
    },
    secondary: {
      main: '#01c2cb',
    },
  },
});

export const APP_THEME = appTheme;