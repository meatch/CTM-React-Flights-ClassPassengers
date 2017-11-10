/*-------------------------------------
| Imports
-------------------------------------*/
/* React and React Dom, Vendor components -------------------------------*/
import React, { Component } from 'react'; //Manages components
import ReactDOM from 'react-dom'; //Manages the DOM views. (Shadow Dom)

/* My Personal Components -------------------------------*/
import Room from './components/room'; //no need to add .jsx
// import PropTypes from 'proptypes'; //get this package - for validation - to ensure integrity of data

/*-------------------------------------
| Create an component that produces HTML
-------------------------------------*/
/* New ES6 syntax which also changes the nature of the "this" keyword -------------------------------*/
class HotelsRoomsGuests extends Component {
	// static propTypes = {
	// 	maxRooms : PropTypes.number.isRequired,
	// 	minRooms: PropTypes.number.isRequired,
    //
	// }

	// Props hold non-changing values for example min and max numbers - this can also be handled by redux.
	static deafultProps = {
        roomsMin: 1,
		roomsMax: 4,
		roomsAdultsMin: 1, //every room must have 1 adult
		guestsMax: 6,
	}

    constructor(props) {
        super(props);

        // default states to keep track of. These states, when updated, will impact all that are bound to it.
		this.state = {
			rooms: [
				{
					adults: 0,
					children: [ 1, 3 ,5 ] //no need to store count, we can use length.
				},
				{
					adults: 0,
					children: [ 1, 3 ,5 ]
				}
			]
        };

        /*-------------------------------------
        | Get Count of Adults and Children
        -------------------------------------*/
        // rooms.reducer((i, room)=>{
        //     return i + room.adults;
        // }, 0);
        //
        // rooms.reducer((i, room)=>{
        //     return i + room.children.length;
        // }, 0);
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
        // let totalGuests = this.state.people.children + this.state.people.adults;
        // let totalRooms = this.state.rooms.rooms.length;
        // let pluralGuests = (totalGuests > 1) ? 's':'';
        // let pluralRooms = (totalRooms > 1) ? 's':'';
        //
        // if (this.state.people.children > 0)
        // {
        //     newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Guests`;
        // }
        // else
        // {
        //     newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Adult${pluralGuests}`;
        // }
        return newDisplayText;
		// this.setState({ displayText: newDisplayText });
	};

    /*-------------------------------------
    | @ childKey int :: Key of the child that is sending the request
    | @ num int :: positive or negative number to add or subtract adults
    -------------------------------------*/
    addSubtract_adults(childKey, num) {
        console.log('Adding or Subtracting Adult');
    }
    addSubtract_children() {
        console.log('Adding or Subtracting Children');
    }

	/*-------------------------------------
	| Adding and Subtracting Rooms
	-------------------------------------*/
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
    	            <div className="displayText">{ this.updateDisplayText() }</div>
    	            <span className="glyphicon glyphicon-menu-down"></span>
    	        </div>
                <div className="roomGuest-modal">
                    <div className="stats">
                        <span> <b>Rooms: </b> { this.state.rooms.length }</span>
                        <span> <b>Guests: </b> TBD</span>
                        <span> <b>Adults: </b> TBD</span>
                        <span> <b>Children: </b> TBD</span>
                    </div>

                    <button
                        onClick={ () => this.modalHide() }
                        className="close">X</button>

                    <div className="rooms">
                        <Room
                            key={'room1'}
                            roomNum={1}
                            adults={1}
                            children={0}
                            addSubtract_adults={this.addSubtract_adults}
                            addSubtract_children={this.addSubtract_children}
                        />
                    </div>

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

