let ticker, date, numShares
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
console.log(today);


function getInfo() {
    ticker = document.getElementById("tickerInput").value;
    date = document.getElementById("datepicker").value;
    numShares = document.getElementById("numberOfShares").value


    if (!ticker || !date || !numShares){
        alert('Fill in all the fields.')
    }

    body = {
        ticker: ticker
    }

    axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&apikey=MT81UG9QNO8YFAJN&outputsize=full', body)
        .then(data => {
            console.log(data);
            let tickerThen = data.data['Time Series (Daily)'][date];
            let tickerNow = data.data['Time Series (Daily)'][today];
            let priceThen = tickerThen['4. close'];
            let priceNow = tickerNow['4. close']

            document.getElementById('result').innerHTML = '<p>If you bought ' + numShares + ' shares of ' + ticker + ' on ' + date + ' (1 share = $'+priceThen+'), it is now worth <i>approximately</i> : <br><br><span id = "number">$' + calculateEarnings(priceThen, priceNow, numShares) + '</span></p>';

        })
        .catch(err => {
            console.log(err);
            document.getElementById('result').innerHTML = '<p>Sorry! The stock information for that date cannot be retrieved :(. Please double check when the company IPO\'d or pick a different date.</p>';
        });
}

function calculateEarnings(priceThen, priceNow, numShares) {
    let delta = parseInt(priceNow) / parseInt(priceThen);
    let result;

    if (delta < 1) {
        console.log('Stock has decreased by %' + delta * 100);
        result = priceThen - (priceThen * delta);
    }

    else if (delta > 1) {
        console.log('Stock has increased by %' + delta * 100)
        result = (priceThen * delta);
    }

    else if (delta == 1) {
        console.log('Stock price has not changed.')
    }

    result = result * parseInt(numShares);
    result = Number(Math.round(result + 'e2') + 'e-2');
    return result;
}