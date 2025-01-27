import React from "react";
import "./css/Slot.css";

export default function Slot({ data = null, onClick, type = "default", slotData }) {

    console.log(slotData);

    const handleClick = () => {
        if (onClick) onClick();
    };

    const renderContent = () => {
        if (type === "deck") {
            return (
                <>
                    <img className="slot-img" src="../src/assets/Cards/CardSlot.png" alt="Deck" />
                    <p className="slot-text">x {Array.isArray(data) ? data.length : 0}</p>
                </>
            );
        }
        if (type === "graveyard") {
            return (
                <>
                    <img className="slot-img" src="../src/assets/Cards/CardSlot.png" alt="Graveyard" />
                    <p className="slot-text">x {Array.isArray(data) ? data.length : 0}</p>
                </>
            );
        }
        return (
            <>
                <img
                    className="slot-img"
                    src={`../src/assets/Cards/${data?.image || "DefaultSlot.png"}`}
                    // alt={data?.name || "Empty"}
                />
                <p className="slot-text">{data ? data.name : "Empty"}</p>
            </>
        );
    };

    return (
        <div className="slot" onClick={handleClick}>
            {renderContent()}
        </div>
    );
}
