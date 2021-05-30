import React, { version } from "react";
import { StyleSheet, View, Text, CheckBox, Image, TouchableOpacity } from "react-native";
import { Styles } from "./ManageEvent.styles";
import { format, fromUnixTime } from 'date-fns';
import {updateAJob} from '../../Redux/Actions/CleanerActions'
import ManageEventUseform from './ManageEventUseform'
import { Button, TextInput } from "react-native-paper";
export default function ManageEvent({ route,navigation }) {
const { Car, setCar, eventJob, setEventJob, sendUpdateJob } =
  ManageEventUseform();
  const { selectedData, myDate, myPhoto } = route.params;
  
  console.log(myPhoto);
  return (
    <View
      style={
        selectedData.service === "WASHING"
          ? { backgroundColor: "#ADD9C5", height: "100%" }
          : null || selectedData.service === "DETAILING"
          ? { backgroundColor: "#F29BB2", height: "100%" }
          : null || selectedData.service === "SANITIZATION"
          ? { backgroundColor: "#F2CAB3", height: "100%" }
          : null
      }
    >
      <View style={Styles.dateContainer}>
        <Text style={Styles.DateText}>{format(myDate, "dd MMM")}</Text>
      </View>
      <View style={Styles.serviceContainer}>
        <Text style={Styles.DateText}>{selectedData.service}</Text>
      </View>
      <View style={Styles.jobdetailsContainer}>
        <View style={Styles.carNameContainer}>
          <Text style={Styles.CarTextStyleTopic}>Car No</Text>
          <Text style={Styles.CarTextStyleDash}>-</Text>
          <Text style={Styles.CarTextStyleData}>
            {selectedData.title?.toString()?.substr(12)}
          </Text>
        </View>
        <View style={Styles.addressContainer}>
          <Text style={Styles.addressTextStyleTopic}>Address</Text>
          <Text style={Styles.addressTextStyleDash}>-</Text>
          <Text style={Styles.addressTextStyleData}>
            {selectedData.title?.toString()?.substr(12)}
          </Text>
        </View>
        <View style={Styles.adressContainer}></View>
      </View>
      {selectedData.service === "WASHING" ? (
        <View style={Styles.carAvailiableContainer}>
          <Text>Car Availiable</Text>
          <CheckBox
            value={eventJob.carAvailable}
            onValueChange={() =>
              setEventJob({ ...eventJob, carAvailable: !eventJob.carAvailable })
            }
            style={Styles.checkbox}
          />
        </View>
      ) : (
        <View style={Styles.interiornlightsContainer}>
          <View style={Styles.interiorLightsCheckBoc}>
            <Text>Interior</Text>
            <CheckBox
              value={eventJob.interior}
              onValueChange={() =>
                setEventJob({
                  ...eventJob,
                  interior: !eventJob.interior,
                })
              }
              style={Styles.checkbox}
            />
          </View>
          <View style={Styles.interiorLightsCheckBoc}>
            <Text>Lights Off</Text>
            <CheckBox
              value={eventJob.lightsOff}
              onValueChange={() =>
                setEventJob({
                  ...eventJob,
                  lightsOff: !eventJob.lightsOff,
                })
              }
              style={Styles.checkbox}
            />
          </View>
          <View style={Styles.interiorLightsCheckBoc}>
            <Text>Return Keys</Text>
            <CheckBox
              value={eventJob.returnKeys}
              onValueChange={() =>
                setEventJob({
                  ...eventJob,
                  returnKeys: !eventJob.returnKeys,
                })
              }
              style={Styles.checkbox}
            />
          </View>
        </View>
      )}
      <View style={Styles.imageContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("camera")}>
          <Image
            style={Styles.logo}
            source={{
              uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==",
            }}
          />
        </TouchableOpacity>

        <Image
          style={Styles.logo2}
          source={{
            uri: myPhoto?.uri,
          }}
        />
      </View>
      <View style={Styles.messageContainer}>
        <TextInput
          onChangeText={(text) => setEventJob({ ...eventJob, message: text })}
          placeholder="Write a Message"
          value={eventJob.message}
        />
      </View>
      <View style={Styles.buttonContainer}>
        <Button
          onPress={() => sendUpdateJob(selectedData._id)}
          style={Styles.saveButtom}
          mode="contained"
        >
          SAVE
        </Button>
      </View>
    </View>
  );
}

