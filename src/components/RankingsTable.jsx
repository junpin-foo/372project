export default function RankingsTable({ symbols }) {
    return (
        <table class="container table">
            <thead>
                <tr>
                    <th scope="col">User</th>
                    <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody>
                {symbols.map(symbol => (
                    <tr>
                        <td>{symbol.userid}</td>
                        <td>{symbol.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
