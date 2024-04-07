import './Modal.css'

export default function Modal({show, hideModal, children}){
    const divClass = show ? "modal display-block" : "modal display-none"
    return (
        <div className={divClass}>
            <button className="modalClose" onClick={hideModal}><span>&times;</span></button>
            <section className="modalContent">
                {children}
            </section>
        </div>
    )
}