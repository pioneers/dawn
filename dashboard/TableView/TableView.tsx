import React from 'react';
import PeripheralTable from './PeripheralTable';
import {PeripheralData, Peripheral} from '../data/testData';

export default function TableView(data: PeripheralData[]) {
  let peripheralGroups = {};
  data.forEach((p: Peripheral) => {
    let group = peripheralGroups[p.device_name] ?? [];
    group.push(p);
    peripheralGroups[p.device_name] = group;
  });

  return (
    <div className="table-view">
      {Object.keys(peripheralGroups).map((deviceName, i) => (
        <PeripheralTable 
          deviceName={deviceName} 
          data={peripheralGroups[deviceName]} 
          key={i} />
      ))}
    </div>
  );
}
