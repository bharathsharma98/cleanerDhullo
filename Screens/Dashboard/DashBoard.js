import { AntDesign, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import { Button } from "react-native-paper";
import { addDays, subHours } from "date-fns";
import {addOnlyJobsArray, refresh} from '../../Redux/Actions/CleanerActions'
import { styles } from "./DashBoard.styles";
import DashBoardUseform from "./DashBoardUseform";
import { baseUrl } from "../../Variables/Variables";
function Dashboard({ navigation, route }) {
  
  console.log(route.params, "page")
  const {
    date,
    checkIn,
    checkInHandler,
    checkOut,
    checkOutHandler,
    prevDayHandler,
    nextDayHandler,
    cleaner,
    dailyJobs,
    showJobs,
    todaysData,
  } = DashBoardUseform();
  const [refreshPage, setRefreshPage] = useState(false)
 
   
  const NavigationHandler = (selectedData, myDate) => {
    navigation.navigate("manage", { selectedData, myDate });
    AsyncStorage.setItem("eventIdlocal", selectedData._id);
  };
  const Refresh = useSelector((state) => state.cleaner.refreshed);
  console.log(Refresh,"REFRESH STATUS")
 
 const [state, setState] = useState({count:0});
useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    setState({ count: state.count + 1 });
  })
  // Return the function to unsubscribe from the event so it gets removed on unmount
}, [navigation, route,dailyJobs]);
  return (
    <View style={styles().mainContainer}>
      <Text style={styles().cleanerName}>{cleaner.name}</Text>
      <View style={styles().DateViewContainer}>
        <Button onPress={() => prevDayHandler()}>
          <AntDesign name="left" size={24} color="black" />
        </Button>
        <Text style={styles().DateText}>{format(date, "dd-MMM")}</Text>
        <Button onPress={() => nextDayHandler()}>
          <AntDesign name="right" size={24} color="black" />
        </Button>
      </View>
      <View style={styles().checkContainer}>
        <Button
          icon="check"
          color="black"
          mode="outlined"
          style={styles({ checkinState: checkIn }).checkinButton}
          onPress={() => checkInHandler()}
          disabled={!checkIn}
        >
          CHECK IN
        </Button>

        <Button
          icon="check"
          color="black"
          mode="outlined"
          disabled={!checkOut}
          style={styles({ checkOutState: checkOut }).checkOutButton}
          onPress={() => checkOutHandler()}
        >
          CHECK OUT
        </Button>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshPage} onRefresh={() =>setState({count:state.count+1})} />
        }
        style={styles().FlatList}
        data={todaysData}
        keyExtractor={(onejob) => {
          onejob.item?.id;
        }}
        extraData={[todaysData, state]}
        renderItem={(onejob) => (
          <View style={styles({ showMode: showJobs }).cards}>
            <TouchableOpacity
              disabled={!showJobs || onejob.item.serviceStatus !== "Pending"}
              style={
                styles({
                  service: onejob.item.service,
                  status: onejob.item.serviceStatus,
                }).oneJob
              }
              onPress={() => NavigationHandler(onejob.item, date)}
            >
              <Text style={styles().timetext}>
                {format(new Date(onejob.item.start), "kk:mm")}
              </Text>
              {/* <Text>{onejob.item.service}</Text> */}
              <Text style={styles().carNo}>
                {onejob.item.title?.toString()?.substr(7)}
              </Text>
              {/* <Text style={styles.serviceType}>{onejob.item.serviceType}</Text> */}
              <Text style={styles().statusContaine}>
                {onejob.item.serviceStatus === "Pending" ? (
                  <AntDesign name="exclamationcircleo" size={28} color="grey" />
                ) : null}
                {onejob.item.serviceStatus === "Complete" ? (
                  <AntDesign name="check" size={28} color="green" />
                ) : null}
                {onejob.item.serviceStatus === "Incomplete" ? (
                  <AntDesign name="closecircleo" size={28} color="red" />
                ) : null}
                {onejob.item.serviceStatus === "CarNotPresent" ? (
                  <Entypo name="circle" size={28} color="green" />
                ) : null}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
export default Dashboard;
