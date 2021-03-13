import React from "react";
import { Table } from "react-bootstrap";
import { PeripheralData } from '../data/testData'
interface StateProps {
  deviceName: string;
  data: PeripheralData[];
  key: number; // Currently not provided by runtime, and not used in Editor
}

export default function PeripheralTable(props : StateProps) {
  let updatedDevicename: String =
    props.deviceName.charAt(0).toUpperCase() + props.deviceName.substr(1).toLowerCase();
  return (
    <div>
      <h1>{updatedDevicename + "s"}</h1>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>ID</th>
            {Object.keys(props.data[0].params).map((param, i) => (
              <th key={i}>{param}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((device : PeripheralData) => {
            return (
              <tr>
                <td>{device.key}</td>
                {Object.keys(device.params).map((dataField, j) => (
                  <td key={j}>{device.params[dataField] ?? "No Data Found"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
