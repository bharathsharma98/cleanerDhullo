import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OneEvent from "../Components/OneEvent/OneEvent";
import {
  addAttendence,
  updateOldJob,
  removeFromQueue,
} from "../Redux/Actions/CleanerActions";
import CameraScreen from "../Screens/Camera/CameraScreen";
import DashBoard from "../Screens/Dashboard/DashBoard";
import DashBoardUseform from "../Screens/Dashboard/DashBoardUseform";
import { Login } from "../Screens/Login/Login";
import ManageEvent from "../Screens/ManageEvent/ManageEvent";
import { baseUrl } from "../Variables/Variables";
const Stack = createStackNavigator();

export const Navigator = () => {
  const { setCheckOut } = DashBoardUseform();
  const [netInfo, setNetInfo] = useState("");
  const isLogged = useSelector((state) => state.cleaner.loggedIn);
  const cleaner = useSelector((state) => state.cleaner.cleaner);
  const originalJobs = useSelector((state) => state.cleaner.dailyJobs);
  const queuedJobs = useSelector((state) => state.cleaner.pendingQueue);
  // console.log(queuedJobs, "Jobs pending to upload");
  const dispatch = useDispatch();

  // console.log(isLogged);
  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo({
        connectionType: state.type,
        isConnected: state.isConnected,
        ipAddress: state.details.ipAddress,
      });
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then((state) => {
      alert(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`
      );
    });
  };
  console.log(netInfo, "STATE", netInfo.isConnected);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      handleQueuedjobsOnline();
    }
  }, [netInfo]);

  const handleQueuedjobsOnline = async () => {
    const checkoutDate = await AsyncStorage.getItem("checkOutDate");
    const parsedCheckoutDate = await JSON.parse(checkoutDate);
    // console.log(parsedCheckoutDate);
    if (parsedCheckoutDate !== null || parsedCheckoutDate !== undefined) {
      await updatePendingCheckout(parsedCheckoutDate);
    }

    //todo fetch
    if (queuedJobs.length === 0) {
      // console.log("No jobs pending");
      //todo - unsubscribe the listening for netInfo
    } else {
      queuedJobs.map((oneQJobId) =>
        updateDailyJobsWithAPI(oneQJobId, parsedCheckoutDate)
      );
    }
  };

  const updatePendingCheckout = async (parsedCheckoutDate) => {
    fetch(`${baseUrl}cleaners/checkOut/${cleaner.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkOut: parsedCheckoutDate,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp === "Check Out for this Date is already available") {
           AsyncStorage.clear();
        }
        // console.log(resp);
          // console.log("checked out successfully");
      })
      .catch((err) => {
        console.log(err);
        // console.log("checkout while coming online failed");
      });
  };
  const updateDailyJobsWithAPI = (jobId,date) => {
    // console.log("job to upload here", jobId);
    const dateUpload = new Date().toDateString()
    // console.log(originalJobs[dateUpload], "jobs");
    const index = originalJobs[dateUpload].jobs.findIndex((x) => x.id === jobId);
    const jobToUpload = originalJobs[dateUpload].jobs[index];
    // console.log(jobToUpload, "Job to Upload");
    fetch(`${baseUrl}scheduledJobs/${jobToUpload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceStatus: jobToUpload.serviceStatus,
        message: jobToUpload.message === undefined ? " " : jobToUpload.message,
      }),
    }).then((res) => res.json())
      .then((resp) => {
        if (resp.scheduledJob !== undefined) {
        console.log("job uploaded..now trying image upload")
        fetch(`${baseUrl}imageUpload/${jobToUpload.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imgSource: jobToUpload.imageUrl.base64,
          }),
        })
          .then((res) => res.json())
          .then((resp) => {
            if (resp) {
              // console.log("image uploaded succesfuly..Removing job from queue")
              dispatch(removeFromQueue(jobId));
            }
          });
      }})
    };
    
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogged ? null : (
          <Stack.Screen
            name="login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="dashboard"
          component={DashBoard}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="event" component={OneEvent} />

        <Stack.Screen
          name="manage"
          component={ManageEvent}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
