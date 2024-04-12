import Navbar from "../../components/Navbar";
import Snapshot from "../../components/Snapshot/Snapshot";
import './Quotes.css'
export default function Quotes() {
    return(
        <main>
            <Navbar />
            <div style={{marginLeft: '18rem', padding: '1rem'}}>
                <header className="text-center border-bottom border-3">
                    <h1>Get Quote</h1>
                </header>
                <div className="Quotes">
                    <section className="Snapshot">
                        <Snapshot />
                    </section>
                </div>
            </div>
        </main>
    )
}
