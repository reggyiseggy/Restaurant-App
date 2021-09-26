import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { csv } from 'd3';

import DataCSV from './DataSet/data.csv';

function App() {

  //config function to add headers
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const HDBCarparkInfo = async () => {
    let carparkAvailabilityArray = await axios.get('https://api.data.gov.sg/v1/transport/carpark-availability', config);
    let carparkInfo1 = (carparkAvailabilityArray.data.items[0].carpark_data);
    // console.log("carparkAvailabilityArray:", carparkInfo1);

    return carparkInfo1;
  }

  const CSVArray = async () => {
    let carparkInfo2 = await csv(DataCSV);
    // console.log("csvArray:", carparkInfo2);

    return carparkInfo2;
  }

  useEffect(() => {
    HDBCarparkInfo();
    CSVArray();
  }, [])

  //remove any unfound carparks from CSV Array and finalise HDBCarparkInfo
  const finalHDBCarparkInfo = async () => {
    // let finalHDBArray = [];
    try {
      let dataSet1 = await HDBCarparkInfo();
      console.log("dataSet1:", dataSet1);

      let dataSet2 = await CSVArray();
      console.log("dataSet2:", dataSet2);

      function isInDataSet1(carpark) {
        for (let i = 0; i < dataSet1.length; i++) {
          if (dataSet1[i].carpark_number === carpark) return true;
        }
        return false;
      }

      let finalArray = [] // Contain all carparks both x, y and number

      function combineCarparkWith1(carparkFromData2) {
        for (let i = 0; i < dataSet1.length; i++) {
          if (dataSet1[i].carpark_number === carparkFromData2.car_park_no) {
            const combinedCapark = {
              ...carparkFromData2,
              total_lots: dataSet1[i].total_lots
            }
            return combinedCapark
          }
          return null
        }
      }

      for (const carpark in dataSet2) {
        const result = combineCarparkWith1(carpark)
        if (result !== null) finalArray.push(result)
      }

      console.log(finalArray)
      // const filteredInfoArray = dataSet2.filter((carparkInfo2) => {
      //   return isInDataSet1(carparkInfo2.car_park_no)
      // });
      // console.log("filtered: ", filteredInfoArray)
    }
    catch (err) {
      console.log(err);
    }
  }

  const something = finalHDBCarparkInfo();

  return (
    <div>
      Hello
    </div>
  );
}

export default App;
