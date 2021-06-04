import {
  addJobsFunc,
  updateOldJobsFunc,
  attendenceFunc,
  updateJobsArray,
  updateFailJobsFunc,
} from "./CleanerConditions";

const initState = {
  cleaner: [],
  dailyJobs: {},
  loggedIn: false,
};

export const CleanerReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_CLEANER":
      return {
        ...state,
        loggedIn: true,
        cleaner: action.payload,
      };
    case "ADD_JOB":
      return {
        ...state,
        loggedIn: true,
        dailyJobs:addJobsFunc(state.dailyJobs,action.payload),
      };

    case "UPDATE_JOB":
      return {
        ...state,
        loggedIn: true,
        dailyJobs: updateOldJobsFunc(state.dailyJobs, action.payload),
      };
    case "UPDATE_JOB_FAIL":
      return {
        ...state,
        loggedIn: true,
        dailyJobs: updateFailJobsFunc(state.dailyJobs, action.payload),
      };
    case "ATTENDENCE":
      return {
        ...state,
        loggedIn: true,
        dailyJobs: attendenceFunc(state.dailyJobs, action.payload),
      };
    case "ADD_ONLY_JOB":
      return {
      ...state,
      loggedIn: true,
      dailyJobs: updateJobsArray(state.dailyJobs,action.payload)
    };
    default:
      return state;
  }
};
