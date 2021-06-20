import { addDays, subHours } from "date-fns";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addAttendence,
  addJobs,
  addOnlyJobsArray,
  updateFailedJob,
  updateOldJob,

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
 const [todaysData,setTodaysData]= useState([])
  //?useEffects
 
   
   
  useEffect(() => {
       fetchDailyJobs();
   
    if (
      date.toDateString() === new Date().toDateString()
      
    ) {

      if (dailyJobs[date.toDateString()]?.attendence === "checkedOut") {
        setCheckIn(false);
        setCheckOut(false);
        
      } else if (dailyJobs[date.toDateString()]?.attendence === "checkedIn") {
        setCheckOut(true)
        setCheckIn(false);
        setShowJobs(true)
        // console.log("nope")
      }
      else if (dailyJobs[date.toDateString()]?.attendence === "Not Present")
      {
        setCheckIn(true)
          
      }
    }
    else {
      setCheckIn(false)
      setCheckOut(false)
    }
   
 
    
  }, []);

  useEffect( () => {
  
 
    if (date.toDateString() === new Date().toDateString()) {
      if (dailyJobs[date.toDateString()]?.attendence === "checkedOut") {
        setCheckIn(false);
        setCheckOut(false);
      } else if (dailyJobs[date.toDateString()]?.attendence === "checkedIn") {
        setCheckIn(false);
        setCheckOut(true)
        setShowJobs(true)
 
      } else if (dailyJobs[date.toDateString()]?.attendence === "Not Present") {
        setCheckIn(true);
      }
    } else {
      setCheckIn(false);
      setCheckOut(false);
      setShowJobs(false);
    }
    if (dailyJobs[date.toDateString()] === undefined) {
        fetchDailyJobs();
      //  console.log("222")
    } else {
      //  console.log("object")
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
      .catch((err) => Alert.alert("No Internet Connection", [
        {
          text: "Ok",
          onPress: () => console.log("Okay Pressed"),
          style: "cancel",
        },
       
        
      ]));
  };

  const checkOutHandler = async() => {
   updateJobsAfterCheckout();
   
  };
  const checkOutOnlineApi = async() => {
  await fetch(`${baseUrl}cleaners/checkOut/${cleaner.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkOut: new Date().toISOString(),
    }),
  })
    .then((res) => res.json())
    .then((resp) => {
      if (resp) {
        console.log("Checked Out successfully");
        setCheckIn(false);
        setCheckOut(false);
        setShowJobs(false);
        dispatch(
          addAttendence({
            date: date,
            status: "checkedOut",
          })
        );
      }
    })
    .catch((err) => {
      const dateOfCheckout = JSON.stringify(new Date());
      
      AsyncStorage.setItem("checkOutDate", dateOfCheckout);
      console.log(
        "Checking out while offline... saving checkout time for later"
      );
    });
}
  const updateJobsAfterCheckout = () => {
    const missedJobs = dailyJobs[date.toDateString()].jobs.filter(
      (oneJob) => oneJob.serviceStatus === 'Pending' 
    );
   

    

    if (missedJobs.length !== 0) {
      Alert.alert("PENDING JOBS!!", "Jobs Pending Are you sure to Checkout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            missedJobs.map((oneJob) => updateJobsAsMissed(oneJob));
            checkOutOnlineApi(); 
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
            missedJobs.map((oneJob) => updateJobsAsMissed(oneJob));
            checkOutOnlineApi(); 
            setCheckOut(false);
            setShowJobs(false);
          },
        },
      ]);
    }

}
 
 
   
      
            
  const updateJobsAsMissed = (job) => {
    dispatch(updateFailedJob({ job: job, date: date }));
    
  };
  const prevDayHandler = () => {
    setDate(addDays(date, -1));
  };
  const nextDayHandler = () => {
    setDate(addDays(date, 1));
  };

  const fetchDailyJobs = async() => {
 
     const startDateToBePassed =  addDays(date, -1).setHours(23)
     const endDateToBePaassed =   addDays(date, 0).setHours(23);
    //  console.log("DATE TO BE PAASED", new Date(startDateToBePassed).toString());
    await fetch(`${baseUrl}scheduledJobs/ByDate/cleaner/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: new Date(startDateToBePassed).toString(),
        end: new Date(endDateToBePaassed).toString(),
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setTodaysData(resp.scheduledJobs);
        dispatch(addJobs({ date: date, jobs: resp.scheduledJobs }));
      })
      .catch((err) => console.log(err));
  };
  const fetchDailyJobsArray = () => {
      const startDateToBePassed = addDays(date, -1).setHours(23);
      const endDateToBePaassed = addDays(date, 0).setHours(23);
    fetch(`${baseUrl}scheduledJobs/ByDate/cleaner/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: new Date(startDateToBePassed).toString(),
        end: new Date(endDateToBePaassed).toString(),
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
         setTodaysData(resp.scheduledJobs);
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
    todaysData,
    
  };
}
