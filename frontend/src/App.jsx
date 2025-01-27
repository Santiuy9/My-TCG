import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import Header from "./components/Header";
import Home from "./components/Home";
import Play from "./components/Play"
import Deck from "./components/Deck";
import Store from "./components/Store"
import Album from "./components/Album";
import Battle from "./components/Card"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [money, setMoney] = useState(0);
    const [tokens, setTokens] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/auth/me", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const user = await response.json();
                        handleLogin(user);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Error al validar el token", error);
                    handleLogout();
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    const handleLogin = (userData) => {
        console.log("Datos del usuario recibidos:", userData);
        setIsLoggedIn(true);
        setUser(userData);
        setMoney(userData.money || 0);
        setTokens(userData.tokens || 0);
        // console.log("Estado actualizado:", {
        //     isLoggedIn: true,
        //     money: userData.money,
        //     tokens: userData.tokens,
        // })
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setMoney(0);
        setTokens(0);
    };

    const handleAddToCart = (product) => {
        if (product.type === "booster") {
            if (product.priceInMoney && money >= product.priceInMoney) {
                setMoney(money - product.priceInMoney);
                alert("¡Booster comprado con monedas!");
            }
            else if (product.priceInTokens && tokens >= product.priceInTokens) {
                setTokens(tokens - product.priceInTokens);
                alert("¡Booster comprado con tokens!");
            }
        }
        else if (product.type === "card") {
            if (tokens >= product.price) {
                setTokens(tokens - product.price);
                alert("¡Carta comprada con exito!")
            }
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <Router>
            {isLoggedIn && user && money !== null && tokens !== null && (
                <Header user={user} money={money} tokens={tokens} handleLogout={handleLogout} />
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        isLoading ? (
                            <div>Cargando usuario...</div>
                        ) : (
                            <Home isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
                        ) 
                    }
                />
                <Route
                    path="/album"
                    element={isLoggedIn ? <Album /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/play"
                    element={isLoading ? <div>Cargando...</div> : (isLoggedIn ? <Play /> : <Navigate to="/auth" />)}
                />
                <Route
                    path="/deck-editor"
                    element={isLoggedIn ? <Deck /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/store"
                    element={
                        isLoggedIn ? (
                            <Store money={money} tokens={tokens} setMoney={setMoney} setTokens={setTokens} />
                        ) : (
                            <Navigate to="/auth" />
                        )
                    }
                />
                <Route
                    path="/auth"
                    element={isLoggedIn ? <Navigate to="/" /> : <LoginRegister onLogin={handleLogin} />}
                />
                <Route
                    path="/battle"
                    element={isLoading ? <div>Cargando...</div> : (isLoggedIn ? <Battle /> : <Navigate to="/auth" />)}
                />
            </Routes>
        </Router>
    );
}

export default App;