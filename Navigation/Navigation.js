import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { Drawer } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import OneEvent from "../Components/OneEvent/OneEvent";
import CameraScreen from "../Screens/Camera/CameraScreen";
import DashBoard from "../Screens/Dashboard/DashBoard";
import { Login } from "../Screens/Login/Login";
import ManageEvent from "../Screens/ManageEvent/ManageEvent";
import { baseUrl } from "../Variables/Variables";
import { useDispatch } from "react-redux";
import { addAttendence, updateOldJob } from "../Redux/Actions/CleanerActions";
import DashBoardUseform from "../Screens/Dashboard/DashBoardUseform";
const Stack = createStackNavigator();
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Navigator = () => {
  const { setCheckOut } = DashBoardUseform();
  const [netInfo, setNetInfo] = useState("");
  const isLogged = useSelector((state) => state.cleaner.loggedIn);
  const cleaner = useSelector((state) => state.cleaner.cleaner);

  const dispatch = useDispatch();

  console.log(isLogged);
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
      fetchbackgroundJobsAndDate();
    }
  }, [netInfo]);
  const [count, setCount] = useState(0);
  const fetchbackgroundJobsAndDate = async () => {
    const backGroundJobs = await AsyncStorage.getItem("backgroundJobs");
    const parsedJob = await JSON.parse(backGroundJobs);
    const checkoutDate = await AsyncStorage.getItem("checkOutDate");
    const parsedCheckoutDate = await JSON.parse(checkoutDate);
    if (parsedJob !== undefined || parsedCheckoutDate !== undefined) {
      //todo fetch
      console.log(parsedCheckoutDate, "and", parsedJob);
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
          if (resp) {
            console.log("response is achieved");
            dispatch(
              addAttendence({
                date: new Date(parsedCheckoutDate).toDateString(),
                status: "checkedOut",
              })
            );
            parsedJob.map((oneJob) => updateDailyJobsWithAPI(oneJob));
          }
        })
        .catch((err) => {
          console.log(err);
        });

      //todo clear async storage
    }
  };
  const updateDailyJobsWithAPI = async (job) => {
    console.log("reached update in background");
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
        dispatch(updateOldJob({ job: job, date: date }));
        setCheckOut(false);
        setCount(count + 1);
        console.log(count, "JOB UPDATED IN BG");
      })
      .catch((err) => {
        console.log(err);
        //todo action update as Incomplete
      });
    if (count === parsedJob.length) {
      AsyncStorage.removeItem("backgroundJobs", (err) => {
        console.log(err);
      });
      AsyncStorage.removeItem("checkOutDate", (err) => {
        console.log(err);
      });
    }
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
