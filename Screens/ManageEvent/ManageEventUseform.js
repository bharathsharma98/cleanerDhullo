import { useEffect, useState } from 'react'
 import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateOldJob } from "../../Redux/Actions/CleanerActions";
import { useDispatch } from 'react-redux';
export default function ManageEventUseform() {
     const dispatch = useDispatch( )
     const [eventJob, setEventJob] = useState({
       carAvailable: false,
       interior: false,
       lightsOff: false,
       returnKeys: false,
       message: "",
       imageUrl: "",
     });
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
