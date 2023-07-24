import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

const LineChart = () => {
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ROCKSET_APIKEY = process.env.REACT_APP_ROCKSET_APIKEY2;
        const response = await axios.post(
            'https://api.euc1a1.rockset.com/v1/orgs/self/ws/commons/lambdas/graph-demo/tags/latest',
            {"virtual_instance_id": "13214eab-3bd8-4684-894b-effbadcf7c2e"},
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: 'ApiKey ' + ROCKSET_APIKEY,
              },
            }
          );
        const data = response.data.results;
        console.log(data)
        

        const dates = data.map(item => item.xsolla_time);
        const counts = data.map(item => item.total);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Count',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
        fetchData();
      }, 30000);
  
      return () => clearInterval(interval);
    }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('line-chart').getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    chartRef.current = newChart;
  }, [chartData]);

  return <canvas id="line-chart" />;
};

export default LineChart;
