import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const apiValue = createContext();


function AllData({ children }) {
  const [api, setApi] = useState([]);

  useEffect(() => {
    axios
      .get("assets/js/Api.json") // يجب أن يكون داخل مجلد public
      .then((result) => {
        setApi(result.data.products || []);
      })
      .catch((err) => console.error("❌ API Error:", err));
  }, []);

  return (
    <apiValue.Provider value={api}>
      {children}
    </apiValue.Provider>
  );
}

export { AllData, apiValue };
