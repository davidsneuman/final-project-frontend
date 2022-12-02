/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus, editStudent} = props;
    // If there is no campus, display a message.

    

  function getStudents(campus) {
    if (!campus.students.length) {
        return <div>There are no students.</div>;
      }
      else{
        return campus.students.map( student => {
            let name = student.firstname + " " + student.lastname;
            return (
              <div key={student.id}>
                <h2>
                    <Link to={`/student/${student.id}`}>
                    {name}
                    <button onClick={() => editStudent(student.id, {campusId: null})}>Delete Student</button>  
                    </Link> 
                </h2>
              </div>
            );
          })
      }
    }

  // Render a single Campus view with list of its students
  return (
    <div>
      <img src={campus.imageUrl}></img>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      {getStudents(campus)}
      <br/>
      <br/>
    <Link to={`/editcampus/${campus.id}`}>
        <button>Edit Campus</button>
    </Link>
    <br/><br/>
    <Link to={`/campuses/`}>
    <button onClick={() => deleteCampus(campus.id)}>Delete</button>
    </Link>
    </div>
  );
};

export default CampusView;