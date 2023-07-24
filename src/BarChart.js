import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';



const BarChart = () => {
  const [chartData, setChartData] = useState({});
  const chartRef = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(process.env)
        const ROCKSET_APIKEY = process.env.REACT_APP_ROCKSET_APIKEY;
        
        const response = await axios.post(
          'https://api.usw2a1.rockset.com/v1/orgs/self/ws/Demo/lambdas/tweets_last6hours/tags/latest',
          {"virtual_instance_id": "4dae46c4-9f39-4b0c-ab43-9517f44f6fc1"},
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: 'ApiKey ' + ROCKSET_APIKEY,
            },
          }
        );

        const data = response.data.results;

        // Process the data to extract tweet_time and total_tweets
        const tweetTime = data.map(item => item.tweet_time);
        const totalTweets = data.map(item => item.tweets);

        setChartData({
          labels: tweetTime,
          datasets: [
            {
              label: 'Total Tweets',
              data: totalTweets,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
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
      // Destroy the previous chart instance
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('chart').getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'bar',
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

  return <canvas id="chart" />;
};

export default BarChart;
