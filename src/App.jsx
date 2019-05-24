import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";

import "./App.scss";
import Routes from "./Routes";

import siteConfig from "./Config/site";
import MuiTheme from "./Config/MuiTheme";

import useSnackbar from "./Hooks/useSnackbar";

import Drawer from "./Components/Drawer";
import SEO from "./Components/SEO";
import logoImage from "./Images/logo-192x192.png";

export const DrawerContext = React.createContext({});
const theme = createMuiTheme(MuiTheme);

const App = () => {
    const { message, openSnackbar, closeSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const toggleOpen = () => setOpen(!open);

    if (window) window.openSnackbar = openSnackbar;

    return (
        <div className="app">
            <SEO path="/" description="Gregory Goijaerts personal website" image={logoImage} />

            <BrowserRouter basename={siteConfig.baseName} forceRefresh={false}>
                <MuiThemeProvider theme={theme}>
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
                </MuiThemeProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
