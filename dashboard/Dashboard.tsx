import React, { useEffect, useState } from 'react';
import "./dash.css";
import { /*Motor,*/ Sensor } from './data/testData';

import { Grid, Row, Col } from 'react-bootstrap';
import { PeripheralData } from './data/testData';
import DataView from './data/DataView';
import { connect } from 'react-redux'

interface Props {
    peripheralList: any[]
    testing: boolean | null
}

function useTestData() {
    const getData = () => {
        // let m1 = new Motor(0, Math.random(), "motor", 100, 5);
        // let m2 = new Motor(1, Math.random(), "motor", 15, 1);
        let s1: Sensor = new Sensor(2, "d" + Math.random(), "sensor", 10);
        // let s0 = new Sensor(5, Math.random(), "limitswitche", 7);
        let s2: Sensor = new Sensor(3, "d" + Math.random(), "sensor", 100);
        let s3: Sensor = new Sensor(4, "d" + Math.random(), "sensor", 30);
        let s4: Sensor = new Sensor(5, "d" + Math.random(), "sensor", 54);
        return [s1, s2, s3, s4];
    }

    const updateData = (p: any, name: string, amt: number) => {
        if (Math.random() > .5) {
            amt = -amt;
        }
        amt = Math.max(0, amt);
        if (p.params.hasOwnProperty(name) && p.params[name]) {
            p.params[name] += amt;
        }
    }

    const [testData, setTestData] = useState<PeripheralData[]>(getData());
    useEffect(() => {
        testData.map((p) => {
            updateData(p, "Velocity", 100);
            updateData(p, "DC", 1);
            updateData(p, "Distance", 3);
        })

        setTimeout(() => {
            setTestData([...testData]);
        }, 1000);
    })

    return testData;
}

function DashboardComponent(props: Props) {
  const peripheralList = (props.testing ? useTestData() : Object.values(props.peripheralList));

  return (
    <div className="App">
      <div className="grid-wrapper">
        <Grid>
          <Row>
            <Col xs={12} md={6} lg={6} className="graphView">
              <DataView data={peripheralList} viewType={"Graph"} />
            </Col>
            <Col xs={12} md={6} lg={6} className="tableView">
              <DataView data={peripheralList} viewType={"Table"} />
            </Col>
          </Row>
        </Grid>
      </div>
     </div>
  );
}

const mapStateToProps = (state: DashState) => ({
  peripheralList: Object.assign({}, state.peripherals.peripheralList)
});
const Dashboard = connect(mapStateToProps)(DashboardComponent);

export default Dashboard;
