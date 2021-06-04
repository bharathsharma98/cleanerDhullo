import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Drawer } from "react-native-paper";
import { useSelector } from "react-redux";
import OneEvent from "../Components/OneEvent/OneEvent";
import CameraScreen from "../Screens/Camera/CameraScreen";
import DashBoard from "../Screens/Dashboard/DashBoard";
import { Login } from "../Screens/Login/Login";
import ManageEvent from "../Screens/ManageEvent/ManageEvent";
const Stack = createStackNavigator();

export const Navigator = () => {
  const isLogged = useSelector((state) => state.cleaner.loggedIn);
  console.log(isLogged);
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
