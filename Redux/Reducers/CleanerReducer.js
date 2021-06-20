import {
  addJobsFunc,
  updateOldJobsFunc,
  attendenceFunc,
  updateJobsArray,
  updateFailJobsFunc,
  addToQueuefunc,
  removeFromQueue,
} from "./CleanerConditions";

const initState = {
  cleaner: [],
  dailyJobs: {},
  pendingQueue:[],
  loggedIn: false,
  refreshed:false
};

export const CleanerReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_CLEANER":
      return {
        ...state,
        
        cleaner: action.payload,
      };
    case "ADD_JOB":
      return {
        ...state,
        dailyJobs: addJobsFunc(state.dailyJobs, action.payload),
      };

    case "UPDATE_JOB":
      return {
        ...state,
        
        dailyJobs:updateOldJobsFunc(state.dailyJobs, action.payload),
      };
    case "UPDATE_JOB_FAIL":
      return {
        ...state,
        
        dailyJobs: updateFailJobsFunc(state.dailyJobs, action.payload),
      };
    case "ATTENDENCE":
      return {
        ...state,
       
        dailyJobs: attendenceFunc(state.dailyJobs, action.payload),
      };
    case "ADD_ONLY_JOB":
      return {
        ...state,
        
        dailyJobs: updateJobsArray(state.dailyJobs, action.payload),
      };
    case "ADD_TO_QUEUE":
      return {
        ...state,
        
        pendingQueue: addToQueuefunc(state.pendingQueue, action.payload),
      };
    case "REMOVE_TO_QUEUE":
      return {
        ...state,
        
        pendingQueue: removeFromQueue(state.pendingQueue, action.payload),
      };
    case "REFRESH":
      return {
        ...state,
       
        refreshed:!state.refreshed
      };
    default:
      return state;
  }
};
