import React, {useEffect, useRef} from "react";
import "../components/css/FullScreenModal.css"; // Para estilos específicos

export default function FullScreenModal({ isOpen, onClose, children }) {
    const modalRef = useRef();

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.requestFullscreen().catch((error) => {
                console.error("Error al entrar en pantalla completa", error);
            });
        }

        return () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch((error) => {
                    console.error("Error al salir de pantalla completa", error);
                });
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>Cerrar</button>
                {children}
            </div>
        </div>
    );
}