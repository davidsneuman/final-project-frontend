/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom";

const StudentView = (props) => {
  const { student, deleteStudent } = props;

  function getCampus(student) {
    if (!student.campus) {
        return <h3>{student.firstname + " " + student.lastname + " does not belong to a campus."}</h3>;
      }
      else{
        return <h3>
                    <Link to={`/campus/${student.campusId}`}>
                        {student.campus.name}
                    </Link>
                </h3>
      }
    }
  // Render a single Student view 
  return (
    <div>
      <img src={student.imageUrl}></img>
      
      <h1>{student.firstname + " " + student.lastname}</h1>
      <p>{student.email}</p>
      <p>{student.gpa}</p>
      {getCampus(student)}
    
    <br/>
    <Link to={`/editstudent/${student.id}`}>
        <button>Edit Student</button>
    </Link>
    <br/><br/>
    <Link to={`/students/`}>
    <button onClick={() => deleteStudent(student.id)}>Delete</button>
    </Link>
    </div>
  );

};

export default StudentView;