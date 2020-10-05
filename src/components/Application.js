import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview  } from "../helpers/selectors";


export default function Application(props) {
  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState(prev => ({ ...prev, days }));
  //const [appointments, setAppointments] = useState({})

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });  
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const Schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    
    return(<Appointment key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview} />)
  });
    
  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')])
        .then((all) => {
          const [GET_DAYS, GET_APPOINTMENTS,GET_INTERVIEWERS] = all;
          // set your states here with the correct values...
          setState(prev => ({...prev, days: GET_DAYS.data,
            appointments: GET_APPOINTMENTS.data,
            interviewers: GET_INTERVIEWERS.data }));
        })
  },[]);

  

  return (
    <main className="layout">
      <section className="sidebar">
      <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu">
          <DayList
        days={state.days}
        day={state.day}
            setDay={setDay}
          />
        </nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>        </section>
      <section className="schedule">
        {Schedule}
        <Appointment key="last" time="5pm" />      </section>
    </main>
  );
}
