import { useEffect, useState } from 'react'
 import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateOldJob } from "../../Redux/Actions/CleanerActions";
import { useDispatch,useSelector } from 'react-redux';
export default function ManageEventUseform() {
 const ReduxEvents = useSelector((state) => state.cleaner.dailyJobs);

     const dispatch = useDispatch( )
    
    const [sendToredux,setSendToRedux] = useState(false)
    const putImagetoState = async () => {
      const localParsedPhoto = await AsyncStorage.getItem("localPhoto");
      if (localParsedPhoto !== null) {
        setEventJob({
          ...eventJob,
          imageUrl: JSON.parse(localParsedPhoto),
        });
      }
  };
 
  const setUpdatedStateToEvent = async() => {
    const EventIdLocal = await AsyncStorage.getItem("eventIdlocal");
    console.log("Id from card in dashboard",EventIdLocal)
    if (EventIdLocal) {
      for (let i = 0; i < ReduxEvents.length; i++){
        if (EventIdLocal === ReduxEvents[i]._id) {
          console.log("EVENT ID IN REDUX", ReduxEvents[i]._id);
          setEventJob({
            serviceStatus: ReduxEvents[i].serviceStatus,
            interior: ReduxEvents[i].interior,
            lightsOff: ReduxEvents[i].lightsOff,
            carAvailable: ReduxEvents[i].carAvailable,
            message: ReduxEvents[i].message,
            imageUrl: ReduxEvents[i].imageUrl,
          });
        }
      }
    }
  }
  
  useEffect(() => {
    setUpdatedStateToEvent()
    console.log(eventJob,"UPDATED STATE")
},[])
    useEffect(() => {
      putImagetoState();
    }, [sendUpdateJob]);

    useEffect(() => {
   dispatch(updateOldJob(eventJob))
 
    
},[sendToredux])
    const [Car,setCar]= useState([])

  
    const sendUpdateJob =   (eventId) => {
        console.log("Event id",eventId)
         setEventJob({
            ...eventJob,
            id:eventId
         })
      setSendToRedux(true)
      
}

    return { Car, setCar, eventJob, setEventJob, sendUpdateJob };
}
