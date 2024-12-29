import React from "react";
import { useLocation } from "react-router-dom";

const Page2 = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get("data")
    ? JSON.parse(queryParams.get("data"))
    : [];

  return (
    <div>
      <h1>Page 2</h1>
      <p>Received Data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default Page2;
