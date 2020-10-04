export function getAppointmentsForDay(state, day) {
    //... returns an array of appointments for that day
    let appointmentsIds= [] ;
    let appointmentesArray = [];
  
   for (const dayInState of state.days) {
     if (dayInState.name === day) {
       appointmentsIds = dayInState.appointments; 
     }
   }
   for (const id of appointmentsIds) {
  
    appointmentesArray.push(state.appointments[id])
  }
  return appointmentesArray;
  }
  