import { StatusBar, StyleSheet } from "react-native";
 

export const styles = (props) =>
  StyleSheet.create({
    mainContainer: {
      marginTop:StatusBar.currentHeight
    },
    cleanerName: {
      fontSize: 20,
      textAlign: "center",
      padding: 10,
      backgroundColor: "#03588C",
      color: "white",
    },
    eventStyle: {
      width: 100,
      marginLeft: 0,
      borderRadius: 5,
    },
    DateViewContainer: {
      display: "flex",
      flexDirection: "row",

      justifyContent: "center",
      alignItems: "center",
      height: 80,
    },
    DateText: {
      fontSize: 20,
    },
    checkContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-evenly",
      alignItems: "center",
      marginBottom: 20,
    },
    checkinButton: {
      borderWidth: 1,
      borderColor: "black",
      backgroundColor: "#f7722f",
      opacity: props?.checkinState ? 1 : 0.3,
    },
    checkOutButton: {
      borderWidth: 1,
      borderColor: "black",
      backgroundColor: "#f7722f",
      opacity: props?.checkOutState ? 1 : 0.3,
    },
    oneJob: {
      display: "flex",
      flexDirection: "row",
      backgroundColor:
        props?.service === "WASHING"
          ? "#ADD9C5"
          : null || props?.service === "SANITIZATION"
          ? "#F2CAB3"
          : null || props?.service === "DETAILING"
          ? "#F29BB2"
          : null,
      margin: 5,
      marginRight: 10,
      marginLeft: 10,
      height: 100,
      justifyContent: "space-around",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "grey",
      borderRadius: 5,
    },

    timetext: {
      width: 80,
      fontSize: 25,
    },
    carNo: {
      width: 140,
      fontSize: 22,
    },
    serviceType: { width: 100 },
    statusContaine: { width: 50 },

    cards: {
      opacity: props?.showMode ? 1 : 0.3,
    },
  });
