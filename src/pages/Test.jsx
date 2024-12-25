import React from "react";
import data from "../assets/countries.json";

function Test() {
  console.log(data);

  return (
    <div className="text-center">
      {data.map((d, index) => (
        <div key={index}> {d.name} </div>
      ))}
    </div>
  );
}

export default Test;
