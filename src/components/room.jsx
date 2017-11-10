// node_modules
import React from 'react';

// Mine
const Room = (room) => {

    return (
        <div className="room">
            <h1>Room {room.roomNum}</h1>
            <div className="addSubtractAdultsChildren">
                <div className="set">
                    <label className="adults">Adults (18-64)</label>
                    <div className="controls addSubtract">
                        <button
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_adults(room.key, 1) }
                        >-</button>
                        <div className="peopleCount">{room.adults}</div>
                        <button
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_adults(room.key, -1) }
                        >+</button>
                    </div>
                </div>
                <div className="set">
                    <label className="children">Children (0-17)</label>
                    <div className="controls addSubtract">
                        <button
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_children(room.key, 1) }
                        >-</button>
                        <div className="peopleCount">{room.children}</div>
                        <button
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_children(room.key, -1) }
                        >+</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// This relieves us from always having to instantiate. Anythig that imports this file will have it by defult.
export default Room;