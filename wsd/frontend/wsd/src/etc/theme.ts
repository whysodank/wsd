import { alpha, createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  palette: {
    mode: 'dark',
    text: {
      primary: '#ffffff',
    },
    primary: {
      main: '#470ff4ff',
    },
    secondary: {
      main: '#48639cff',
    },
    success: {
      main: '#20bf55ff',
    },
    error: {
      main: '#bd1e1eff',
    },
    warning: {
      main: '#f0a202ff',
    },
    info: {
      main: '#fffb46ff',
    },
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    background: {
      default: alpha('#000000', 0.9),
      paper: '#000000',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
})

export default theme
