/*-------------------------------------
| Imports
-------------------------------------*/
/* React and React Dom, Vendor components -------------------------------*/
import React, { Component } from "react"; //Manages components
import ReactDOM from "react-dom"; //Manages the DOM views. (Shadow Dom)

/* My Personal Components -------------------------------*/
import Room from "./room"; //no need to add .jsx

/*-------------------------------------
| Create an component that produces HTML
-------------------------------------*/
class HotelsRoomsGuests extends Component {
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

	    let rooms = (this.props.rooms) ?  this.props.rooms : [{ adults: 2, children: [] }];

	    this.state = {
	        modalDisplay: "", //hidden should be default, unless testing
	        showErrors: "",
	        errorMessages: [],
	        isMaxGuests: false,
	        isMaxRooms: false,
	        rooms: rooms,
	        roomsSavedState: [
	            {
	                adults: 1,
	                children: [],
	            },
	        ], //so when we revert back to last saved state
	    };
	}

	/*-------------------------------------
	| Detect when user clicks outside of component
	| https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
	-------------------------------------*/
	componentWillMount() {} //init or did mount should work too

	componentDidMount() {
	    document.addEventListener("mousedown", this.handleClickOutside);
	    document.addEventListener("keydown", (e) => { this.handKeyDownEvents(e) },false);

	    this.isMaxRoomsAndGuests(); //if this form is sticky, they may have already maxed it out
	}

	componentWillUnmount() {
	    document.removeEventListener("mousedown", this.handleClickOutside);
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
	    // let clickedWindowScroll = ( $(window).outerWidth() <= event.clientX ) ? true:false;

	    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	        this.storeState();
	    }
	}

    // FAT ARROW FUNCTIONS CHANGES SCOPE OF KEYWORD THIS - to be scoped to this Class. Children Containers can use it too.
	updateDisplayText = () => {
	    let newDisplayText = "1 Room, 1 Adult"; //default

	    // Guests
	    let totalAdults = this.adultCount();
	    let totalChildren = this.childCount();
	    let totalGuests = totalAdults + totalChildren;
	    let pluralGuests = (totalGuests > 1) ? "s":"";

	    // Rooms
	    let totalRooms = this.state.rooms.length;
	    let pluralRooms = (totalRooms > 1) ? "s":"";

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

	componentWillReceiveProps(nextProps) {
	    this.setState({rooms: nextProps.rooms});
	}

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
        this.setState({ modalDisplay: "" });
    }
    modalHide = () => {
        this.setState({ modalDisplay: "hidden" });
    }

    storeState() {
        // validate children ages
        this.state.errorMessages = [];

        if (this.hasChildAges())
        {
            this.setState({ showErrors: "" });
            let rooms = this.deep_clone(this.state.rooms);
            this.setState({ roomsSavedState: rooms });
            this.modalHide();

            // this.props.setRooms(this.state.rooms); //parent method for inclusion with the rest of the forms. - Steves parent containers.
        }
        else
        {
            let errorMessages = this.state.errorMessages;
            errorMessages.push("Please provide ages for all Children");

            this.setState({
                showErrors: "showErrors",
                errorMessages: errorMessages,
            });
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
        this.state.errorMessages = [];
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

        if (plusMinus === "plus")
        {
            if (this.guestCount() !== this.props.guestsMax)
            {
                rooms[roomIndex].adults++;
                this.isMaxRoomsAndGuests();
            }
        }
        else if (plusMinus === "minus")
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

        if (plusMinus === "plus")
        {
            if (this.guestCount() !== this.props.guestsMax)
            {
                //age is -1 to start, till they choose from the drop down.
                // Used for validation too, they must choose and age
                rooms[roomIndex].children.push(-1);
                this.isMaxRoomsAndGuests(); //after adding did we hit our max guest count?
            }
        }
        else if (plusMinus === "minus")
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
        if (this.state.showErrors === "showErrors" && this.hasChildAges())
        {
            this.state.showErrors = "";
        }

        this.setState({rooms: rooms});
    }


    /*---------------------------
	| Hidden Inputs
		{
			SAMPLE POST DATA FROM HOTELS PAGE

			NEED TO PRESERVE THE FOLLOWING LOGIC FOR BACK END, AND BLADE RENDERING

			@note did search with @Steve does not look like we are using these
			HiddenChildren_1:0
			HiddenChildren_1:0
			HiddenAdults_1:2
			HiddenAdults_1:2

			@note we are using these

			guests[0]:4
			room[0]:4 Guests
			parents[0]:2
			kids[0]:2
			ages_0[0]:1
			ages_0[1]:2

			guests[1]:3
			room[1]:3 Guests
			parents[1]:2
			kids[1]:1
			ages_1[0]:2
		}

		Room 1
		id="hidden_room_1" name="guests[0]" value={AdultsPlusChildrenPerRoom}
		id="room_input_1" name="room[0]" value={AdultsPlusChildrenPerRoom + ' Guests'}
		id="parents_input_1" name="parents[0]" value={AdultsPerRoom}
		id="kids_input_1" name="kids[0]" value={AdultsPerRoom}
		id="age_select_1_1" name="ages_0[0]" value={age00}
		id="age_select_1_2" name="ages_0[1]" value={age01}


		Room 2
		id="hidden_room_2" name="guests[1]" value={AdultsPlusChildrenPerRoom}
		id="room_input_2" name="room[1]" value={AdultsPlusChildrenPerRoom + ' Guests'}
		id="parents_input_2" name="parents[1]" value={AdultsPerRoom}
		id="kids_input_2" name="kids[1]" value={AdultsPerRoom}
		id="age_select_2_1" name="ages_1[0]" value={age10}
		id="age_select_2_2" name="ages_1[1]" value={age11}
	---------------------------*/
    hiddenInputs() {
        let hiddenInputs = this.state.rooms.map((room, i) => {

            let adults = room.adults;
            let children = room.children.length;
            let adultsPlusChildren = adults + children;

            /*---------------------------
			| get age hidden inputs
			---------------------------*/
            let ages = room.children.map((age, ageIndex) => {
                return (
                    <input
                        key={ageIndex}
                        className='bs-select-hidden' type='hidden'
                        id={"age_select_" + (i + 1) + "_" + (ageIndex + 1)}
                        name={"ages_"+i+"["+ageIndex+"]"}
                        value={age}
		            />
                )
            });


            return (
                <div className='room' key={i}>
                    <input
                        className='wf-hidden-guest-input' type='hidden'
                        id={"hidden_room_" + (i + 1)}
                        name={"guests["+i+"]"}
                        value={adultsPlusChildren}
		            />
                    <input
                        className='wf-room-input' type='hidden'
                        id={"room_input_" + (i + 1)}
                        name={"room["+i+"]"}
                        value={adultsPlusChildren + " Guests"}
		            />
                    <input
                        className='wf-adult' type='hidden'
                        id={"parents_input_" + (i + 1)}
                        name={"parents["+i+"]"}
                        value={adults}
		            />
                    <input
                        className='wf-children' type='hidden'
                        id={"kids_input_" + (i + 1)}
                        name={"kids["+i+"]"}
                        value={children}
		            />
                    <div className='ages'>{ages}</div>
                </div>
            )
        });

        return hiddenInputs;

    }

    render() {
        return  (
            <div ref={this.setWrapperRef} className={"HotelsRoomsGuests " +  this.state.showErrors}>
                <div className='hiddenRooms'>
                    { this.hiddenInputs() }
                </div>

                <div className='stats'>
                    { this.state.rooms.length + " Room(s)" }
                    { this.guestCount() + " Guest(s)" }
                    { this.adultCount() + " Adult(s)" }
                    { this.childCount() + " Children" }
                </div>
                <div className='content'>
                    <div
                        onClick={() => this.modalShow()}
                        className='primary-text-display'>
                        <div className='displayText'>{ this.updateDisplayText() }</div>
                        <span className='glyphicon glyphicon-menu-down' />
                    </div>
                    <div className={"roomGuest-modal " +  this.state.modalDisplay}>
                        <button
                            type='button'
                            onClick={() => this.resetToLastSavedState()}
                            className='close'>X</button>

                        <div className='errorMessage'>
                            <ul>
                                { this.errorMessages() }
                            </ul>
                        </div>


                        <div className='rooms'>{ this.rooms_render() }</div>

                        <button
                            disabled={this.state.isMaxRooms}
                            onClick={() => this.add_rooms()}
                            type='button'
                            className='roomAdd'>+ Add Room</button>


                        <div className='store'>
                            <button
                                onClick={() => this.storeState()}
                                type='button'>Continue</button>
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
// export default HotelsRoomsGuests;
ReactDOM.render(<HotelsRoomsGuests />, document.querySelector('.HotelsRoomsGuests'));
