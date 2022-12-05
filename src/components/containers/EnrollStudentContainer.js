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

import EnrollStudentView from '../views/EnrollStudentView';
import { fetchAllStudentsThunk, fetchStudentThunk, editStudentThunk } from '../../store/thunks';

class EnrollStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      id: null,
      campusId: this.props.match.params.id, 
      currentlyEnrolledStudents: this.getCurrentlyEnrolled(),
      currentlyUnenrolledStudents: this.getCurrentlyUnenrolled(),
      redirect: false, 
      redirectId: null
    };
  }


  
  componentDidMount() {
    this.props.fetchAllStudents();
    this.setState({
        currentlyEnrolledStudents: this.getCurrentlyEnrolled(),
        currentlyUnenrolledStudents: this.getCurrentlyUnenrolled()
    });
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
    this.setState({
        id: event.target.value,
        currentlyEnrolledStudents: this.getCurrentlyEnrolled(),
        currentlyUnenrolledStudents: this.getCurrentlyUnenrolled()
    });
    if (this.state.currentlyUnenrolledStudents.has(this.state.id)) {
    // Add new student in back-end database
    let newStudent = await this.props.editStudent(this.state.id, {campusId: this.props.match.params.id});

    // Update state, and trigger redirect to show the new student
    this.setState({
      id: this.props.student.id,
      campusId: this.props.match.params.id, 
      currentlyEnrolledStudents: this.getCurrentlyEnrolled(),
      currentlyUnenrolledStudents: this.getCurrentlyUnenrolled(),
      redirect: true, 
      redirectId: this.state.id
    });
} else if (this.state.currentlyEnrolledStudents.has(this.state.id)){
    alert("Student with ID: " + this.state.id + " is already enrolled in this campus");

} else {
    alert("Student does not exist.");
}
} 


getCurrentlyEnrolled() {
    
    var enrolledStudents = new Set();
    this.props.allStudents.map((student) => {
        if(String(student.campusId) === String(this.props.match.params.id)) {
            enrolledStudents.add(String(student.id));
        } 
    });
    return enrolledStudents;

  }
  getCurrentlyUnenrolled() {
    var unenrolledStudents = new Set();
    this.props.allStudents.map((student) => {
        if(String(student.campusId) !== String(this.props.match.params.id)) {
            unenrolledStudents.add(String(student.id));
        } 
    });
    return unenrolledStudents;
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({
        id: null,
        currentlyEnrolledStudents: this.getCurrentlyEnrolled(),
        currentlyUnenrolledStudents: this.getCurrentlyUnenrolled(),
        redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.props.match.params.id}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EnrollStudentView 
          students={this.props.allStudents}
          campusId={this.props.match.params.id}
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
      allStudents: state.allStudents
    };
  };

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (id, student) => dispatch(editStudentThunk(id, student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default withRouter(connect(mapState, mapDispatch)(EnrollStudentContainer));