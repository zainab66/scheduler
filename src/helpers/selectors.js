export function getAppointmentsForDay(state, day) {
  const dayFound = state.days.find(stateday => day === stateday.name);
  if(!dayFound){
    return [];
  }
  
  const appointmentsFound= dayFound.appointments.map(appointment => {
    return state.appointments[appointment];
  });
  return appointmentsFound;
  }
  
  
  
  export function getInterviewersForDay(state, day) {
    const dayFound = state.days.find(stateday => day === stateday.name);
    if(!dayFound || !dayFound.interviewers || dayFound.interviewers.length === 0){
      return [];
    }
    const interviewersFound = dayFound.interviewers.map(interviewer => {
      return state.interviewers[interviewer];
    });
    return interviewersFound;
  }
  
  export function getInterview(state, interview) {
    if(!interview) {
      return null;
    }
    return {
      student : interview.student,
      interviewer : state.interviewers[interview.interviewer]
    }
  }