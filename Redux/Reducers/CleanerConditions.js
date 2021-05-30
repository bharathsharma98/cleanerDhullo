export const formatDailyJobs = (oldJobs) => {
  for (let i = 0; i < oldJobs.length; i++) {
    oldJobs[i].start = new Date(oldJobs[i].start);
    oldJobs[i].end = new Date(oldJobs[i].end);
  }
  return oldJobs;
};
export const updateOldJobsFunc = (originalJobs, NewJob) => {
  console.log(NewJob, "NEW JOB");
  for (let i = 0; i < originalJobs.length; i++) {
    if (originalJobs[i]._id === NewJob.id) {
      originalJobs[i].serviceStatus = "Completed";
      originalJobs[i].interior = NewJob.interior;
      originalJobs[i].lightsOff =NewJob.lightsOff ;
      originalJobs[i].carAvailable = NewJob.carAvailable;
      originalJobs[i].message =NewJob.message ;
      originalJobs[i].imageUrl =NewJob.imageUrl;
    }
  }
 
  return originalJobs;
}
 
