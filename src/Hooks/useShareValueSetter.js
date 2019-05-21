import { useContext, useEffect } from "react";

import { ShareContext } from "../Pages/Bunq/Bunq";

export default targetValue => {
    const { shareData, setShareData } = useContext(ShareContext);

    useEffect(() => {
        if (JSON.stringify(targetValue) !== JSON.stringify(shareData)) {
            setShareData(targetValue);
        }
    }, [targetValue, shareData, setShareData]);
};
