import './App.css';
import GeneralContainer from './continer';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: ["IBM Plex Sans Arabic"]
  },
});
function App() {
  return (
    <>
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <GeneralContainer/>
        </ThemeProvider>
      </header>
    </>
  );
}

export default App;
