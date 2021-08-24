import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        primary: { // works
          main: '#37474F',
          contrastText: '#FFFFFF',
        },
        secondary: { // works
          main: '#FFFFFF',
          contrastText: '#000000',
        },
        //dark blue: rgb(24, 98, 163) 
        //green: rgb(75, 134, 99)
        //red: 'rgb(156, 50, 50)'
    },
});