import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  //the function recalculate the remaining spots for the day and returns updated days array
  const spotsRemaining = function (days,day,appointments) {
  const dayObj = days.find(d => d.name === day);
    
  const currentSpots = dayObj.appointments.filter(id => !appointments[id].interview).length;
  const currentDay = {...dayObj, spots: currentSpots};
    
  const daysArr = days.map(day => {
      if (day.id === currentDay.id) {
          return day = {...currentDay};
        }
        return day;
    })
    return daysArr;
};


  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    const days = spotsRemaining(state.days, state.day, appointments);
   
   
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => setState(state => ({ ...state, appointments,days })));
};
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    const days = spotsRemaining(state.days, state.day,appointments);

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => setState(state => ({ ...state, appointments,days })));
};
    
  useEffect(() => {
      const daysPromise = axios.get('/api/days');
      const appointmentPromise = axios.get('/api/appointments');
      const interviewersPromise = axios.get('/api/interviewers');
      Promise.all([
          daysPromise, 
          appointmentPromise, 
          interviewersPromise])
          .then(([
              {data: days},
              {data: appointments},
              {data: interviewers}
            ]) => {
                setState(prev => ({...prev, days, appointments, interviewers}));
            });
         },[]);


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
  }