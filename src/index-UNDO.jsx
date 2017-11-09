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
            roomComponents: [],
            rooms: {
                rooms: [
                    { adults: 1, children: 0 }
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

    componentDidMount = () => {
        this.renderRoomComponents();
    }

    setAdultCount = (count) => {
        const people = this.state.people;
        people.adults = count;
		this.setState({ people: people });
    }

    setChildCount = (count) => {
        const people = this.state.people;
        people.children = count;
		this.setState({ people: people });
    }

    // Every time we add or subtract people/rooms, we need to check against all to see if we can, and/or update stats
	evaluateRoomsAndGuests = () => {
        console.log('Evaluate Rooms and Guests');
	};

    // FAT ARROW FUNCTIONS CHANGES SCOPE OF KEYWORD THIS - to be scoped to this Class. Children Containers can use it too.
	updateDisplayText = () => {
        console.log('Update Display Text');
        let newDisplayText = '1 Room, 1 Adult'; //default
        let totalGuests = this.state.children + this.state.adults;
        let totalRooms = this.state.rooms;
        let pluralGuests = (totalGuests > 1) ? 's':'';
        let pluralRooms = (totalRooms > 1) ? 's':'';

        if (this.state.children > 0)
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Guests`;
        }
        else
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Adult${pluralGuests}`;
        }

		this.setState({ displayText: newDisplayText });
	};

    renderRoomComponents = () => {
        let roomComponents = this.state.rooms.rooms.map((room, index) => {

            let roomNum = index + 1;

            return <Room
                        key={'room' + index}
                        roomIndex={index}
                        roomNum={roomNum}
                        rootState={this.state}
                        setAdultCount={this.setAdultCount}
                        setChildCount={this.setChildCount}
                        />
        })
        this.setState({ roomComponents: roomComponents });
    }

    roomAdd = () => {
        let numRooms = this.state.rooms.rooms.length;
        let maxRooms = this.state.rooms.max;
        let minRooms = this.state.rooms.min;

        if (numRooms < maxRooms)
        {
            // need to add an adult whenever we add a room, at least one addult.
            // Also should not add a room if we have hit our max occupancy.
            let adultCount = this.state.people.adults;
            adultCount = adultCount + 1;
            this.setAdultCount(adultCount);
            this.state.rooms.rooms.push({ adults: 1, children: 0 });
            console.log(this.state.rooms.rooms);
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
        this.renderRoomComponents();
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


        this.renderRoomComponents();
        // this.updateDisplayText();
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
                    <div className="rooms"> { this.state.roomComponents } </div>
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

