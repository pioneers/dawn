import { PeripheralData, Peripheral } from './testData';
import React from 'react';
import PeripheralTable from '../TableView/PeripheralTable';
import PeripheralGraph from '../GraphView/PeripheralGraph'

interface Props {
  data: PeripheralData[]
  viewType: string
}
export default function DataView(props: Props) {
  const { data, viewType } = props;
  let viewComponent = (
      <p>Error</p>
  );

  let peripheralGroups = {};
  data.forEach((p: Peripheral) => {
    let group = peripheralGroups[p.device_name] ?? [];
    group.push(p);
    peripheralGroups[p.device_name] = group;
  });
  if (viewType == "Graph") {
    viewComponent = (
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
  } else if (viewType == "Table") {
    viewComponent = (
      <div className="table-view">
        {Object.keys(peripheralGroups).map((deviceName, i) => (
          <PeripheralTable
            deviceName={deviceName}
            data={peripheralGroups[deviceName]}
            key={i}
          />
        ))}
      </div>
    )
  }

  return viewComponent;
}
