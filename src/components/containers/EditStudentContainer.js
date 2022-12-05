/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk, fetchStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: props.student.firstname, 
      lastname: props.student.lastname, 
      campusId: props.student.campusId, 
      email: props.student.email,
      imageUrl: props.student.imageUrl,
      gpa: props.student.gpa,
      id: props.student.id,
      redirect: false, 
      redirectId: null
    };
  }
      // Get student data from back-end database
      componentDidMount() {
        // this.props.fetchStudent(this.props.match.params.id);
        this.props.fetchStudent(this.props.match.params.id);
        this.props.fetchAllCampuses();
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
    return this.isGpaValid()
    && this.state.firstname 
    && this.state.lastname 
    && this.state.email 
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
    
    // Edit student in back-end database
    await this.props.editStudent(this.props.student.id, student);

    // Update state, and trigger redirect to show the edited student
    this.setState({
        firstname: this.props.student.firstname, 
        lastname: this.props.student.lastname, 
        campusId: this.props.student.campusId, 
        email: this.props.student.email,
        imageUrl: this.props.student.imageUrl,
        gpa: this.props.student.gpa,
        redirect: true, 
        redirectId: this.props.student.id
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
        <EditStudentView 
          allCampuses={this.props.allCampuses}
          student={this.props.student}
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
      student: state.student,  // Get the State object from Reducer "student"
      allCampuses: state.allCampuses
    };
  };

// The following input argument is passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (id, student) => dispatch(editStudentThunk(id, student)),
    })
}

// Export store-connected container by default
// EditStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default withRouter(connect(mapState, mapDispatch)(EditStudentContainer));