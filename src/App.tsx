import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";

import "./App.scss";
import Routes from "./Routes";

import siteConfig from "./Config/site";
import MuiTheme from "./Config/MuiTheme";

import useSnackbar from "./Hooks/useSnackbar";

import Drawer from "./Components/Drawer";
import SEO from "./Components/SEO";
import logoImage from "./Images/logo-192x192.png";

export const DrawerContext = React.createContext({ open: false, toggleOpen: null });
const theme = createTheme(adaptV4Theme(MuiTheme));

const App = () => {
    const { message, openSnackbar, closeSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const toggleOpen = () => setOpen(!open);

    if (window) window.openSnackbar = openSnackbar;

    return (
        <div className="app">
            <SEO path="/" description="Gregory Goijaerts personal website" image={logoImage} />

            <BrowserRouter basename={siteConfig.baseName}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <DrawerContext.Provider value={{ open, toggleOpen }}>
                            <Routes />

                            <Drawer />

                            <Snackbar
                                autoHideDuration={5000}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={!!message}
                                message={message}
                                onClose={closeSnackbar}
                            />
                        </DrawerContext.Provider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
