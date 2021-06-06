import { addDays, subHours } from "date-fns";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addAttendence, addJobs,

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
    if (
      date.toDateString() === new Date().toDateString()
      
    ) {
      if (dailyJobs[date.toDateString()]?.attendence === 'checkedOut') {
        setCheckIn(false)
        setCheckOut(false)
      }
      else if (dailyJobs[date.toDateString()]?.attendence === "checkedIn") {
        setCheckIn(false)
      }
        console.log(
          date.toDateString() === new Date().toDateString(),
          "is Today"
        );
      setCheckIn(true);
    }
    else {
      setCheckIn(false)
      setCheckOut(false)
    }

    fetchDailyJobs();
    //todo:fetch statement here for that day dailyschedules
  }, []);

  useEffect(() => {
     
      if (date.toDateString() === new Date().toDateString()) {
        if (dailyJobs[date.toDateString()]?.attendence === "checkedOut") {
          setCheckIn(false);
          setCheckOut(false);
        } else if (dailyJobs[date.toDateString()]?.attendence === "checkedIn") {
          setCheckIn(false);
        }
        console.log(
          date.toDateString() === new Date().toDateString(),
          "is Today"
        );
        setCheckIn(true);
      } else {
        setCheckIn(false);
        setCheckOut(false);
        setShowJobs(false)
      }
    if (dailyJobs[date.toDateString()] === undefined) {
      fetchDailyJobs();
    } else {
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

  const checkOutHandler = async() => {

   await fetch(`${baseUrl}cleaners/checkOut/${cleaner.id}`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       checkOut:new Date().toISOString()
     }),
   }).then((res) => res.json())
     .then((resp) => {
       if (resp) {
         console.log("CHECKED OUT");
         setCheckIn(false);
         setCheckOut(false);
         setShowJobs(false);
         dispatch(
           addAttendence({
             date: date,
             status: "checkedOut",
           })
          
         );
          updateJobsAfterCheckout();
      }
    })
     .catch((err) => {
        console.log("CHECKED IN");
       const missedJobsNoNetwork =   JSON.stringify(dailyJobs[date.toDateString()].jobs);
       const dateOfCheckout =   JSON.stringify(new Date())
         AsyncStorage.setItem("backgroundJobs", missedJobsNoNetwork);
       AsyncStorage.setItem("checkOutDate", dateOfCheckout)
       console.log(missedJobsNoNetwork, dateOfCheckout);
  })
  };

  const updateJobsAfterCheckout = () => {
    const jobsCompleted = dailyJobs[date.toDateString()].jobs.filter(
      (oneJob) => oneJob.serviceStatus === "Complete"
    );
    const pendingJobs = dailyJobs[date.toDateString()].jobs.filter(
      (oneJob) => oneJob.serviceStatus === "Pending"
    );

    console.log(jobsCompleted, "pendingJobs");
    console.log(pendingJobs, "pendingJobs");

    if (pendingJobs.length !== 0) {
      Alert.alert("PENDING JOBS!!", "Jobs Pending Are you sure to Checkout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            pendingJobs.map((oneJob) => updateJobsAsMissed(oneJob));
            setCheckOut(false);
            setShowJobs(false);
          },
        },
      ]);
    } else {
      Alert.alert("CONFIRM", " Are you sure to Checkout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            jobsCompleted.map((oneJob) => updateDailyJobsWithAPI(oneJob));
            setCheckOut(false);
            setShowJobs(false);
          },
        },
      ]);
    }

}
 
 //todo checkout api --> in netInfo
  const updateDailyJobsWithAPI = async (job) => {
    await fetch(`${baseUrl}scheduledJobs/${job.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceStatus: job.serviceStatus,
        message: job.message,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        //todo action update as Complete
        updateOldJob({ job: job, date: date });
      })
      .catch((err) => {
        console.log(err);
        //todo action update as Incomplete
      });
  };
  const updateJobsAsMissed = (job) => {
    dispatch(updateFailedJob({ job: job, date: date }));
    //todo action update ad Incomplete
  };
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
        start: subHours(addDays(date, -1), 5).toISOString(),
        end: subHours(addDays(date, 0), 5).toISOString(),
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
        start: subHours(addDays(date, -1), 5).toISOString(),
        end: subHours(addDays(date, 0), 5).toISOString(),
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

    setCheckIn,
    setCheckOut,
    showJobs,
    checkInHandler,
    checkOutHandler,
    prevDayHandler,
    nextDayHandler,
    cleaner,
    dailyJobs,
  };
}
