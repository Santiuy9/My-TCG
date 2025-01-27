import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UserModal = ({ isOpen, onClose, user }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsActive(true);
        } else {
            const timer = setTimeout(() => {
                setIsActive(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isActive) return null;

    const handleClose = () => {
        setIsActive(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`modal-overlay ${isActive ? 'active' : ''}`}>
            <div className="modal-content">
                <button className="modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>
                <h2>Perfil de Usuario</h2>
                <p>Nombre: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
};

export default UserModal;