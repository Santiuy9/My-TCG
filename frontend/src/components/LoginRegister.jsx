import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import './css/LoginRegister.css'

export default function LoginRegister({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const requestData = isLogin
        ? {username, password}
        : {username, email, password};

        console.log(requestData);

        try {
            const response = await fetch(`http://localhost:3000/api/auth/${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Success:', result);
                if (isLogin) {
                    localStorage.setItem('token', result.token);
                    onLogin(result.user);
                    navigate('/')
                }
                else {
                    setIsLogin(true);
                    setError("Registro exitoso. Por favor, inicia sesion")
                }
            }
            else {
                throw new Error(result.message || 'Error en la solicitud');
            }
        }
        catch(err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="background-pattern"></div>
            <div className="form-container">
                <div className="tabs">
                    <button
                        className={`tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        className={`tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Registrarse
                    </button>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                  <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                  <div className="input-group">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Usuario"
                      />
                  </div>
                    {!isLogin && (
                    <div className="input-group">
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        />
                    </div>
                    )}
                  <div className="input-group">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Contraseña"
                    />
                  </div>
                  <button type="submit">{isLogin ? 'Entrar' : 'Registrarse'}</button>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

