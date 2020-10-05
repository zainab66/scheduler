import React from "react";


import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

//importing custom hook!
import useVisualMode from "hooks/useVisualMode";

  //defining diff modes 
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id,interview)
      .then(() => transition(SHOW))
      .catch(()=> transition(ERROR_SAVE, true))
    
  }
  function deleteAppointment () {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(()=> transition(ERROR_DELETE, true))
  }
  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            id={props.id}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE && <Form name={props.name} interviewers={props.interviewers}
          onSave={ save } onCancel={() => back()}/>}
        {mode === SAVING && <Status message={"Saving"}/>}
        {mode === DELETING && <Status message={"Deleting"}/>}
        {mode === CONFIRM && <Confirm message={"Are you sure you would like to delete?"}
          id={props.id}
          onCancel={() => back()}
          onConfirm={deleteAppointment}
        />}
        {mode === EDIT && <Form name={props.interview.student} interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id} onSave={ save } onCancel={() => back()}/>}
        {mode === ERROR_DELETE && <Error message={"Could not cancel the appointment."} onClose={() => back()} />}
        {mode === ERROR_SAVE && <Error message={"Could not save the appointment"} onClose={() => back()} />}
    </article>
  );
}