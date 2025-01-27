import React from "react";
import { useNavigate } from "react-router-dom";

import "./css/Home.css";

export default function Home({ isLoggedIn, user, handleLogout}) {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {isLoggedIn ? (
                <>
                    <h1>Bienvenido {user.username} a TuTCG</h1>
                    <p>¡Crea, batalla y domina en el universo de cartas!</p>
                    <div className="home-options">
                        <button onClick={() => navigate("/play")}>Jugar</button>
                        <button onClick={() => navigate("/deck-editor")}>Editar Mazo</button>
                        <button onClick={() => navigate("/store")}>Tienda</button>
                        <button onClick={() => navigate("/album")}>Album</button>
                    </div>
                </>
            ) : (
                <>
                    <h1>Bienvenido a TuTCG</h1>
                    <p>¡Crea, batalla y domina en el universo de cartas!</p>
                    <div className="home-options">
                        <button onClick={() => navigate("/auth")}>Inicia Sesion</button>
                    </div>
                </>
            )}
        </div>
    );
}
