import React from "react";
import { Table } from "react-bootstrap";
import { PeripheralData, Peripheral } from "../data/testData";

interface PTProps {
  deviceName: string,
  data: PeripheralData[],
  key?: number,
}

export default function PeripheralTable({deviceName, data}: PTProps) {
  let updatedDevicename =
    deviceName.charAt(0).toUpperCase() + deviceName.substr(1).toLowerCase();
  return (
    <div>
      <h1>{updatedDevicename + "s"}</h1>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>ID</th>
            {Object.keys(data[0].params).map((param, i) => (
              <th key={i}>{param}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((device: Peripheral) => {
            return (
              <tr>
                <td>{device.key}</td>
                {Object.keys(device.params).map((dataField, i) => (
                  <td key={i}>{device.params[dataField] ?? "No Data Found"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
