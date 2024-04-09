require('dotenv').config()

const API_KEY = process.env.POLYGON_API_KEY

const polygonApiHelpers = {
    getStockOpenClose: async function(symbol, day) {
        /*
            status: 'OK',
            from: '2024-03-08',
            symbol: 'AAPL',
            open: 169,
            high: 173.7,
            low: 168.94,
            close: 170.73,
            volume: 76267041,
            afterHours: 170.48,
            preMarket: 169.6
        */

        async function callOpenCloseApi(symbol, day) {
            try {
                console.log('API call:', symbol);
                const response = await fetch(`https://api.polygon.io/v1/open-close/${symbol}/${day}?apiKey=${API_KEY}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching stock quote:', error);
                return null;
            }
        }

        let data;
        try {
          data = await callOpenCloseApi(symbol, day);
          while (data.status === 'pending') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            data = await callOpenCloseApi(symbol, day);
          }
          //Get last snapshot closing price 
          console.log('API call returned:', data);
          return data;
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
    
    },

    getStockSnapshot: async function(symbol) {
      /*
              {
                {
          "ticker": {
              "ticker": "AAPL",
              "todaysChangePerc": 0.38502547091577166,
              "todaysChange": 0.6500000000000057,
              "updated": 1712361600000000000,
              "day": {
                  "o": 169.59,
                  "h": 170.39,
                  "l": 168.95,
                  "c": 169.58,
                  "v": 42112487,
                  "vw": 169.6416
              },
              "min": {
                  "av": 42112487,
                  "t": 1712361540000,
                  "n": 31,
                  "o": 169.42,
                  "h": 169.47,
                  "l": 169.42,
                  "c": 169.47,
                  "v": 682,
                  "vw": 169.4583
              },
              "prevDay": {
                  "o": 170.29,
                  "h": 171.92,
                  "l": 168.82,
                  "c": 168.82,
                  "v": 53682486,
                  "vw": 170.1029
              }
          },
          "status": "OK",
          "request_id": "69051ac613296314e957a3e6bec65693"
      }
      */

      async function callSnapshotApi(symbol) {
          try {
              console.log('API call:', symbol);
              const response = await fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbol}&apiKey=${API_KEY}`);
              const data = await response.json();
              return data;
          } catch (error) {
              console.error('Error fetching stock quote:', error);
              return null;
          }
      }

      let data;
      try {
        data = await callSnapshotApi(symbol);
        while (data.status === 'pending') {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
          data = await callSnapshotApi(symbol);
        }
        //Get last snapshot closing price 
        console.log('API call returned:', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
  
  }


}

module.exports = { polygonApiHelpers }

// console.log(polygonApiHelpers.getStockSnapshot('AAPL'))
// data.tickers[0].day.c
// console.log(polygonApiHelpers.getStockOpenClose('AAPL', '2024-03-22'))
// data.close