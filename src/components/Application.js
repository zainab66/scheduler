import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "../helpers/selectors";


export default function Application(props) {
  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState(prev => ({ ...prev, days }));
  //const [appointments, setAppointments] = useState({})

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });  
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentsList = dailyAppointments.map(appointment => 
    <Appointment key={appointment.id} {...appointment} />);
  
  
    
  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments')
    ]).then((all) => {
      const [GET_DAYS, GET_APPOINTMENTS] = all;
      // set your states here with the correct values...
      setState(prev => ({...prev, days: GET_DAYS.data,
        appointments: GET_APPOINTMENTS.data }));
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
        {appointmentsList}
        <Appointment key="last" time="5pm" />      </section>
    </main>
  );
}
