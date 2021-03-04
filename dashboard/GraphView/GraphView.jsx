import React from "react";
import PeripheralGraph from "./PeripheralGraph";

export default function GraphView({ data }) {
  let peripheralGroups = {};

  // Grouping data based on type of device into an object.
  data.forEach((p) => {
    let group = peripheralGroups[p.device_name] ?? [];
    group.push(p);
    peripheralGroups[p.device_name] = group;
  });

  return (
    <div className="graph-view">
      {Object.keys(peripheralGroups).map((deviceName, i) => (
        <PeripheralGraph
          deviceName={deviceName}
          data={peripheralGroups[deviceName]}
          key={i}
        />
      ))}
    </div>
  );
}
