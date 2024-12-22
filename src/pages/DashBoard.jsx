import { Divider } from "antd";
import { useEffect, useState } from "react";

const DashBoard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000); // Updates every second
  
      return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, []);
  
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long", // Full weekday name
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <h1 className="text-2xl font-medium title-font mb-12 text-center">{formattedDate}</h1>
        <h1 className="text-3xl font-medium title-font mb-12 text-center">
          ORDERS
        </h1>
        <div className="flex  gap-7">
          <div className="p-4 md:w-1/2 w-full">
            <div className="h-full bg-white p-8 rounded">
              <h1 className="text-2xl font-semibold">This Week</h1>
              <h3 className="text-pink-600 text-4xl font-semibold">
                €1,487.50 excl. tax
              </h3>
              <Divider />
              <h3 className="text-xl font-semibold my-2">
                Previous Day: €1,487.50 excl. tax
              </h3>
              <h3 className="text-xl font-semibold">
                Current Week: €7,240.00 excl. tax
              </h3>
              <h3 className="text-xl font-semibold my-2">
                Current Month: €30,950.00 excl. tax
              </h3>
            </div>
          </div>
          <div className="p-4 md:w-1/2 w-full">
            <div className="h-full bg-white p-8 rounded">
              <h1 className="text-2xl font-semibold">Today</h1>
              <h3 className="text-pink-600 text-4xl font-semibold">
                €1,487.50 excl. tax
              </h3>
              <Divider />
              <h3 className="text-xl font-semibold my-2">
                Previous Day: €1,487.50 excl. tax
              </h3>
              <h3 className="text-xl font-semibold">
                Current Week: €7,240.00 excl. tax
              </h3>
              <h3 className="text-xl font-semibold my-2">
                Current Month: €30,950.00 excl. tax
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
