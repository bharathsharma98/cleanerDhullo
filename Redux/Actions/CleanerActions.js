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
    type: "UPDATE_OLD_JOB",
    payload: job,
  };
};
 