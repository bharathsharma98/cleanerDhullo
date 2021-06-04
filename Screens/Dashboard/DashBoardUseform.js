import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { addDays ,setHours, subHours} from "date-fns";
import {
  addJobs,
  addAttendence,
  addOnlyJobsArray,
  updateFailedJob,
  updateOldJob
} from "../../Redux/Actions/CleanerActions";
import { baseUrl } from "../../Variables/Variables";
 

export default function DashBoardUseform() {
  //?redux
  const dispatch = useDispatch();
  const cleaner = useSelector((state) => state.cleaner.cleaner);
  const dailyJobs = useSelector((state) => state.cleaner.dailyJobs);

  //todo change cleaner.cleaner if adding .cleaner during login

  //?states
  const [date, setDate] = useState(new Date());
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  //?useEffects
  useEffect(() => {
    if (date.toDateString() === new Date().toDateString()) {
      setCheckIn(true);
    }

    fetchDailyJobs();
    //todo:fetch statement here for that day dailyschedules
  }, []);

  useEffect(() => {
 
    if (dailyJobs[date.toDateString()]?.attendence === "checkedIn") {
      // if (dailyJobs[date.toDateString()]?.attendence === "checkedOut")
        setCheckIn(false);
    } else {
      setCheckIn(true);
    }
    if (
      dailyJobs[date.toDateString()]?.attendence === "checkedIn" &&
      date.toDateString() === new Date().toDateString()
    ) {
      setCheckOut(true);
    } else {
      setCheckOut(false);
    }
    if (dailyJobs[date.toDateString()] === undefined) {
      fetchDailyJobs()
    }
    else {
       fetchDailyJobsArray();
    }
   
  }, [date]);
  //?functions

  const checkInHandler = async () => {
    await fetchDailyJobsArray();
    await fetch(`${baseUrl}cleaners/checkIn/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkIn: date.toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp) {
          setCheckIn(false);
          setCheckOut(true);
          setShowJobs(true);

          dispatch(
            addAttendence({
              date: date,
              status: "checkedIn",
            })
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const checkOutHandler = () => {
   

    setCheckOut(false);
    setShowJobs(false);
    const jobsCompleted = dailyJobs[date.toDateString()].jobs.filter((oneJob) => oneJob.serviceStatus === 'Complete');
    const pendingJobs = dailyJobs[date.toDateString()].jobs.filter((oneJob) => oneJob.serviceStatus === 'Pending')

    console.log(jobsCompleted, "pendingJobs");
    console.log(pendingJobs, "pendingJobs");

    if (pendingJobs.length !== 0) {
      alert("jobs pending")
      //todo hanldle popup here
    pendingJobs.map((oneJob)=>updateJobsAsMissed(oneJob))
    }
    else {
      alert("Are you Sure");
      //todo handle alert
      jobsCompleted.map((oneJob)=>updateDailyJobsWithAPI(oneJob))
    }



  };

  const updateDailyJobsWithAPI = async (job) => {
    await fetch(`${baseUrl}scheduledJobs/${job.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceStatus: job.serviceStatus,
        message:job.message
      }),
    }).then((res) => res.json())
      .then((resp) => {
        //todo action update as Complete
        updateOldJob({job:job,date:date})
      })
      .catch((err) => {
        console.log(err)
        //todo action update as Incomplete
      });
      
  }
  const updateJobsAsMissed = (job) => {
    dispatch(updateFailedJob({ job: job, date: date }));
    //todo action update ad Incomplete
  }
  const prevDayHandler = () => {
    setDate(addDays(date, -1));
  };
  const nextDayHandler = () => {
    setDate(addDays(date, 1));
  };

  const fetchDailyJobs = () => {

    console.log(subHours(addDays(date, -1), 5).toISOString(), "fate passed");
    fetch(`${baseUrl}scheduledJobs/ByDate/cleaner/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: subHours(addDays(date,0), 5).toISOString(),
        end: subHours(addDays(date, 1), 5).toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        dispatch(addJobs({ date: date, jobs: resp.scheduledJobs }));
      })
      .catch((err) => console.log(err));
  };
  const fetchDailyJobsArray = () => {
    console.log("Date Passed is ", addDays(date, -1).toISOString());
    console.log(date.toISOString());
    fetch(`${baseUrl}scheduledJobs/ByDate/cleaner/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: subHours(addDays(date, 0), 5).toISOString(),
        end: subHours(addDays(date, 1), 5).toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        dispatch(
          addOnlyJobsArray({
            date: date,
            jobs: resp.scheduledJobs,
          })
        );
      })
      .catch((err) => console.log(err));
  };
  return {
    date,
    checkIn,
    checkOut,
    showJobs,
    checkInHandler,
    checkOutHandler,
    prevDayHandler,
    nextDayHandler,
    cleaner,
    dailyJobs,
  };
}
