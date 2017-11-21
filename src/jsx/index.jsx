/*-------------------------------------
| Imports
-------------------------------------*/
/* React and React Dom, Vendor components -------------------------------*/
import React, { Component } from "react"; //Manages components
import ReactDOM from "react-dom"; //Manages the DOM views. (Shadow Dom)

/* My Personal Components -------------------------------*/
// import Room from "./room"; //no need to add .jsx

/*-------------------------------------
| Create an component that produces HTML
-------------------------------------*/
class FlightsClassPassenger extends Component {
	/*-------------------------------------
	| Static Props  - Like Constants, these should not change in our app, unlike state
	-------------------------------------*/
	static defaultProps = {
	    classOfServices: {
			'E': 'Economy',
			'P': 'Premium Economy',
			'B': 'Business',
			'F': 'First Class',
		},
		displayTextTrimLength: 17,
		roomsAdultsMin: 1, //every room must have 1 adult or 1 senior
	    maxPassengers: 8,
		childAgeOptions: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] //range from 0-17
	}

	/*-------------------------------------
	| Start The Party
	-------------------------------------*/
	constructor(props) {
	    super(props); //inherit parent props

		/*-------------------------------------
		| State of Our App
		-------------------------------------*/
	    let passengers = (this.props.passengers) ?  this.props.passengers : {
			adults: 1,
			seniors: 0,
			children: []
		};



	    this.state = {
			modalDisplay: "", //hidden should be default, unless testing
			classOfService: 'E',
			passengers: passengers,
			passengerSavedState: JSON.parse(JSON.stringify(passengers)), //so when we revert back to last saved state
			showErrors: "",
			errorMessages: [],
			adultSeniorCount: 1, //must have at least 1 adult or senior
			isMaxPassengers: false,
	    };

	    /*-------------------------------------
		| A bunch of bindings to manage the scope of this to be root contained
		-------------------------------------*/
	    /* Sending to children -------------------------------*/
	    // this.addSubtract_adults = this.addSubtract_adults.bind(this);
	    // this.addSubtract_children = this.addSubtract_children.bind(this);
	    // this.updateChildAge = this.updateChildAge.bind(this);

	    /* Clicking outside of component -------------------------------*/
	    this.setWrapperRef = this.setWrapperRef.bind(this);
	    this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	/*-------------------------------------
	|| Program Execution Hooks
	-------------------------------------*/
	//init or did mount should work too
	componentWillMount() {

	}
	componentDidMount() {
	    document.addEventListener("mousedown", this.handleClickOutside);
	    document.addEventListener("keydown", (e) => { this.handKeyDownEvents(e) },false);
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

	/*-------------------------------------
	| Detect when user clicks outside of component
	| https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
	-------------------------------------*/
	setWrapperRef(node) {
	    this.wrapperRef = node;
	}
	handleClickOutside(event) {
	    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	        this.storeState();
	    }
	}

	/*-------------------------------------
	| Update Common State :: common things that should be updated as things change
	-------------------------------------*/
	update_state(passengers) {
		let isMaxPassengers = this.checkMaxPassengers();
		let adultSeniorCount = this.adultSeniorCount();

		this.setState({
			passengers: passengers,
			adultSeniorCount: adultSeniorCount,
			isMaxPassengers: isMaxPassengers
		});
	}

	/*-------------------------------------
	| Update The Display Text
	-------------------------------------*/
	displayText = () => {
	    let displayText = "1 Adult, Economy";

        // Get Class of Service
		let service = this.state.classOfService; //E
		let classOfServices = this.props.classOfServices[service]; //without the class suffix

	    // Passengers
	    let totalAdults = this.adultCount();
	    let totalSeniors = this.seniorCount();
	    let totalChildren = this.childCount();
		let totalGuests = totalAdults + totalSeniors + totalChildren;

        // Plurality of Message
	    let pluralGuests = (totalGuests > 1) ? "s":"";

	    // Evaluate and render
		let isAdultsAndSeniors = (totalAdults > 0 && totalSeniors > 0) ? true:false;
		if (totalChildren > 0 || isAdultsAndSeniors)
		{
			displayText = `${totalGuests} Passengers, ${classOfServices}`;
		}
		else if (totalSeniors === 0)
		{
			displayText = `${totalAdults} Adult${pluralGuests}, ${classOfServices}`;
		}
		else // must be only seniors
		{
			displayText = `${totalSeniors} Senior${pluralGuests}, ${classOfServices}`;
		}

		displayText = displayText.substring(0,this.props.displayTextTrimLength);

		return displayText;
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

	/*-------------------------------------
	||
	|| Storing or Resetting the Current State
	||
	-------------------------------------*/
	/*-------------------------------------
	| When clicking continue or outside of the modal window, we save the current State
	-------------------------------------*/
    storeState() {
        // validate children ages
        this.state.errorMessages = [];

		let showErrors = "";
		let errorMessages = this.state.errorMessages;

        if (this.hasChildAges())
        {
            let passengers = JSON.parse(JSON.stringify(this.state.passengers)); //clone current
            this.modalHide();


			this.setState({
				showErrors: showErrors,
				errorMessages: errorMessages,
				passengerSavedState: passengers,
			});
        }
        else
        {
			showErrors = "showErrors";
            errorMessages.push("Please provide ages for all Children");

			this.setState({
				showErrors: showErrors,
				errorMessages: errorMessages,
			});
        }


    }
	/*-------------------------------------
	| Clicking X always reverts to last saved state.
	-------------------------------------*/
	resetToLastSavedState() {
        this.state.errorMessages = [];
		// Cloning Arrays in JS: https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
        let passengers = JSON.parse(JSON.stringify(this.state.passengerSavedState));
        this.update_state(passengers);
        this.modalHide();
    }

	/*-------------------------------------
	||
	|| Validation
	||
	-------------------------------------*/
    /*-------------------------------------
    | Error Messages
    -------------------------------------*/
	errorMessages = () => {
	    let errorMessages = this.state.errorMessages.map((message, i) => {
	        return <li key={i}>{message}</li>;
	    });
	    return errorMessages;
	};
    /*-------------------------------------
	| See if user has provided ages for all children
	-------------------------------------*/
    hasChildAges() {
        let hasChildAges= true;
        let children = this.state.passengers.children;

        children.forEach((child)=>{
            if (child === -1)
            {
                hasChildAges = false;
            }
        });
        return hasChildAges;
    }

    /*-------------------------------------
	|
	| Count passengers
	|
	-------------------------------------*/
    passengerCount() {
        return this.adultCount() + this.seniorCount() + this.childCount();
    }
    adultCount() {
        return this.state.passengers.adults;
    }
    seniorCount() {
        return this.state.passengers.seniors;
    }
    childCount() {
        return this.state.passengers.children.length;
    }
	adultSeniorCount() {
		let adultSeniorCount = this.adultCount() + this.seniorCount();
		return adultSeniorCount;
	}

    /*-------------------------------------
	| Have we hit our max passenger count yet?
	-------------------------------------*/
    checkMaxPassengers() {
        let isMaxPassengers = (this.passengerCount() === this.props.maxPassengers) ? true:false;
		return isMaxPassengers;
    }

    /*-------------------------------------
	| @ plusMinus int :: positive or negative plusMinu to add or subtract adults
	-------------------------------------*/
    addSubtract_adult(plusMinus) {
		let passengers  = this.state.passengers;
		let adultSeniorCount = this.state.adultSeniorCount;

		if (plusMinus === "plus")
        {
            if (!this.state.isMaxPassengers)
            {
                passengers.adults++;
            }
        }
        else if (plusMinus === "minus")
        {
            if (adultSeniorCount >= 1 && passengers.adults > 0) //must have at least 1 adult/senior per room.
            {
                passengers.adults--;
            }
        }

		this.update_state(passengers);
    }




    /*-------------------------------------
	| @ plusMinus int :: positive or negative plusMinu to add or subtract adults
	-------------------------------------*/
    addSubtract_senior(plusMinus) {
		let passengers  = this.state.passengers;
		let adultSeniorCount = this.state.adultSeniorCount;

		if (plusMinus === "plus")
        {
            if (!this.state.isMaxPassengers)
            {
                passengers.seniors++;
            }
        }
        else if (plusMinus === "minus")
        {
            if (adultSeniorCount >= 1 && passengers.seniors > 0) //must have at least 1 adult/senior per room.
            {
                passengers.seniors--;
            }
        }

		this.update_state(passengers);
    }


    /*-------------------------------------
	| @ roomIndex int :: Index Key of the child that is sending the request - so we can update the appropriate values
	| @ plusMinus int :: positive or negative plusMinus to add or subtract adults
	-------------------------------------*/
    addSubtract_children(plusMinus) {
		let passengers  = this.state.passengers;

        if (plusMinus === "plus")
        {
            if (!this.state.isMaxPassengers)
            {
                //age is -1 to start, till they choose from the drop down.
                // Used for validation too, they must choose and age
                passengers.children.push(-1);
            }
        }
        else if (plusMinus === "minus")
        {
            if (passengers.children.length > 0) //ok to have no children
            {
                passengers.children.pop();
            }
        }

		this.update_state(passengers);
    }

    updateChildAge(childIndex, age) {
        let passengers = this.state.passengers;
        passengers.children[childIndex] = age;

        // see if we are currently showing errors, and re-evaluate to hide errors if user has corrected errors
        if (this.state.showErrors === "showErrors" && this.hasChildAges())
        {
            this.state.showErrors = "";
        }

        this.update_state(passengers);
    }


    /*---------------------------
	| Hidden Inputs
		{
			SAMPLE POST DATA FROM HOTELS PAGE

			NEED TO PRESERVE THE FOLLOWING LOGIC FOR BACK END, AND BLADE RENDERING

			@note we are using these

			passenger_input: 1 Adult, Economy
			search_params[class]: E
			search_params[adults]: 2
			search_params[seniors]: 2
			search_params[children_count]: 2
			search_params[children][0][age]:17
			search_params[children][1][age]:8
		}
		id="passenger_input" name="passenger_input" value={this.state.displayText}

		id="search_params_class" name="search_params[class]" value={this.state.classOfService}
		id="search_params_adults" name="search_params[adults]" value={this.state.passengers.adults}
		id="search_params_seniors" name="search_params[seniors]" value={this.state.passengers.seniors}
		id="search_params_children_count" name="search_params[children_count]" value={this.state.passengers.children.length}

        Looping Array of ages
		id="search_params_children_age_0" name="search_params[children][0][age]" value={age0}
		id="search_params_children_age_1" name="search_params[children][1][age]" value={age1}
	---------------------------*/
    hiddenInputs() {
		let passengers  = this.state.passengers;

        /*---------------------------
		| get age hidden inputs
		---------------------------*/
        let ages = passengers.children.map((age, ageIndex) => {
            return (
                <input
                    key={ageIndex}
                    className='bs-select-hidden' type='hidden'
                    id={"search_params_children_age_" + ageIndex}
                    name={"search_params[children]["+ageIndex+"][age]"}
                    value={age}
	            />
            )
        });

        return (
            <div className='hiddenInputs'>
                <input type='hidden' id="passenger_input" name="passenger_input" value={this.state.displayText} />
				<input type='hidden' id="search_params_adults" name="search_params[adults]" value={this.state.passengers.adults} />
				<input type='hidden' id="search_params_seniors" name="search_params[seniors]" value={this.state.passengers.seniors} />
				<input type='hidden' id="search_params_children_count" name="search_params[children_count]" value={this.state.passengers.children.length} />
                <div className='ages'>{ages}</div>
            </div>
        );
    }

	/*-------------------------------------
	| Class of Service Select Menu
	-------------------------------------*/
	classOfServicesSelect() {
		let classOfServices  = Object.entries(this.props.classOfServices);

        /*---------------------------
		| get age hidden inputs
		---------------------------*/
        let options = classOfServices.map((service, classIndex) => {
            return (
                <option
                    key={classIndex}
                    value={service[0]}
	            >
					{service[1]}
				</option>
            )
        });

		// let currClassOfService = this.state.classOfService;

        return (
			<select
				id="search_params_class"
				name="search_params[class]"
				value={this.state.classOfService}
				onChange={ (event) => this.setState({classOfService:event.target.value}) }
				>
			   {options}
			</select>
        );
    }


	/*-------------------------------------
	| Child Age Selects
	-------------------------------------*/
    childAgeSelects() {
		let passengers  = this.state.passengers;

        /* Child Age Select Inputs -------------------------------*/
		let childAgeSelects = passengers.children.map((child, i) => {
			let missing = (child === -1) ? ' missing':'';

			return (
	            <select
	                key={i}
	                className={"child" +  missing}
	                name="children[]"
	                value={child}
	                onChange={ (event) => this.updateChildAge(i, parseInt(event.target.value)) }
	            >
	                <option key="default" value="-1">--</option>
	                {
	                    this.props.childAgeOptions.map((age) => {
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

		/* Age Select Label -------------------------------*/
		let agesLabel = <label>Age at time of travel</label>;
		if (passengers.children.length > 1)
		{
			agesLabel = <label>Ages at time of travel</label>;
		}


		return (
			<div className="childAgeSelects">
				<label>
					{agesLabel}
				</label>
				<div className="controls">
					{childAgeSelects}
				</div>
			</div>
		);
    }

    render() {
        return  (
            <div ref={this.setWrapperRef} className={"FlightsClassPassenger " +  this.state.showErrors}>
                { this.hiddenInputs() }

                <div className='stats'>
                    { this.passengerCount() + " Passenger(s)" }
                    { this.adultCount() + " Adult(s)" }
                    { this.seniorCount() + " Seniors(s)" }
                    { this.childCount() + " Children" }
                </div>
                <div className='content'>
                    <div
                        onClick={() => this.modalShow()}
                        className='primary-text-display'>
                        <div className='displayText'>{ this.displayText() }</div>
                        <span className='glyphicon glyphicon-menu-down' />
                    </div>
                    <div className={"classPassenger-modal " +  this.state.modalDisplay}>
                        <button
                            type='button'
                            onClick={() => this.resetToLastSavedState()}
                            className='close'>X</button>

                        <div className='errorMessage'>
                            <ul>
                                { this.errorMessages() }
                            </ul>
                        </div>
						<section className="classOfService">
							<h2>Class of Service</h2>
							{ this.classOfServicesSelect() }
						</section>
						<section className="passengers">
							<h2>Passengers</h2>

							<div className="addSubtractAdultsChildren">

				                <div className="set adults cf">
				                    <label className="adults">Adults (18-64)</label>
				                    <div className="controls addSubtract">
				                        <button
				                            disabled={(this.state.adultSeniorCount < 2 || this.state.passengers.adults === 0)}
				                            type="button"
				                            className="subtract"
				                            onClick={ () => this.addSubtract_adult('minus') }
				                        >-</button>

				                        <div className="peopleCount">{this.state.passengers.adults}</div>
				                        <button
				                            disabled={this.state.isMaxPassengers}
				                            type="button"
				                            className="add"
				                            onClick={ () => this.addSubtract_adult('plus') }
				                        >+</button>
				                    </div>
				                </div>
				                <div className="set children cf">
				                    <label className="children">Children (2-17)</label>
				                    <div className="controls addSubtract">
				                        <button
				                            disabled={(this.state.passengers.children.length === 0)}
				                            type="button"
				                            className="subtract"
				                            onClick={ () => this.addSubtract_children('minus') }
				                        >-</button>
				                        <div className="peopleCount">{this.state.passengers.children.length}</div>
				                        <button
				                            disabled={this.state.isMaxPassengers}
				                            type="button"
				                            className="add"
				                            onClick={ () => this.addSubtract_children('plus') }
				                        >+</button>
				                    </div>
				                    <div className="ages">
				                        { this.childAgeSelects() }
				                    </div>
				                </div>
				                <div className="set seniors cf">
				                    <label className="seniors">Seniors (65+)</label>
				                    <div className="controls addSubtract">
				                        <button
				                            disabled={(this.state.adultSeniorCount < 2 || this.state.passengers.seniors === 0)}
				                            type="button"
				                            className="subtract"
				                            onClick={ () => this.addSubtract_senior('minus') }
				                        >-</button>

				                        <div className="peopleCount">{this.state.passengers.seniors}</div>
				                        <button
				                            disabled={this.state.isMaxPassengers}
				                            type="button"
				                            className="add"
				                            onClick={ () => this.addSubtract_senior('plus') }
				                        >+</button>
				                    </div>
				                </div>
				            </div>

						</section>

						<div className="alert alert-info travel-with-infant">
							If you are traveling with an infant or would like to
							make a reservation for an unaccompanied minor,
							please contact a travel specialist at
							1-877-517-1358.
						</div>


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
// export default FlightsClassPassenger; //for Steve Integration
ReactDOM.render(<FlightsClassPassenger />, document.querySelector('.FlightsClassPassenger'));
