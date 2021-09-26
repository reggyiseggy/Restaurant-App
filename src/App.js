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

      const filteredInfoArray = dataSet2.filter((carparkInfo2) => {
        for (let i = 0; i < dataSet1.length; i++) {
          if (
            dataSet1[i].carpark_number === carparkInfo2[i].car_park_no
          )
            return carparkInfo2;
        };
      });
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
    </div>
  );
}

export default App;
