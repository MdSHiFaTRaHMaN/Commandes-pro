import { Divider } from "antd";
import { useEffect, useState } from "react";
import {
  useMonthlyOrder,
  useTodayOrder,
  useWeekOrder,
  useYearOrder,
} from "../api/api";

const DashBoard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { todayOrder } = useTodayOrder();
  const { weekOrder } = useWeekOrder();
  const { monthlyOrder } = useMonthlyOrder();
  const { yearOrder } = useYearOrder();

  // console.log(monthlyOrder);
  // daily
  const totalSum = todayOrder?.reduce((sum, currentOrder) => {
    return sum + currentOrder.total;
  }, 0);
  const formattedTotalSum = totalSum?.toFixed(2) || "0.00";
  //  weekly
  const weekSum = weekOrder?.reduce((sum, currentOrder) => {
    return sum + currentOrder.total;
  }, 0);
  const formattedWeekSum = weekSum?.toFixed(2) || "0.00";
  //  monthly
  const monthlySum = monthlyOrder?.reduce((sum, currentOrder) => {
    return sum + currentOrder.total;
  }, 0);
  const formattedMonthlySum = monthlySum?.toFixed(2) || "0.00";
  // yearly
  const yearSum = yearOrder?.reduce((sum, currentOrder) => {
    return sum + currentOrder.total;
  }, 0);
  const formattedYearSum = yearSum?.toFixed(2) || "0.00";

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
        <h1 className="text-2xl font-medium title-font mb-12 text-center">
          {formattedDate}
        </h1>
        <h1 className="text-3xl font-medium title-font mb-12 text-center">
          ORDERS
        </h1>
        <div className="flex   gap-3">
          <div className="p-4 md:w-1/2 w-full">
            <div className="h-full bg-white p-3 rounded  shadow-xl">
              <h1 className="text-2xl font-semibold">Today</h1>
              <h3 className="text-pink-600 text-4xl font-semibold">
                € {formattedTotalSum || 0} excl. tax
              </h3>
              <Divider />
              <h3 className="text-xl font-semibold my-2">
                Today Order: {todayOrder?.length || 0} Product
              </h3>
            </div>
          </div>

          <div className="p-4 md:w-1/2 w-full">
            <div className="h-full bg-white p-8 rounded shadow-xl">
              <h1 className="text-2xl font-semibold">This Week</h1>
              <h3 className="text-pink-600 text-4xl font-semibold">
                € {formattedWeekSum} excl. tax
              </h3>
              <Divider />
              <h3 className="text-xl font-semibold my-2">
                Total Order: {weekOrder.length} Product
              </h3>
            </div>
          </div>
          <div className="p-4 md:w-1/2 w-full mx-auto ">
            <div className="h-full bg-white p-8 rounded shadow-xl">
              <h1 className="text-2xl font-semibold">This Month</h1>
              <h3 className="text-pink-600 text-4xl font-semibold">
                € {formattedMonthlySum} excl. tax
              </h3>
              <Divider />
              <h3 className="text-xl font-semibold my-2">
                Total Order: {monthlyOrder.length} Product
              </h3>
            </div>
          </div>
        </div>
        <div className="p-4 md:w-1/2 w-full mx-auto ">
          <div className="h-full bg-white p-8 rounded shadow-xl">
            <h1 className="text-2xl font-semibold">This Year</h1>
            <h3 className="text-pink-600 text-4xl font-semibold">
              € {formattedYearSum} excl. tax
            </h3>
            <Divider />
            <h3 className="text-xl font-semibold my-2">
              Total Order: {yearOrder.length} Product
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
