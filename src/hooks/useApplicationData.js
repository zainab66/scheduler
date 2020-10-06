import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    //console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    //setState({...state, appointments});
    return axios.put(`/api/appointments/${id}`, appointment)
            .then((res) => setState(state => ({ ...state, appointments })));
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
    return axios.delete(`/api/appointments/${id}`, appointment)
            .then(() => setState(state => ({ ...state, appointments })));
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