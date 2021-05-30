import { format } from "date-fns";
import React from "react";
 
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { styles } from "./DashBoard.styles";
import DashBoardUseform from "./DashBoardUseform";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator } from 'react-native';
import OneEvent from "../../Components/OneEvent/OneEvent";
function Dashboard({ navigation }) {
  const {
    cleanerRedux,
    date,
    onBackClick,
    onNextClick,
    filteredSchedules,
    Myoading,
  } = DashBoardUseform();
  console.log(Myoading);
  const NavigationHandler = (selectedData,myDate) => {
    navigation.navigate("manage", { selectedData,myDate });
  };

  return (
    <View>
      <Text style={styles.cleanerName}>{cleanerRedux.cleaner.name}</Text>
      <View style={styles.DateViewContainer}>
        <Button onPress={() => onBackClick()}>
          <AntDesign name="left" size={24} color="black" />
        </Button>
        <Text style={styles.DateText}>{format(date.dateVal, "dd MMM")}</Text>
        <Button onPress={() => onNextClick()}>
          <AntDesign name="right" size={24} color="black" />
        </Button>
      </View>
      {Myoading ? (
        <Text>loading...</Text>
      ) : (
        <FlatList
          data={filteredSchedules}
          keyExtractor={(onejob) => {
            onejob.item?._id;
          }}
          renderItem={(onejob) => (
            <TouchableOpacity
              style={
                onejob.item.service === "WASHING"
                  ? styles.oneJobWashing
                  : null || onejob.item.service === "DETAILING"
                  ? styles.oneJobDetailing
                  : null || onejob.item.service === "SANITIZATION"
                  ? styles.oneJobSanitization
                  : null
              }
              onPress={() => NavigationHandler(onejob.item, date.dateVal)}
            >
              <Text style={styles.timetext}>
                {format(onejob.item.start, "HH:MM")}
              </Text>
              {/* <Text>{onejob.item.service}</Text> */}
              <Text style={styles.carNo}>
                {onejob.item.title?.toString()?.substr(12)}
              </Text>
              {/* <Text style={styles.serviceType}>{onejob.item.serviceType}</Text> */}
              <Text style={styles.statusContaine}>
                {onejob.item.serviceStatus === "Pending" ? (
                  <AntDesign name="exclamationcircleo" size={28} color="grey" />
                ) : null}
                {onejob.item.serviceStatus === "Completed" ? (
                  <AntDesign name="check" size={28} color="green" />
                ) : null}
                {onejob.item.serviceStatus === "Missed" ? (
                  <AntDesign name="closecircleo" size={28} color="red" />
                ) : null}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
export default Dashboard;
