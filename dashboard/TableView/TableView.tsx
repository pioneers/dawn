import React from 'react';
import PeripheralTable from './PeripheralTable';

export default function TableView({ data } : {data: any}) {
  let peripheralGroups = {};
  data.forEach((p: any) => {
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
