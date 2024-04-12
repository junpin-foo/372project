export default function RankingsTable({ symbols, username }) {
    return (
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">User</th>
                    <th scope="col">Unrealized Profit/Loss ($USD)</th>
                </tr>
            </thead>
            <tbody>
                {symbols.map(symbol => (
                    <tr key={symbol.userid}
                        className={`${symbol.userid === username ? "table-primary" : ""}`}>
                        <td>
                            {symbol.userid === username ?
                             <strong>{symbol.userid}</strong> : <>{symbol.userid}</>}
                        </td>
                        <td>{symbol.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
