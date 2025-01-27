import React from "react";
import Slot from "./Slot";
import "./css/Zone.css";

export default function Zone({ zoneName, zoneType, cards, onDropCard }) {
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const cardData = JSON.parse(event.dataTransfer.getData("card"));

        if (onDropCard) {
            console.log(zoneName);
            console.log(zoneType);
            onDropCard(cardData, {
                zoneType: zoneName ? "heroZone" : "nexo",
                zoneName: zoneName?.toLowerCase(),
            });
        }
    };

    return (
        <div className="zone">
            <div className="zone-slots">
                {cards.map((card, index) => (
                    <Slot
                        key={index}
                        slotData={{
                            zoneName,
                            zoneType,
                            index,
                        }}
                        card={card}
                        onDrop={(droppedCard, slotInfo) => onDropCard(droppedCard, slotInfo)}
                    />
                ))}
            </div>
        </div>
    );
}
