import React, { useState, useEffect, useContext } from 'react';
import * as ethers from 'ethers';
import { wallet } from '../../store/Store'
import ABI from '../../ABI/DaoAbi.json'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chart from "react-apexcharts";
import '../../css/Wallet.css'



export const Wallet = () => {
  const { MyWallet, LtsAddress, VestingAddress } = useContext(wallet);
  const LtsContract = new ethers.Contract(LtsAddress, ABI.LtsABI, MyWallet);
  const VestingContract = new ethers.Contract(VestingAddress, ABI.VesterABI, MyWallet);
  const [address, setAddress,] = useState("");
  const [balanceInEthers, setBalanceInEthers] = useState(0);
  const [LtsBalance, setLtsBalance] = useState(0);
  const [schedules, setSchedules] = useState(null);
  const [NumberOfSchedules, setNumberOfSchedules] = useState(null);
  const getAllSchedules = async (address) => {
    await VestingContract.getSchedules(address).then((res) => { setSchedules(res); console.log(res); });
  }
  const getData = async () => {
    let address = await MyWallet.getAddress();
    setAddress(address);
    await MyWallet.getBalance().then((res) => {
      let balanceInEthers = ethers.BigNumber.from(res).toString();

      setBalanceInEthers(balanceInEthers);
    })
    await LtsContract.balanceOf(address).then((res) => {
      let balanceInLts = ethers.BigNumber.from(res).toString();


      setLtsBalance(balanceInLts);
    })
    await VestingContract.numberOfSchedules(address).then((res) => {

      setNumberOfSchedules(parseInt(ethers.BigNumber.from(res).toString()));
      if (res > 0) {
        getAllSchedules(address);
      }
    })





  }
  const getDate = (epoch) => {
    let date = new Date(epoch * 1000);
    return date.toUTCString();

  }
  const getMonth = (epoch) => {
    let date = new Date(epoch * 1000);
    return date.getMonth() + 1;
  }
  const getDistributions = (start,end,amount,startamount) => {
    let x = start;
    let destributedAmount=0;
    let Data=[];
    while (x <= (end)) {
      if(x==start){
        Data.push(startamount);
        destributedAmount+=startamount;
        x = x + 2629743;
      }
      else{
        let unlocked = (amount * (x - start)) / (end - start);
        let rounded = Number((unlocked +destributedAmount).toFixed(3));
        Data.push(rounded);
        x = x + 2629743;
      }
    }
    return Data;


  }
  const getCategories = (start, end) => {
    let months = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" }
    let categories = [];
    let x = start;
    while (x <= (end)) {
      console.log(start, end);
      let month = getMonth(x);
      categories.push(months[month]);
      x = x + 2629743;
    }
    return categories;

  }

  useEffect(() => {
    MyWallet == null ? console.log('still not connected') : getData();



  }, [MyWallet]);

  return (

    <Container>
      <Row><Col className="WalletHeader">
        <h1>Wallet</h1>
      </Col>
      </Row>
      <Row className="AccountData">
        <Col className="Balances"><ul>
          <li><h3>Balances:</h3></li>
          <li><img style={{ height: "32px", width: "32px" }} src="/celo.png" />CELO <br />{parseInt(balanceInEthers) / 10 ** 18}</li>
          <li><img style={{ height: "32px", width: "32px" }} src="/logo.png" />LTS <br /> {parseInt(LtsBalance) / 10 ** 8} </li>
        </ul></Col>
        <Col className="Vesting">
          <ul>
            <li><h3>Stacking</h3></li>

            <li>
              You have 0 LTS Stacking
            </li>
          </ul>

        </Col>
      </Row>
      <Row >
        <Col className="col-md-12" id="VestingSection">
          <h3>Vesting ({NumberOfSchedules} Schedules):</h3>
          {schedules !== null ? <div className="schedules">
            {schedules.map((schedule, i) => {
              return <div className="schedule" key={i} >
                <div className="schedule-info">
                  <h5>Schedule N°{i+1}:</h5>
                  <h6>Asset: <img style={{ height: "32px", width: "32px" }} src="/logo.png" />LTS </h6>
                  <h6>Total Amount: <strong>{parseFloat(ethers.BigNumber.from(schedule.totalAmount).toString() / 10 ** 8)}</strong> LTS
                  </h6>
                  <h6>Claimed Amount: <strong>{parseFloat(ethers.BigNumber.from(schedule.claimedAmount).toString() / 10 ** 8)}</strong> LTS
                  </h6>
                  <h6>Start Date: <strong>{getDate(parseFloat(ethers.BigNumber.from(schedule.startTime).toString()))}</strong></h6>
                  <h6>End Date: <strong>{getDate(parseFloat(ethers.BigNumber.from(schedule.endTime).toString()))}</strong></h6>
                </div>
                <Chart options={{
                  chart: {
                    height: 350,
                    width: 600,
                    type: 'line',

                    zoom: {
                      enabled: false
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    style: {
                      colors: ['#000000']
                    }
                  },
                  stroke: {
                    curve: 'straight'
                  },
                  title: {
                    text: 'Unlocked tokens by month',
                    align: 'center',
                    style: {
                      color: '#FFFFFF',
                      fontWeight: 2
                    }
                  },
                  fill: {
                    colors: ['#1A73E8', '#B32824']
                  },
                  grid: {
                    row: {
                      colors: ['#FFFFFF'], // takes an array which will be repeated on columns
                      opacity: 0.5
                    },
                  },
                  xaxis: {
                    categories: getCategories(parseInt(ethers.BigNumber.from(schedule.startTime).toString()), parseInt(ethers.BigNumber.from(schedule.endTime).toString())),
                    labels: {
                      style: {
                        colors: '#FFFFFF'
                      }
                    }

                  },
                  yaxis: {
                    labels: {
                      style: { colors: '#FFFFFF' }
                    },
                  }
                }} series={[{
                  name: "unlocked",
                  data: getDistributions(parseFloat(ethers.BigNumber.from(schedule.startTime).toString()),parseFloat(ethers.BigNumber.from(schedule.endTime).toString()),parseFloat(ethers.BigNumber.from(schedule.totalAmount).toString()/10**8),parseFloat(ethers.BigNumber.from(schedule.startamount).toString()/10**8)),
                  fill: {
                    colors: ['#1A73E8', '#B32824']
                  }
                }]} type="line" height={350} id="chart" />




                <Chart options={{
              chart: {
                type: 'donut',
              },
              labels:["Locked Tokens","Unlocked Tokens"],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }} series={[parseFloat(ethers.BigNumber.from(schedule.totalAmount).toString() / 10 ** 8)-parseFloat(ethers.BigNumber.from(schedule.claimedAmount).toString() / 10 ** 8),parseFloat(ethers.BigNumber.from(schedule.claimedAmount).toString() / 10 ** 8)]} type="donut" />



              </div>



            })}



          </div> : null}

        </Col>

      </Row>
    </Container>
  )
}
