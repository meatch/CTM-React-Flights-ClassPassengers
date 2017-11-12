// node_modules
import React from 'react';

// Mine
const Room = (room) => {

    const childAgeOptions = Array.from(Array(18).keys()); //range from 0-17

    const childAgeSelects = room.children.map((child, i) => {

        let missing = (child === -1) ? ' missing':'';

        return (
            <select
                key={i}
                className={"child form-control" +  missing}
                name="children[]"
                value={child}
                onChange={ (event) => room.updateChildAge(room.index, i, parseInt(event.target.value)) }
            >
                <option key="default" value="-1">--</option>
                {
                    childAgeOptions.map((age) => {
                        return (
                            <option
                                key={age}
                                value={age}>{age}</option>
                        );
                    })
                }
            </select>
		);
	});

    /*-------------------------------------
    | Remove Room Button
    -------------------------------------*/
    let removeRoomButton = '';
    if (room.index > 0)
    {
        removeRoomButton = <button
            disabled={room.subtrRoomDisabled}
            onClick={ () => room.subtract_rooms(room.index) }
            type="button"
            className="roomMinus">- Remove</button>
    }

    /*-------------------------------------
    | Child Ages Label
    -------------------------------------*/
    let agesLabel = '';
    console.log(room.children);
    if (room.children.length === 1)
    {
        agesLabel = <label>Child age at check in</label>;
    }
    else if (room.children.length > 1)
    {
        agesLabel = <label>Child ages at check in</label>;
    }

    return (
        <div className="room">
            <div className="title">
                <h1>Room {room.roomNum}</h1>
                { removeRoomButton }
            </div>
            <div className="addSubtractAdultsChildren">
                <div className="set adults cf">
                    <label className="adults">Adults (18-64)</label>
                    <div className="controls addSubtract">
                        <button
                            disabled={(room.adults === 1)}
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_adults(room.index, 'minus') }
                        >-</button>

                        <div className="peopleCount">{room.adults}</div>
                        <button
                            disabled={room.isMaxGuests}
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_adults(room.index, 'plus') }
                        >+</button>
                    </div>
                </div>
                <div className="set children cf">
                    <label className="children">Children (0-17)</label>
                    <div className="controls addSubtract">
                        <button
                            disabled={(room.children.length === 0)}
                            type="button"
                            className="subtract"
                            onClick={ () => room.addSubtract_children(room.index, 'minus') }
                        >-</button>
                        <div className="peopleCount">{room.children.length}</div>
                        <button
                            disabled={room.isMaxGuests}
                            type="button"
                            className="add"
                            onClick={ () => room.addSubtract_children(room.index, 'plus') }
                        >+</button>
                    </div>
                    <div className="ages">
                        {agesLabel}
                        { childAgeSelects }
                    </div>
                </div>
            </div>
        </div>
    );
};

// This relieves us from always having to instantiate. Anythig that imports this file will have it by defult.
export default Room;