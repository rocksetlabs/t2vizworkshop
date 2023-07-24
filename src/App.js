import React from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Twitter Data</h1>
      <div className="chart-container">
        <BarChart />
      </div>
      <h1>Your Data</h1>
      <div className="chart-container">
        <LineChart />
      </div>
    </div>
  );
};

export default App;
