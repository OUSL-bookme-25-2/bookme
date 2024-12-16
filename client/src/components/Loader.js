import React, { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

function Loader() {
    let [loading, setLoading] = useState(true);

    return (
        <div style={{ marginTop: "100px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div>
                <HashLoader
                    color="#000"
                    loading={loading}
                    size={80}
                />
            </div>
        </div>
    );
}

export default Loader;
