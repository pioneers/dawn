import React, { Component } from "react";
import {
    BrowserRouter as Router,
    RouteComponentProps,
    // Switch,
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
    function getView(props: RouteComponentProps) {
        const viewName: string = props.location.search.substr(1);
        const view: Component = views[viewName];
        if (view) return view;
        console.log("there was an error in getting view");
    } 

    return (
      <Router>
        <div>
          <Route path="/" component={getView} />
        </div>
      </Router>
    )
}