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
import { withRouter } from "react-router-dom";

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      campusId: null, 
      email: "",
      imageUrl: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
      gpa: null,
      redirect: false, 
      redirectId: null
    };
  }

  campusIdExists() {
    if(!this.state.campusId) {
        return false;
    }

    for(var i = 0; i < this.props.allCampuses.length; i++) {
        if (String(this.props.allCampuses[i].id) === String(this.state.campusId)) {
            return true;
        }
    }
    return false;
  }

  isGpaValid() {
    return !this.state.gpa || (this.state.gpa <= 4.0 && this.state.gpa >= 0.0)
  }

  isValidInput() {
    this.props.fetchAllCampuses();
    return this.isGpaValid()
    && this.state.firstname 
    && this.state.lastname 
    && this.state.email 
    && this.state.campusId
    && this.campusIdExists()
  }

  alertInvalidInput() {
    switch (true) {
        case !this.state.firstname:
            alert("First Name is invalid")
            break
        case !this.state.lastname:
            alert("Last Name is invalid")
            break
        case !this.campusIdExists():
            alert("Campus ID is invalid")
            break
        case !this.state.email:
            alert("Email is invalid")
            break
        case !this.isGpaValid():
            alert("GPA is invalid")
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
    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        campusId: this.state.campusId,
        email: this.state.email,
        imageUrl: this.state.imageUrl,
        gpa: this.state.gpa
    };
    
    // Add new student in back-end database
    let newStudent = await this.props.addStudent(student);

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "", 
      lastname: "", 
      campusId: null, 
      email: "",
      imageUrl: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
      gpa: null,
      redirect: true, 
      redirectId: newStudent.id
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
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          allCampuses={this.props.allCampuses}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}      
        />
      </div>          
    );
  }
}

const mapState = (state) => {
    return {
      allCampuses: state.allCampuses
    };
  };

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
        addStudent: (student) => dispatch(addStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default withRouter(connect(mapState, mapDispatch)(NewStudentContainer));