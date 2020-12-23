import React from "react";
import {
    BrowserRouter as Router,
    RouteComponentProps,
    Route,
} from "react-router-dom";
import { Main } from "./Main";

export default function App() {
    const views = {
        'main': <Main />,
        /*
        'dash': <PIEDash />,
        'stream': <VideoStream />,
        */
    }

    function View(props: RouteComponentProps) {
        const viewName: string = props.location.search.substr(1);
        return views[viewName];
    } 

    return (
      <Router>
        <div>
          <Route path="/" component={View} />
        </div>
      </Router>
    )
}