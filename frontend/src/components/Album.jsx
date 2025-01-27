import React, { useEffect, useState } from "react"
import axios from "axios"
import FancyButton from "./FancyButton"
import "./css/Album.css"

export default function Album() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/cards")
      .then((response) => {
        console.log("Datos recibidos del servidor", response.data)
        setCards(response.data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Error al cargar las cartas")
        setLoading(false)
      })
  }, [])

  const renderCardDetails = (card) => {
    switch (card.type) {
      case "Hero":
        return (
          <>
            <p>Tipo: {card.type}</p>
            <p>Rareza: {card.rarity}</p>
            <p>Ataque: {card.attack}</p>
            <p>HP: {card.hp}</p>
            <p>Costo: {card.cost}</p>
            <p>Cronología: {card.chronology}</p>
            <p>Cronología Previa: {card["chronology-prev"]}</p>
            <p>Cronología Siguiente: {card["chronology-next"]}</p>
            <p>Descripción: {card.description}</p>
          </>
        )
      case "Nexus":
        return (
          <>
            <p>Tipo: {card.type}</p>
            <p>Rareza: {card.rarity}</p>
            <p>HP: {card.hp}</p>
            <p>Costo: {card.cost}</p>
            <p>Descripción: {card.description}</p>
          </>
        )
      case "Spell":
        return (
          <>
            <p>Tipo: {card.type}</p>
            <p>Rareza: {card.rarity}</p>
            <p>Enfriamiento: {card.cooldown}</p>
            <p>Costo: {card.cost}</p>
            <p>Descripción: {card.description}</p>
          </>
        )
      case "Artifact":
        return (
          <>
            <p>Tipo: {card.type}</p>
            <p>Rareza: {card.rarity}</p>
            <p>Costo: {card.cost}</p>
          </>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <div className="loading">Cargando cartas...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="album-page">
      <div className="album-button-container">
        <FancyButton
          variant="primary"
          onClick={() => {
            window.location.href = "https://heyzine.com/flip-book/7f6af1f776.html"
          }}
        >
          Ver Album
        </FancyButton>
      </div>
      <div className="album-container">
        <h1>Álbum de Cartas</h1>
        <div className="cards-grid">
          {cards.map((card) => (
            <div key={card._id} className={`card ${card.type}`}>
              <div className="card-image">
                <img src={`../src/assets/Cards/${card.image_url}`} alt={card.name} />
              </div>
              <div className="card-details">
                <h3>{card.name}</h3>
                {renderCardDetails(card)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}