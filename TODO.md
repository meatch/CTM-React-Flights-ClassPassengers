# TODO


## Dumb down children components
Child components should not know what is happening with parents. See them as tools for the parent.

Have logic in root container
And the children simply do what they do, and provide feedback.
The parent tells the child how to re-render

For example, the child stepper clicks up
If the parent says its ok (meaining it does not violate the rules, it can add one, if not, nothing happens.)
Child gets re-rendered if there is a change. So it looks like the child is incrementing, but in reality, its being re-rendered

class HotelsRoomsGuests extends Component {

	function addAdult() {
		if ok, return good to go
	}

}

<Child
	addAdult={addAdult}
/>
