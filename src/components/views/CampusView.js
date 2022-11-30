/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import { Link } from "react-router-dom";

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus} = props;
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
                <Link to={`/student/${student.id}`}>
                  <h2>{name}</h2>
                </Link>             
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
      <Link to={`/newcampus`}>
        <button>Add New Campus</button>
      </Link>
      <br/><br/>
    </div>
  );
};

export default CampusView;