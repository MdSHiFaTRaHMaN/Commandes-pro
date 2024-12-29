import React from "react";
import { useNavigate } from "react-router-dom";

const Page1 = () => {
  const navigate = useNavigate();
  const data = [19, 20, 21];

  const handleNavigate = () => {
    const query = new URLSearchParams({
      data: JSON.stringify(data),
    }).toString();
    navigate(`/test2?${query}`);
  };

  return (
    <div>
      <h1>Page 1</h1>
      <button onClick={handleNavigate}>Go to Page 2</button>
    </div>
  );
};

export default Page1;
