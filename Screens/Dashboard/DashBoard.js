import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import React from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { styles } from "./DashBoard.styles";
import DashBoardUseform from "./DashBoardUseform";
function Dashboard({ navigation }) {
  const { date,checkIn,checkInHandler,checkOut,checkOutHandler,prevDayHandler,nextDayHandler,cleaner,dailyJobs,showJobs} = DashBoardUseform();

  const NavigationHandler = (selectedData,myDate) => {
    navigation.navigate("manage", { selectedData, myDate });
    AsyncStorage.setItem("eventIdlocal", selectedData._id);
  };
 
console.log("JOBS OF TODAY ARE", dailyJobs[date.toDateString()]?.jobs);
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
          style={styles({ checkOutState: checkOut }).checkOutButton}
          onPress={() => checkOutHandler()
          }

        >
          CHECK OUT
        </Button>
      </View>

      <FlatList
        style={styles().FlatList}
        data={dailyJobs[date.toDateString()] === undefined? []: dailyJobs[date.toDateString()].jobs}
        keyExtractor={(onejob) => {
          onejob.item?._id;
        }}
        renderItem={(onejob) => (
          <View style={styles({ showMode:showJobs}).cards}>
            <TouchableOpacity
              disabled={!showJobs}
              style={styles({ service: onejob.item.service }).oneJob}
              onPress={() => NavigationHandler(onejob.item, date)}
            >
              <Text style={styles().timetext}>
                {format(new Date(onejob.item.start), "hh:mm")}
              </Text>
              {/* <Text>{onejob.item.service}</Text> */}
              <Text style={styles().carNo}>
                {onejob.item.title?.toString()?.substr(12)}
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
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
export default Dashboard;
