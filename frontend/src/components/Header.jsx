import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Bell, DollarSign, Coins, LogOut } from 'lucide-react';
import UserModal from './UserModal';
import MessagesModal from './MessagesModal';
import NotificationsModal from './NotificationsModal';
import './css/Header.css';

const Header = ({ user, money, tokens, handleLogout }) => {
    const navigate = useNavigate();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <h1>TuTCG</h1>
                    </Link>
                </div>

                <nav>
                    <ul>
                        <li><Link to="/play" className="nav-link">Jugar</Link></li>
                        <li><Link to="/deck-editor" className="nav-link">Editor de Mazo</Link></li>
                        <li><Link to="/store" className="nav-link">Tienda</Link></li>
                        <li><Link to="/album" className="nav-link">Album</Link></li>
                    </ul>
                </nav>

                <div className="user-info">
                    <button className="icon-button" onClick={() => setIsUserModalOpen(true)}>
                        <User size={24} />
                    </button>
                    <button className="icon-button" onClick={() => setIsMessagesModalOpen(true)}>
                        <Mail size={24} />
                    </button>
                    <button className="icon-button" onClick={() => setIsNotificationsModalOpen(true)}>
                        <Bell size={24} />
                    </button>
                </div>

                <div className="economy">
                    <span className="economy-item">
                        <DollarSign size={18} />
                        {money}
                    </span>
                    <span className="economy-item">
                        <Coins size={18} />
                        {tokens}
                    </span>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                </button>
            </div>

            <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={user} />
            <MessagesModal isOpen={isMessagesModalOpen} onClose={() => setIsMessagesModalOpen(false)} />
            <NotificationsModal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)} />
        </header>
    );
};

export default Header;