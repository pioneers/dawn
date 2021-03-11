import React, { useEffect, useState } from 'react';
// import './App.css';
import GraphView from './GraphView/GraphView';
import TableView from './TableView/TableView';
import { /*Motor,*/ Sensor } from './data/testData';

import { Grid, Row, Col } from 'react-bootstrap';

function Dashboard() {
  const [testData, setTestData] = useState(getData());
  
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

  return (
    <div className="App">
      <Grid>
        <Row>
          <Col className="graphView">
            <GraphView data={testData} />
          </Col>
          <Col className="tableView">
            <TableView data={testData} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

const getData = () => {
    // let m1 = new Motor(0, Math.random(), "motor", 100, 5);
    // let m2 = new Motor(1, Math.random(), "motor", 15, 1);
    let s1 = new Sensor(2, "d" + Math.random(), "sensor", 10);
    // let s0 = new Sensor(5, Math.random(), "limitswitche", 7);
    let s2 = new Sensor(3, "d" + Math.random(), "sensor", 100 );
    let s3 = new Sensor(4, "d" + Math.random(), "sensor", 30);
    let s4 = new Sensor(5, "d" + Math.random(), "sensor",54);
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

export default Dashboard;
