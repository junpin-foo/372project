import Navbar from "../../components/Navbar";
import Snapshot from "../../components/Snapshot/Snapshot";
import './Quotes.css'
export default function Quotes() {
    return(
        <main>
            <Navbar />
            <header className="container text-center border-bottom border-3">
                <h1>Get Quote</h1>
            </header>
            <div className="Quotes container">
                <section className="Snapshot">
                    <Snapshot />
                </section>
            </div>
        </main>
    )
}
