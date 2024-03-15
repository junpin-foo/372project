const API_KEY = '9fgEfLz33zOGh1IHL6vZngEQakUpWmyr'; //store in env later

const polygonApiHelpers = {
    getStockOpenClose: async function(symbol, day) {
        /*
        {
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
        }
        */

        async function callOpenCloseApi(symbol, day) {
            try {
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
          console.log('API call returned:', data);
          return data;
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
    
    }
}

module.exports = { polygonApiHelpers }

// console.log(polygonApiHelpers.getStockOpenClose('AAPL', '2024-03-13'))