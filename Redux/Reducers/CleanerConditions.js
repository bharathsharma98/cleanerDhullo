export const addJobsFunc = (oldJobs, jobsandDate) => {
  const tempJobs = oldJobs;
  tempJobs[jobsandDate.date.toDateString()] = {
    jobs: jobsandDate.jobs,
    attendence: "Not Present",
  };
  return tempJobs;
};
export const updateJobsArray = (oldJobs, jobsAndDate) => {
  const tempJobs = oldJobs;
  tempJobs[jobsAndDate.date.toDateString()].jobs = jobsAndDate.jobs;
  return tempJobs;
};
export const attendenceFunc = (oldjobs, statusAndDate) => {
  oldjobs[statusAndDate.date.toDateString()].attendence = statusAndDate.status;
  return oldjobs;
};
export const updateOldJobsFunc = (originalJobs, NewJobAndDate) => {
  // console.log(NewJobAndDate.date, "hello");
  for (
    let i = 0;
    i < originalJobs[NewJobAndDate.date.toDateString()].jobs.length;
    i++
  ) {
    if (
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i]._id ===
      NewJobAndDate.job.id
    ) {
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].serviceStatus =
        NewJobAndDate.job.status;
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].interior =
        NewJobAndDate.job.interior;
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].lightsOff =
        NewJobAndDate.job.lightsOff;
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].carAvailable =
        NewJobAndDate.job.carAvailable;
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].message =
        NewJobAndDate.job.message;
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].imageUrl =
        NewJobAndDate.job.imageUrl;
    }
  }

  return originalJobs;
};

export const updateFailJobsFunc = (originalJobs, NewJobAndDate) => {
  for (
    let i = 0;
    i < originalJobs[NewJobAndDate.date.toDateString()].jobs.length;
    i++
  ) {
    if (
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i]._id ===
      NewJobAndDate.job.id
    ) {
      originalJobs[NewJobAndDate.date.toDateString()].jobs[i].serviceStatus =
        "Incomplete";
      // originalJobs[NewJobAndDate.date.toDateString()].jobs[i].interior = NewJob.interior;
      // originalJobs[NewJobAndDate.date.toDateString()].jobs[i].lightsOff = NewJob.lightsOff;
      // originalJobs[NewJobAndDate.date.toDateString()].jobs[i].carAvailable = NewJob.carAvailable;
      // originalJobs[NewJobAndDate.date.toDateString()].jobs[i].message = NewJob.message;
      // originalJobs[NewJobAndDate.date.toDateString()].jobs[i].imageUrl = NewJob.imageUrl;
    }
  }

  return originalJobs;
};

export const addToQueuefunc = (prevQueue, newId) => {
  if (prevQueue.length === 0) {
    prevQueue.push(newId)

  }
  else {
    for (let i = 0; i < prevQueue.length; i++) {
      if (prevQueue[i]=== newId) {
      return  prevQueue;
      }
      else {
        prevQueue.push(newId)
      }
    }
  }
  
  return prevQueue;
}
export const removeFromQueue = (prevQueue, newId) => {
  // console.log(prevQueue);
  if (prevQueue.length !== 0) {
     const index = prevQueue.indexOf(newId);
     if (index > -1) prevQueue.splice(index, 1);
  }  
// console.log(prevQueue);
  return prevQueue;
};