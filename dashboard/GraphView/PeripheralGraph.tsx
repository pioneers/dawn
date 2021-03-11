import React, { useEffect, useState } from "react";
import { SplitButton, ButtonToolbar, MenuItem } from "react-bootstrap";
import { PeripheralData } from '../data/testData'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface StateProps {
  deviceName: string;
  data: PeripheralData[];
  key: number; // Currently not provided by runtime, and not used in Editor
}

export default function GraphView(props: StateProps) {
  // let myVar = setInterval(myTimer, 5000);
  // const [timer,updateTimer] = useState(0);
  // const [emptyArray,updateArray] = useState([]);
  // function myTimer() {
  //     updateTimer(timer+5000);
  //     emptyArray.push({name: "Page A",
  //     Motor1: 4000,
  //     Motor2: 2400,
  //     Motor3: 2400,});
  //     updateArray( [...emptyArray]);
  //     console.log(emptyArray);
  // }
  const [distArray, updateArray] = useState<Object[]>([]);
  const [timer, updateTimer] = useState<number>(0);
  let newObj: Object = {};
  newObj["Name"] = timer;
  for (let i = 0; i < props.data.length; i++) {
    let title = "Sensor" + i;
    newObj[title] = props.data[i].params["Distance"];
  }
  useEffect(() => {
    setTimeout(() => {
      updateTimer(timer + 1);
      updateArray([...distArray, newObj]);
    //   resize(distArray.length > 5 ? true : false);
    }, 1000);
  });

  const BUTTONS = ["Distance"];
  function renderDropdownButton(title: string, i: number) {
    return (
      <SplitButton
        bsStyle={title.toLowerCase()}
        title={title}
        key={i}
        id={`split-button-basic-${i}`}
      >
        <MenuItem eventKey="1">Velocity</MenuItem>
        <MenuItem eventKey="2">DC</MenuItem>
        <MenuItem eventKey="3">Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
      </SplitButton>
    );
  }

  return (
    <div>
      <div className="dropdown">
        <ButtonToolbar>{BUTTONS.map(renderDropdownButton)}</ButtonToolbar>
      </div>
      <LineChart
        width={500}
        height={300}
        data={distArray}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="Sensor0"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Sensor1" stroke="#ff0000" />
        <Line type="monotone" dataKey="Sensor2" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Sensor3" stroke="#82ca9a" />
      </LineChart>
    </div>
  );
}
