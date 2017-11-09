// node_modules
import React, { Component } from 'react';
// Mine

// const Room = (props) => {

class Room extends Component {
	// inherit parent props
	constructor(props) {
		super(props);

		this.state = {
            adults: 1,
            children: 0,
        }
	}

    adultAdd() {
        // console.log('Adding Adult');

        let peopleCount = this.props.rootThis.state.people.adults + this.props.rootThis.state.people.children;

        // only proceed if we have not hit our max people
        if (peopleCount < this.props.rootThis.state.people.max)
        {
            // manage this set count
            let adults = this.state.adults;
            adults = adults + 1;
            this.setState({adults:adults});

            // Update Global Adult Count
            let newPeopleArray = this.props.rootThis.state.people;
            newPeopleArray.adults = newPeopleArray.adults + 1;
            this.props.rootThis.updatePeopleCount(newPeopleArray); // root count and state update
        }
    }
    adultMinus() {
        // console.log('Minus Adult');
        let adults = this.state.adults;

        if (adults > 1)
        {
            adults = adults - 1;
            this.setState({adults:adults});

            // Update Global Adult Count
            let newPeopleArray = this.props.rootThis.state.people;
            newPeopleArray.adults = newPeopleArray.adults - 1;
            this.props.rootThis.updatePeopleCount(newPeopleArray); // root count and state update
        }

    }
    childAdd() {
        console.log('Adding Child');

        let peopleCount = this.props.rootThis.state.people.adults + this.props.rootThis.state.people.children;

        // only proceed if we have not hit our max people
        if (peopleCount < this.props.rootThis.state.people.max)
        {
            // manage this set count
            let children = this.state.children;
            children = children + 1;
            this.setState({children:children});

            // Update Global Adult Count
            let newPeopleArray = this.props.rootThis.state.people;
            newPeopleArray.children = newPeopleArray.children + 1;
            this.props.rootThis.updatePeopleCount(newPeopleArray); // root count and state update
        }
    }
    childMinus() {
        console.log('Minus Child');
        let children = this.state.children;

        if (children > 0)
        {
            children = children - 1;
            this.setState({children:children});

            // Update Global Adult Count
            let newPeopleArray = this.props.rootThis.state.people;
            newPeopleArray.children = newPeopleArray.children - 1;
            this.props.rootThis.updatePeopleCount(newPeopleArray); // root count and state update
        }
    }

    render() {
        return (
            <div className="room">
                <h1>Room {this.props.roomNum}</h1>
                <div className="addSubtractAdultsChildren">
                    <div className="set">
                        <label className="adults">Adults (18-64)</label>
                        <div className="controls addSubtract">
                            <button
                                type="button"
                                className="subtract"
                                onClick={ () => this.adultMinus() }
                            >-</button>
                            <div className="peopleCount">{this.state.adults}</div>
                            <button
                                type="button"
                                className="add"
                                onClick={ () => this.adultAdd() }
                            >+</button>
                        </div>
                    </div>
                    <div className="set">
                        <label className="children">Children (0-17)</label>
                        <div className="controls addSubtract">
                            <button
                                type="button"
                                className="subtract"
                                onClick={ () => this.childMinus() }
                            >-</button>
                            <div className="peopleCount">{this.state.children}</div>
                            <button
                                type="button"
                                className="add"
                                onClick={ () => this.childAdd() }
                            >+</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

// This relieves us from always having to instantiate. Anythig that imports this file will have it by defult.
export default Room;