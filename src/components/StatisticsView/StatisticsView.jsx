import { useEffect, useState } from 'react';
import axios from 'axios'
import './StatisticsView.css'

export default function StatisticsView({holdings}){
    const [currencies, setCurrencies] = useState(["USD", "CAD"])
    const [stats, setStats] = useState({total: 0, cashVal: 0, secVal: 0, cashPct: 0, secPct: 0})
    const backEndpoint = 'http://localhost:3001/';
    const decimalPrecision = 3;

    const getCurrencyList = () => {
        axios.defaults.withCredentials = true;
        axios.get(backEndpoint + 'currency/list')
            .then(response => {
                const data = response.data.map(({code}) => code)
                setCurrencies(data);
            })
            .catch(error => {
                console.error(error)
            })
    }
    
    useEffect(() => {
        getCurrencyList()
    }, [])
    
    // useEffect(() => {
    //     console.log(currencies)
    // }, [currencies])
    const isCash = (symbol) => {
        return currencies.includes(symbol)
    }
    const allSumReducer = (accumulator, row) => {
        return accumulator + row.cost_basis * row.quantity
    }
    const cashSumReducer = (accumulator, row) => {
        if(isCash(row.symbol)){
            return accumulator + row.cost_basis * row.quantity
        }
        else {return accumulator}
    }
    const secSumReducer = (accumulator, row) => {
        if(!isCash(row.symbol)){
            return accumulator + row.cost_basis * row.quantity
        }
        else {return accumulator}
    }

    const computeComposition = (holdings) => {
        let total = holdings.reduce(allSumReducer, 0);
        let cashVal = holdings.reduce(cashSumReducer, 0);
        let secVal = holdings.reduce(secSumReducer, 0);
        /* holdings.forEach((row) => {
            val = row.cost_basis * row.quantity
            if(isCash(row.symbol)){
                cashVal += val
            }
            else{
                secVal += val
            }
            total += val
        }); */
        let cashPct = cashVal / total * 100
        let secPct = secVal / total * 100

        return {
            total: total.toPrecision(decimalPrecision),
            cashVal: cashVal.toPrecision(decimalPrecision),
            secVal: secVal.toPrecision(decimalPrecision),
            cashPct: cashPct.toPrecision(decimalPrecision),
            secPct: secPct.toPrecision(decimalPrecision)}
    }

    useEffect(() => {
        setStats(computeComposition(holdings))
    }, [holdings])

    return (
        <div>
            <h2>Summary</h2>
            <ul>
                <li>Total Value: {stats.total}</li>
                <li>Cash Balance: {stats.cashVal} ({stats.cashPct}% of Total)</li>
                <li>Holdings Value: {stats.secVal} ({stats.secPct}% of Total)</li>
            </ul>
        </div>
    )
}