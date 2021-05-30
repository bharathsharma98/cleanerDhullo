import { formatDailyJobs,updateOldJobsFunc, updateJobsFunc } from "./CleanerConditions";


const initState = {
  cleaner: [],
  dailyJobs: [],
  loggedIn:false,
};

export const CleanerReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_CLEANER":
      return {
          ...state,
          loggedIn:true,
        cleaner: action.payload,
      };
    case "ADD_JOB":
      return {
          ...state,
          loggedIn:true,
        dailyJobs:formatDailyJobs(action.payload),
      };
    
    case "UPDATE_OLD_JOB":
      return {
        ...state,
        loggedIn: true,
        dailyJobs: updateOldJobsFunc(
          state.dailyJobs,
          action.payload
        ),
      };
    
    
    default:
      return state;
  }
};
