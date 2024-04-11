export default function RankingsTable({ symbols }) {
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
                    <tr key={symbol.userid}>
                        <td>{symbol.userid}</td>
                        <td>{symbol.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
