/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { editCampusThunk, fetchCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: props.campus.name, 
      address: props.campus.address, 
      description: props.campus.description, 
      imageUrl: props.campus.imageUrl,
      id: props.campus.id,
      redirect: false, 
      redirectId: null
    };
  }
    // Get student data from back-end database
    componentDidMount() {
    // this.props.fetchStudent(this.props.match.params.id);
    this.props.fetchCampus(this.props.match.params.id);
        }

    isValidInput() {
    return this.state.name && this.state.address 
    }

    alertInvalidInput() {
    switch (true) {
        case !this.state.name:
            alert("Campus name is invalid")
            break
        case !this.state.address:
            alert("Address is invalid")
            break
        default:
            break
    }

    }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    if (this.isValidInput()) {
    let campus = {
        name: this.state.name,
        address: this.state.address,
        description: this.state.description,
        imageUrl: this.state.imageUrl,
    };
    
    // Edit student in back-end database
    await this.props.editCampus(this.props.campus.id, campus);

    // Update state, and trigger redirect to show the edited student
    this.setState({
        name: this.props.campus.name, 
        address: this.props.campus.address, 
        description: this.props.campus.description, 
        imageUrl: this.props.campus.imageUrl,
        redirect: true, 
        redirectId: this.props.campus.id
    });
} else {
    this.alertInvalidInput()
}
  }



  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
          campus={this.props.campus}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
        />
      </div>          
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "student".
const mapState = (state) => {
    return {
      campus: state.campus,  // Get the State object from Reducer "student"
    };
  };

// The following input argument is passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
        editCampus: (id, campus) => dispatch(editCampusThunk(id, campus)),
    })
}

// Export store-connected container by default
// EditStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);