import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import { Progress } from "antd";
import "./statusPage.css";
const ip = `http://${import.meta.env.SERVER_IP_ADDRESS}:3000`;

export default function StatusView() {
  const [distance, setDistance] = useState(0);
  const [weight, setWeight] = useState(0);
  const maxDistance = 100;
  const maxWeight = 30;

  // Removes decimals and makes sure its under 100
  const distancePercentage = Math.min(
    Math.round((distance / maxDistance) * 100),
    100
  );
  const weightPercentage = Math.min(
    Math.round((weight / maxWeight) * 100),
    100
  );

  function getSensorValues() {
    fetch(`${ip}/sensor-values`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDistance(data.distance);
        setWeight(data.weight);
      })
      .catch((error) => console.error("Error:", error));
  }
  useEffect(() => {
    getSensorValues(); // Run initially
    const interval = setInterval(() => {
      getSensorValues(); // Run every 1000ms (1 second)
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  //GRaf dummy
  const data = [
    { day: "1991", amount: 80 },
    { day: "1992", amount: 80 },
    { day: "1993", amount: 70 },
    { day: "1994", amount: 75 },
    { day: "1995", amount: 69 },
    { day: "1996", amount: 68 },
    { day: "1997", amount: 70 },
    { day: "1998", amount: 65 },
  ];
  const config = {
    data,
    xField: "day",
    yField: "amount",
    yAxis: {
      min: 50,
      max: 80,
    },
    width: 600, // Adjust the width of the plot area
    height: 300, // Adjust the height of the plot area
    point: {
      shapeField: "circle",
      sizeField: 2,
    },
    interaction: {
      tooltip: {
        marker: true,
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  return (
    <>
      <div className="statusContainer">
        <div className="statusItems">
          <h2>Food-level in container</h2>
          <div className="foodContainer">
            {50 < distancePercentage && distancePercentage <= 100 ? (
              <Progress
                type="circle"
                percent={distancePercentage}
                strokeColor="green"
                strokeWidth={8}
                circleIconFontSize="2em"
                size={200}
              />
            ) : 20 < distancePercentage && distancePercentage <= 50 ? (
              <Progress
                type="circle"
                percent={distancePercentage}
                strokeColor=" yellow"
                strokeWidth={8}
                circleIconFontSize="2em"
                size={200}
              />
            ) : (
              <Progress
                type="circle"
                percent={distancePercentage}
                strokeColor="red"
                strokeWidth={8}
                circleIconFontSize="2em"
                size={200}
              />
            )}
            <button onClick={getSensorValues} className="updateBTN">
              Update Now
            </button>
          </div>
        </div>
        <div className="statusItems">
          <h2>Food-level in Bowl</h2>
          <div className="bowl">
            <Progress
              type="circle"
              percent={weightPercentage}
              format={(percent) => `${weight} gram`}
              size={200}
            />
          </div>
        </div>
        <div className="statusItems history">
          <div>
            <h2>Eat pattern</h2>
            <div className="chart">
              <Line {...config} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
                <Line  {...config}/>
 * 
 */
