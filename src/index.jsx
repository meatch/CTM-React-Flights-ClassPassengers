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
		this.subtract_rooms = this.subtract_rooms.bind(this);
		this.updateChildAge = this.updateChildAge.bind(this);
		/* Clicking outside of component -------------------------------*/
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

		this.lottaChildren = [10,11,13,9];

        // default states to keep track of. These states, when updated, will impact all that are bound to it.
		this.state = {
			modalDisplay: '', //hidden should be default, unless testing
			showErrors: '',
			errorMessages: [],
			isMaxGuests: false,
			isMaxRooms: false,
			rooms: [
				{
					adults: 1,
					children: [] //no need to store count, we can use length.
				}
            ],
			roomsSavedState: [
				{
					adults: 1,
					children: []
				}
            ], //so when we revert back to last saved state
        };

        // @TODO this.init(); //Question for Steve, is there an init for React?
    }

	/*-------------------------------------
	| @TODO Question for Steve, is there an init for React?
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
	    document.addEventListener("keydown", (e) => { this.handKeyDownEvents(e) },false);

		this.isMaxRoomsAndGuests(); //if this form is sticky, they may have already maxed it out
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

	/*-------------------------------------
	| Keydown Events (e.g. Escape Key)
	-------------------------------------*/
	handKeyDownEvents(e) {
		if(e.keyCode == 27)
		{
			this.resetToLastSavedState();
		}
	}


    setWrapperRef(node) {
        this.wrapperRef = node;
    }
	handleClickOutside(event) {
        // Need to allow the user to scroll the main window - this form can be vertically challenged.
        // @TODO native JS?
		// let clickedWindowScroll = ( window.offsetWidth <= event.clientX ) ? true:false;
		let clickedWindowScroll = ( $(window).outerWidth() <= event.clientX ) ? true:false;

		if (this.wrapperRef && !this.wrapperRef.contains(event.target) && !clickedWindowScroll) {
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

    // FAT ARROW FUNCTIONS CHANGES SCOPE OF KEYWORD THIS - to be scoped to this Class. Children Containers can use it too.
	errorMessages = () => {
        let errorMessages = this.state.errorMessages.map((message, i) => {
			return <li key={i}>{message}</li>;
		});
        return errorMessages;
	};

	/*-------------------------------------
	| Show and Hide Modal
	-------------------------------------*/
    modalShow = () => {
		this.setState({ modalDisplay: '' });
	}
    modalHide = () => {
		this.setState({ modalDisplay: 'hidden' });
	}

	storeState() {
        // validate children ages

		this.state.errorMessages = [];

		if (this.hasChildAges())
		{
			this.setState({ showErrors: '' });
			let rooms = this.deep_clone(this.state.rooms);
			this.setState({ roomsSavedState: rooms });
			this.modalHide();
		}
		else
		{
			this.setState({ showErrors: 'showErrors' });
			this.state.errorMessages.push('Please provide ages for all Children');
		}

	}
	/*-------------------------------------
	| See if user has provided ages for all children
	-------------------------------------*/
	hasChildAges() {
		let hasChildAges= true;
		let rooms = this.state.rooms;

		rooms.forEach((room)=>{
			room.children.forEach((child)=>{
				if (child === -1)
				{
					hasChildAges = false;
				}
			});
		});

		return hasChildAges;
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
				isMaxGuests={this.state.isMaxGuests}
                adults={room.adults}
                children={room.children}
                addSubtract_adults={this.addSubtract_adults}
                addSubtract_children={this.addSubtract_children}
                updateChildAge={this.updateChildAge}
				subtract_rooms={this.subtract_rooms}
				subtrRoomDisabled={this.state.rooms.length === 1}
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
	| Have we hit our max guest count yet?
	-------------------------------------*/
	isMaxRoomsAndGuests() {
        // check guest count first
		let guestCount = this.guestCount();
		let guestsMax = this.props.guestsMax;
		let isMaxGuests = (guestCount === guestsMax) ? true:false;

		this.setState({isMaxGuests: isMaxGuests});

        // check room count second - can't add room if we hit our guest max
		let isMaxRooms = (isMaxGuests || this.state.rooms.length === this.props.roomsMax) ? true:false;

		this.setState({isMaxRooms: isMaxRooms});
	}

	/*-------------------------------------
	| Adding and Subtracting Rooms
    | @ plusMinus str :: plus or minus
	-------------------------------------*/
    add_rooms = () => {
		let rooms = this.state.rooms;

		if (!this.state.isMaxRooms)
		{
			rooms.push({adults: 1,children: []});
			this.isMaxRoomsAndGuests(); //after adding did we hit our max guest count?
		}

        this.setState({rooms: rooms});
    }
    subtract_rooms = (roomIndex) => {
		let rooms = this.state.rooms;

		if (this.state.rooms.length !== this.props.roomsMin)
		{
			rooms.splice(roomIndex, 1); //delete this room by its index
			this.isMaxRoomsAndGuests(); //after adding did we hit our max guest count?
		}

        this.setState({rooms: rooms});
    }

	/*-------------------------------------
	| @ roomIndex int :: Index Key of the child that is sending the request - so we can update the appropriate values
	| @ plusMinus int :: positive or negative plusMinu to add or subtract adults
	-------------------------------------*/
	addSubtract_adults(roomIndex, plusMinus) {
		let rooms = this.state.rooms;

		if (plusMinus === 'plus')
		{
			if (this.guestCount() !== this.props.guestsMax)
			{
				rooms[roomIndex].adults++;
				this.isMaxRoomsAndGuests();
			}
		}
		else if (plusMinus === 'minus')
		{
			if (rooms[roomIndex].adults > 1) //must have at least 1 adult per room.
			{
				rooms[roomIndex].adults--;
				this.isMaxRoomsAndGuests();
			}
		}
        this.setState({rooms: rooms});
    }



	/*-------------------------------------
	| @ roomIndex int :: Index Key of the child that is sending the request - so we can update the appropriate values
	| @ plusMinus int :: positive or negative plusMinus to add or subtract adults
	-------------------------------------*/
    addSubtract_children(roomIndex, plusMinus) {
		let rooms = this.state.rooms;

		if (plusMinus === 'plus')
		{
			if (this.guestCount() !== this.props.guestsMax)
			{
				//age is -1 to start, till they choose from the drop down.
				// Used for validation too, they must choose and age
				rooms[roomIndex].children.push(-1);
				this.isMaxRoomsAndGuests(); //after adding did we hit our max guest count?
			}
		}
		else if (plusMinus === 'minus')
		{
			if (rooms[roomIndex].children.length > 0) //ok to have no children
			{
				rooms[roomIndex].children.pop();
				this.isMaxRoomsAndGuests();
			}
		}

        this.setState({rooms: rooms});
    }

	updateChildAge(roomIndex, childIndex, age) {
		let rooms = this.state.rooms;
		rooms[roomIndex].children[childIndex] = age;

        // see if we are currently showing errors, and re-evaluate to hide errors if user has corrected errors
		if (this.state.showErrors === 'showErrors' && this.hasChildAges())
		{
			this.state.showErrors = '';
		}

        this.setState({rooms: rooms});
	}

    render() {
        return  (
            <div ref={this.setWrapperRef} className={"HotelsRoomsGuests " +  this.state.showErrors }>
				<div className="stats">
					<span> <b>{ this.state.rooms.length }</b> Room(s)</span>
					<span> <b>{ this.guestCount() }</b> Guest(s)</span>
					<span> <b>{ this.adultCount() }</b> Adult(s)</span>
					<span> <b>{ this.childCount() }</b> Children</span>
				</div>
				<div className="content">
					<div
	                    onClick={ () => this.modalShow() }
	                    className="primary-text-display">
	    	            <div className="displayText">{ this.updateDisplayText() }</div>
	    	            <span className="glyphicon glyphicon-menu-down"></span>
	    	        </div>
	                <div className={"roomGuest-modal " +  this.state.modalDisplay }>
	                    <button
	                        onClick={ () => this.resetToLastSavedState() }
	                        className="close">X</button>

						<div className="errorMessage">
							<ul>
								{ this.errorMessages() }
							</ul>
						</div>


	                    <div className="rooms">{ this.rooms_render() }</div>

	                    <button
							disabled={this.state.isMaxRooms}
	                        onClick={ () => this.add_rooms() }
	                        type="button"
	                        className="roomAdd">+ Add Room</button>


						<div className="store">
							<button
		                        onClick={ () => this.storeState() }
		                        type="button">Continue</button>
						</div>

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

