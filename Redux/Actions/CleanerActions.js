export const addCleaner = (data) => {
  return {
    type: "ADD_CLEANER",
    payload: data,
  };
};
export const addJobs = (data) => {
  return {
    type: "ADD_JOB",
    payload: data,
  };
};
export const updateOldJob=(job) => {
  return {
    type: "UPDATE_JOB",
    payload: job,
  };
};
export const addAttendence=(status) => {
  return {
    type: "ATTENDENCE",
    payload:status ,
  };
};
export const addOnlyJobsArray=(status) => {
  return {
    type: "ADD_ONLY_JOB",
    payload: status,
  };
};
export const updateFailedJob=(jobAndDate) => {
  return {
    type: "UPDATE_JOB_FAIL",
    payload: jobAndDate,
  };
};
 