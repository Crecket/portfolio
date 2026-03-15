import React from "react";

export interface ShareData {
    title: string;
    url: string;
}

export interface ShareContextValue {
    shareData: ShareData;
    setShareData: (data: ShareData) => void;
}

export const ShareContext = React.createContext<ShareContextValue | null>(null);
