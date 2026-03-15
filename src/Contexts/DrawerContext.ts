import React from "react";

export const DrawerContext = React.createContext<{ open: boolean; toggleOpen: (() => void) | null }>({
    open: false,
    toggleOpen: null
});
