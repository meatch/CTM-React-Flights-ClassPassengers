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
	static defaultProps = {
        roomsMin: 1,
		roomsMax: 4,
		roomsAdultsMin: 1, //every room must have 1 adult
		guestsMax: 6,
	}

    constructor(props) {
        super(props);

		/*-------------------------------------
		| A bunch of bindings to manage this scope
		-------------------------------------*/
		/* Sending to children -------------------------------*/
		this.addSubtract_adults = this.addSubtract_adults.bind(this);
		this.addSubtract_children = this.addSubtract_children.bind(this);
		this.updateChildAge = this.updateChildAge.bind(this);
		/* Clicking outside of component -------------------------------*/
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        // default states to keep track of. These states, when updated, will impact all that are bound to it.
		this.state = {
			modalDisplay: 'hidden',
			rooms: [
				{
					adults: 1,
					children: [] //no need to store count, we can use length.
				}
            ],
			roomsSavedState: [
				{
					adults: 1,
					children: [] //no need to store count, we can use length.
				}
            ], //so when we revert back to last saved state
        };

        // this.init(); //Question for Steve, is there an init for React?
    }

	/*-------------------------------------
	| Question for Steve, is there an init for React?
	-------------------------------------*/
    // init = () => {
    //     this.setState({roomsSaved: this.state.rooms});
    // }

	/*-------------------------------------
	| Detect when user clicks outside of component
	| https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
	-------------------------------------*/
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.storeState();
        }
	}

    // FAT ARROW FUNCTIONS CHANGES SCOPE OF KEYWORD THIS - to be scoped to this Class. Children Containers can use it too.
	updateDisplayText = () => {
        let newDisplayText = '1 Room, 1 Adult'; //default

        // Guests
		let totalAdults = this.adultCount();
		let totalChildren = this.childCount();
        let totalGuests = totalAdults + totalChildren;
        let pluralGuests = (totalGuests > 1) ? 's':'';

        // Rooms
		let totalRooms = this.state.rooms.length;
        let pluralRooms = (totalRooms > 1) ? 's':'';

        // Evaluate and render
        if (totalChildren > 0)
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Guests`;
        }
        else
        {
            newDisplayText = `${totalRooms} Room${pluralRooms}, ${totalGuests} Adult${pluralGuests}`;
        }

        return newDisplayText;
	};

	/*-------------------------------------
	| Show and Hide Modal
	-------------------------------------*/
    modalShow = () => {
		let modalDisplay = this.state.modalDisplay;
		modalDisplay = '';
		this.setState({ modalDisplay: modalDisplay });
	}
    modalHide = () => {
		let modalDisplay = this.state.modalDisplay;
		modalDisplay = 'hidden';
		this.setState({ modalDisplay: modalDisplay });
	}

	storeState() {
		let rooms = this.deep_clone(this.state.rooms);
		this.setState({ roomsSavedState: rooms });
		this.modalHide();
	}

	resetToLastSavedState() {
		let roomsSavedState = this.deep_clone(this.state.roomsSavedState);
		this.setState({ rooms: roomsSavedState });
		this.modalHide();
	}

    // Cloining Arrays for Storing State
	// https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
	deep_clone(srcArray) {

		/* faster, shallow copy - as references -------------------------------*/
		// let rooms  = this.state.rooms.slice(0); //older approach
		// let rooms  = [...this.state.rooms]; //es6 cloning array

		/* JSON Approach - cannot be used if array contains methods, undefined, null -------------------------------*/
		return JSON.parse(JSON.stringify(srcArray));
	}

    rooms_render() {
        return this.state.rooms.map((room, i) => (
            <Room
                key={i}
                index={i}
                roomNum={i+1}
                adults={room.adults}
                children={room.children}
                addSubtract_adults={this.addSubtract_adults}
                addSubtract_children={this.addSubtract_children}
                updateChildAge={this.updateChildAge}
            />
        ))
    }

	/*-------------------------------------
	| Cound number of guests, adults and children
	-------------------------------------*/
	guestCount () {
		return this.adultCount() + this.childCount();
	}

	/*-------------------------------------
	| Cound number of guests, adults and children
	-------------------------------------*/
	adultCount () {
		return this.state.rooms.reduce((i, room)=>{
		    return i + room.adults;
		}, 0);
	}

	/*-------------------------------------
	| Cound number of guests, adults and children
	-------------------------------------*/
	childCount () {
		return this.state.rooms.reduce((i, room)=>{
		    return i + room.children.length;
		}, 0);
	}

	/*-------------------------------------
	| Adding and Subtracting Rooms
    | @ plusMinus str :: plus or minus
	-------------------------------------*/
    addSubtract_rooms = (plusMinus) => {
		let rooms = this.state.rooms;
		let roomCount = rooms.length;

		let isMaxGuestCount = (this.guestCount() === this.props.guestsMax) ? true:false;

		if (plusMinus === 'plus' && roomCount !== this.props.roomsMax && !isMaxGuestCount)
		{
			rooms.push({adults: 1,children: []});
		}
		else if (plusMinus === 'minus' && roomCount !== this.props.roomsMin)
		{
			rooms.pop(); //delete last room
		}

        this.setState({rooms: rooms});
    }

    /*-------------------------------------
    | @ roomIndex int :: Index Key of the child that is sending the request - so we can update the appropriate values
    | @ plusMinus int :: positive or negative plusMinusber to add or subtract adults
    -------------------------------------*/
    addSubtract_adults(roomIndex, plusMinus) {
		let rooms = this.state.rooms;

		if (plusMinus === 'plus')
		{
			let guestCount = this.guestCount();
			let guestsMax = this.props.guestsMax;
			if (guestCount !== guestsMax)
			{
				rooms[roomIndex].adults++;
			}
		}
		else if (plusMinus === 'minus')
		{
			if (rooms[roomIndex].adults > 1) //must have at least 1 adult per room.
			{
				rooms[roomIndex].adults--;
			}
		}
        this.setState({rooms: rooms});
    }

    addSubtract_children(roomIndex, plusMinus) {
		let rooms = this.state.rooms;

		if (plusMinus === 'plus')
		{
			let guestCount = this.guestCount();
			let guestsMax = this.props.guestsMax;
			if (guestCount !== guestsMax)
			{
				rooms[roomIndex].children.push(0); //age is zero to start, till they choose from the drop down.
			}
		}
		else if (plusMinus === 'minus')
		{
			if (rooms[roomIndex].children.length > 0) //ok to have no children
			{
				rooms[roomIndex].children.pop();
			}
		}

        this.setState({rooms: rooms});
    }

	updateChildAge(roomIndex, childIndex, age) {
		let rooms = this.state.rooms;
		rooms[roomIndex].children[childIndex] = age;
        this.setState({rooms: rooms});
	}

    render() {
        return  (
            <div ref={this.setWrapperRef}>
                <div
                    onClick={ () => this.modalShow() }
                    className="primary-text-display">
    	            <div className="displayText">{ this.updateDisplayText() }</div>
    	            <span className="glyphicon glyphicon-menu-down"></span>
    	        </div>
                <div className={"roomGuest-modal " +  this.state.modalDisplay }>
                    <div className="stats">
                        <span> <b>{ this.state.rooms.length }</b> Room(s)</span>
                        <span> <b>{ this.guestCount() }</b> Guest(s)</span>
                        <span> <b>{ this.adultCount() }</b> Adult(s)</span>
                        <span> <b>{ this.childCount() }</b> Children</span>
                    </div>

                    <button
                        onClick={ () => this.resetToLastSavedState() }
                        className="close">X</button>

                    <div className="rooms">{ this.rooms_render() }</div>

                    <button
                        onClick={ () => this.addSubtract_rooms('plus') }
                        type="button"
                        className="roomAdd">+ Add Room</button>
                    <button
                        onClick={ () => this.addSubtract_rooms('minus') }
                        type="button"
                        className="roomMinus">- Subtract Room</button>

					<div className="store">
						<button
	                        onClick={ () => this.storeState() }
	                        type="button">Continue</button>
					</div>

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

