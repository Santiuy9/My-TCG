import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [money, setMoney] = useState(0);
    const [tokens, setTokens] = useState(0);

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
                        const userData = await response.json();
                        setIsLoggedIn(true);
                        setUser(userData);
                        setMoney(userData.money || 0);
                        setTokens(userData.tokens || 0);
                    }
                    else {
                        setIsLoggedIn(false);
                        setUser(null);
                        setMoney(0);
                        setTokens(0);
                    }
                }
                catch(error) {
                    console.error("Error al validar Token", error);
                    setIsLoggedIn(false)
                }
            };
            fetchUser();
        }
    }, []);

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        setMoney(userData.money || 0);
        setTokens(userData.tokens || 0);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setMoney(0);
        setTokens(0);

    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, money, tokens, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};