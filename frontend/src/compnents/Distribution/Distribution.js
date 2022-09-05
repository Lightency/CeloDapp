import React from 'react';
import Chart from 'react-apexcharts';


const Distribution = () => {
  return (
    <>
    <Chart options={{
              chart: {
                type: 'pie',
                height: 8000,
                width: 800,
              },
              labels: ['Team', 'Private Sale', 'Public Sale', 'Marketing', 'Staking reward','Partners','Market Maker','Liquidity','Advisors','Locked Tokens'],
             
            }}  series={[140000, 100000, 30000, 80000, 150000,30000,100000,180000,20000,170000] } type="pie" width={900} height={600} />
    
    </>
  );
}

export default Distribution;
