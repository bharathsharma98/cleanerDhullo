import { StyleSheet } from "react-native";
import React from "react";

export const Styles = StyleSheet.create({
  ManageContainer: {
    height: "100%",
    backgroundColor: "red",
  },
  dateContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  serviceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginBottom: 30,
  },
  DateText: {
    fontSize: 30,
  },
  jobdetailsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    margin: 5,
  },
  carNameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 20,
  },
  CarTextStyleTopic: { fontSize: 25, width: 100 },
  CarTextStyleDash: { fontSize: 25, width: 10 },
  CarTextStyleData: { fontSize: 25, width: 160 },
  addressContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 20,
  },
  addressTextStyleTopic: { fontSize: 25, width: 100 },
  addressTextStyleDash: { fontSize: 25, width: 10 },
  addressTextStyleData: { fontSize: 25, width: 160, margin: 0 },
  carAvailiableContainer: {
    display: "flex",

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
  checkbox: {
    display: "flex",
  },
  interiornlightsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "baseline",

    marginLeft: 100,
    marginBottom: 30,
    width: "50%",
  },
  interiorLightsCheckBoc: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
    marginLeft: 30,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderWidth: 2,
    padding: 10,
    borderColor: "grey",
    
  },
  logo2: {
    width: 100,
    height: 100,
    borderWidth: 1,
    padding: 10,
    borderColor: "grey",
    borderRadius: 100,
  },
  messageContainer: {
    margin: 10,
    marginTop: 30,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtom: {
    height: 40,
    width: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderWidth: 0,
    borderRadius: 0,
  },
});
