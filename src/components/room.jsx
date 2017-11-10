// node_modules
import React from 'react';

// Mine
const Room = (room) => {

    const childAgeOptions = Array.from(Array(18).keys()); //range from 0-17

    const childAgeSelects = room.children.map((child, i) => {
        return (
            <select
                key={i}
                className="child form-control"
                name="children[]"
                onChange={ (event) => room.updateChildAge(room.index, i, parseInt(event.target.value)) }
            >
                {
                    childAgeOptions.map((age) => {
                        return (
                            <option
                                key={age}
                                selected={age === child}
                                value={age}>{age}</option>
                        );
                    })
                }
            </select>
		);
	});

    return (
        <div className="room">
            <h1>Room {room.roomNum} </h1>
            <div className="addSubtractAdultsChildren">
                <div className="set">
                    <label className="adults">Adults (18-64)</label>
                    <div className="controls addSubtract">
                        <button
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_adults(room.index, 'minus') }
                        >-</button>

                        <div className="peopleCount">{room.adults}</div>
                        <button
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_adults(room.index, 'plus') }
                        >+</button>
                    </div>
                </div>
                <div className="set">
                    <label className="children">Children (0-17)</label>
                    <div className="controls addSubtract">
                        <button
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_children(room.index, 'minus') }
                        >-</button>
                        <div className="peopleCount">{room.children.length}</div>
                        <button
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_children(room.index, 'plus') }
                        >+</button>
                    </div>
                    <div className="ages">
                        { childAgeSelects }
                    </div>

                </div>
            </div>
        </div>
    );
};

// This relieves us from always having to instantiate. Anythig that imports this file will have it by defult.
export default Room;