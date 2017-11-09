/*-------------------------------------
| Imports
-------------------------------------*/
/* React and React Dom, Vendor components -------------------------------*/
import React, { Component } from 'react'; //Manages components
import ReactDOM from 'react-dom'; //Manages the DOM views. (Shadow Dom)

/* My Personal Components -------------------------------*/
import Room from './components/room'; //no need to add .jsx

/*-------------------------------------
| Create an component that produces HTML
-------------------------------------*/
/* New ES6 syntax which also changes the nature of the "this" keyword -------------------------------*/
class HotelsRoomsGuests extends Component {
    constructor(props) {
        super(props);

        // default states to keep track of. These states, when updated, will impact all that are bound to it.
		this.state = {
            displayText: '1 Room, 1 Adult',
            rooms: {
                rooms: [
                    <Room
                        key={'room0'}
                        roomIndex={0}
                        roomNum={1}
                        rootThis={this}
                    />
                ],
                max: 4,
                min: 1
            },
            people: {
                adults: 1,
                children: 0,
                max: 6,
                min: 1,
            },
        };
    }

    // Add Adult to Adult count
    updatePeopleCount = (newPeopleArray) => {
        console.log('UPDATING updatePeopleCount');
        this.updateDisplayText();
        this.setState({ people: newPeopleArray });
    }

    // Every time we add or subtract people/rooms, we need to check against all to see if we can, and/or update stats
	evaluateRoomsAndGuests = () => {
        console.log('Evaluate Rooms and Guests');
	};

    // FAT ARROW FUNCTIONS CHANGES SCOPE OF KEYWORD THIS - to be scoped to this Class. Children Containers can use it too.
	updateDisplayText = () => {
        console.log('Update Display Text');
        let newDisplayText = '1 Room, 1 Adult'; //default
        let totalGuests = this.state.people.children + this.state.people.adults;
        let totalRooms = this.state.rooms.rooms.length;
        let pluralGuests = (totalGuests > 1) ? 's':'';
        let pluralRooms = (totalRooms > 1) ? 's':'';

        if (this.state.people.children > 0)
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Guests`;
        }
        else
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Adult${pluralGuests}`;
        }

		this.setState({ displayText: newDisplayText });
	};

    roomAdd = () => {
        let numRooms = this.state.rooms.rooms.length;
        let maxRooms = this.state.rooms.max;
        let minRooms = this.state.rooms.min;

        if (numRooms < maxRooms)
        {
            let index = numRooms;
            let roomNum = index + 1;
            let newRoom = <Room
                            key={'room' + index}
                            roomIndex={index}
                            roomNum={roomNum}
                            rootThis={this}
                        />

            this.state.rooms.rooms.push(newRoom);

            // add 1 adult for each room by default
            let newPeopleArray = this.state.people;
            newPeopleArray.adults = newPeopleArray.adults + 1;
            this.updatePeopleCount(newPeopleArray); // root count and state update

            this.setState({ rooms: this.state.rooms});
        }

        // check count again
        numRooms = this.state.rooms.rooms.length;

        if (numRooms > minRooms)
        {
            $('.roomMinus').prop("disabled",false);
        }

        if (numRooms == maxRooms)
        {
            $('.roomAdd').prop("disabled",true);
            console.log('You hit the max rooms');
        }

    }

    roomMinus = () => {
        let numRooms = this.state.rooms.rooms.length;
        let maxRooms = this.state.rooms.max;
        let minRooms = this.state.rooms.min;

        if (numRooms > minRooms)
        {
            // need to subtract the number of adults and children from the PeopleAddSubtract grandchild

            console.log(this.state.rooms.rooms);

            this.state.rooms.rooms.pop();

            this.setState({ rooms: this.state.rooms});
        }

        // check count again
        numRooms = this.state.rooms.rooms.length;

        if (numRooms < maxRooms)
        {
            $('.roomAdd').prop("disabled",false);
        }

        if (numRooms == minRooms)
        {
            $('.roomMinus').prop("disabled",true);
            console.log('You hit the min rooms');
        }


    }
    modalShow = () => {
        // $('.roomGuest-modal').show();
    }

    modalHide = () => {
        // $('.roomGuest-modal').hide();
    }


    render() {
        return  (
            <div>
                <div
                    onClick={ () => this.modalShow() }
                    className="primary-text-display">
    	            <div className="displayText">{this.state.displayText}</div>
    	            <span className="glyphicon glyphicon-menu-down"></span>
    	        </div>
                <div className="roomGuest-modal">
                    <div className="stats">
                        <span> <b>Rooms: </b> { this.state.rooms.rooms.length }</span>
                        <span> <b>Guests: </b> { (this.state.people.adults + this.state.people.children) }</span>
                        <span> <b>Adults: </b> { this.state.people.adults }</span>
                        <span> <b>Children: </b> { this.state.people.children }</span>
                    </div>

                    <button
                        onClick={ () => this.modalHide() }
                        className="close">X</button>

                    <div className="rooms"> { this.state.rooms.rooms } </div>

                    <button
                        onClick={ () => this.roomAdd() }
                        type="button"
                        className="roomAdd">+ Add Room</button>
                    <button
                        onClick={ () => this.roomMinus() }
                        type="button"
                        className="roomMinus">- Subtract Room</button>
                </div>
            </div>
        );
    }
}

/*-------------------------------------
| Add Generated HTML Component to DOM
-------------------------------------*/
// ReactDOM.render(<HotelsRoomsGuests></HotelsRoomsGuests>, document.querySelector('.container'));
// or
ReactDOM.render(<HotelsRoomsGuests/>, document.querySelector('.hotelRoomsGuests'));

