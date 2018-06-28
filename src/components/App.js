import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import RLS from './ewrls';
import LMS from './lms';
import NLMS from './nlms';
import '../bootstrap-3.3.7-dist/css/bootstrap.min.css';

import '../styles/App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  handleSelect(key) {
    this.setState({ key });
  }
  
  render() {

    return (
      <div className="App">
          <Tabs
            activeKey={Number(this.state.key)}
            id="uncontrolled-tab-example"
            onSelect={this.handleSelect}>
            <Tab eventKey={1} title="HOME">
              <h1> Welcome in my application. </h1>
              <h3>
                It presents work of RLS and LMS algorithms.
                Please toggle between tabs and then switch algorithm parameters to see differences on charts.
              </h3>
            </Tab>
            <Tab eventKey={2} title="EWRLS">
              <RLS/>
            </Tab>
            <Tab eventKey={4} title="LMS">
              <LMS />
            </Tab>
            <Tab eventKey={5} title="NLMS">
              <NLMS />
            </Tab>
          </Tabs>
          <div className="footer"> 
          &copy; 2018 Jedrzej Klocek. All rights reserved. Warsaw University of Technology 2018
          </div>
      </div>
    );
  }
}

export default App;
/* Created by Jedrzej Klocek 20.06.2018*/