import './Modal.css'

export default function Modal({show, hideModal, children}){
    const divClass = show ? "modal display-block" : "modal display-none"
    return (
        <div className={divClass}>
            <section className="modalContent">
                {children}
                <button onClick={hideModal}>Close</button>
            </section>
        </div>
    )
}