/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus, editStudent} = props;

  function getStudents(campus) {
    // If there is no campus, display a message.
    if (!campus.students.length) {
        return <div>There are no students.</div>;
      }
      else{
        return campus.students.map( student => {
            let name = student.firstname + " " + student.lastname;
            return (
              <div key={student.id}>
                <h2>
                    <Link to={`/student/${student.id}`} >
                    {name}
                    <button onClick={() => editStudent(student.id, {campusId: null})} style= {{margin: 20}}>Unenroll Student</button>  
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
      <img src={campus.imageUrl} alt="Campus" style= {{height: 200, width: 200}}></img>
      <h1>{campus.name}</h1>
      <p>{campus.address}</p>
      <p>{campus.description}</p>
      <Link to={`/editcampus/${campus.id}`} style= {{padding: 20}}>
        <button>Edit Campus</button>
    </Link>
    <Link to={`/campuses/`}>
    <button onClick={() => deleteCampus(campus.id)}>Delete Campus</button>
    </Link>

    <br/>
    <br/>
    <Link to={`/enrollstudent/${campus.id}`}>
        <button>Enroll Student</button>
    </Link>
      <br/>
      {getStudents(campus)}


    <br/><br/>

    </div>
  );
};

export default CampusView;