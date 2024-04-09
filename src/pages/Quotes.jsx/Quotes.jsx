import Navbar from "../../components/Navbar";
import Snapshot from "../../components/Snapshot/Snapshot";
import './Quotes.css'
export default function Quotes() {
    return(
        <main>
            <Navbar />
            <div className="Quotes">
                <section className="Snapshot">
                    <Snapshot />
                </section>
            </div>
        </main>
        
    )
}