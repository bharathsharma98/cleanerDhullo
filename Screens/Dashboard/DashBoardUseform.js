import { Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  format,
  compareAsc,
  addDays,
  parseISO,
  isEqual,
  isSameDay,
} from "date-fns";
export default function DashBoardUseform() {
  const windowHeight = Dimensions.get("window").height;
  const cleanerRedux = useSelector((state) => state.cleaner);
  const dailyJobsRedux = useSelector((state) => state.cleaner.dailyJobs);
  const [date, setDate] = useState({ dateVal: new Date() });
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [Myoading, setLoading] = useState(true);

  const filterDailyJobsFunc = () => {
    
    // console.log(date.dateVal.toDateString());
    // console.log(dailyJobsRedux[100]?.start?.toDateString())

    var temp = [];
    //  isSameDay(oneJob.start, parseISO(date.dateVal))
    for (let i = 0; i < dailyJobsRedux.length; i++) {
      if (
        date.dateVal.toDateString() === dailyJobsRedux[i]?.start?.toDateString()
      ) {
        temp.push(dailyJobsRedux[i]);
      }
    }
    setFilteredSchedules(temp.sort(compareAsc));
    console.log("Daily Jobs is", temp);
   
  };
  useEffect(() => {
    setLoading(true)
    //TODO: get dailyschedule joobs and filter into filtered jobs
    filterDailyJobsFunc();
      setLoading(false);
  }, [date]);
  const onNextClick = () => {
    setDate({
      ...date,
      dateVal: addDays(date.dateVal, 1),
    });
  };
  const onBackClick = () => {
    setDate({
      ...date,
      dateVal: addDays(date.dateVal, -1),
    });
  };
  return {
    cleanerRedux,
    dailyJobsRedux,
    date,
    onBackClick,
    onNextClick,
    filteredSchedules,
    Myoading,
  };
}
