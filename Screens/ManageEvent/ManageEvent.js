import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  CheckBox,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updateOldJob } from "../../Redux/Actions/CleanerActions";
import { Styles } from "./ManageEvent.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { baseUrl } from "../../Variables/Variables";
export default function ManageEvent({ route, navigation }) {
  const { selectedData, myDate, myPhoto } = route.params;
  console.log("SELECTED DATA", selectedData, myDate);
  const dispatch = useDispatch();
  const ReduxEvents = useSelector((state) => state.cleaner.dailyJobs);
  const [localPic, setLoaclPic] = useState("");
  const [eventJob, setEventJob] = useState({
    id: selectedData._id,
    carAvailable: selectedData.carAvailable,
    interior: selectedData.interior,
    lightsOff: selectedData.lightsOff,
    returnKeys: selectedData.returnKeys,
    message: selectedData.message,
    imageUrl: selectedData.imageUrl,
  });

  const fetchImageFromLocal = async () => {
    const localPhoto = await AsyncStorage.getItem(`localPhoto${eventJob.id}`);
    await setLoaclPic(JSON.parse(localPhoto));
    if (localPhoto === null) {
      await setEventJob({
        ...eventJob,
        imageUrl: JSON.parse(localPhoto),
      });
    }
  };

  useEffect(() => {
    fetchImageFromLocal();
  }, [myPhoto]);

  const updatJobOnline = async () => {
    if (
      eventJob.carAvailable === undefined ||
      eventJob.carAvailable === false
      ) {
      //todo - post API with Incomplete status
      fetch(`${baseUrl}scheduledJobs/${eventJob.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceStatus: "CarNotAvailiable",
          message: eventJob.message,
        }),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.scheduledJob !== undefined) {
          dispatch(
            updateOldJob({
              date: myDate,
              job: {
                id: eventJob.id,
                carAvailable: eventJob.carAvailable,
                imageUrl: localPic,
                interior: eventJob.interior,
                lightsOff: eventJob.lightsOff,
                message: eventJob.message,
                returnKeys: eventJob.returnKeys,
                status: "Incomplete",
              },
            })
            );
            fetch(`${baseUrl}imageUpload/${eventJob.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imgSource: localPic.base64,
              }),
            })
              .then((res) => res.json())
              .then((resp) => {
                console.log("image upload response", resp);
              })
              .catch((err) => {
                //todo - add in queue
              });
        }
        })

        .catch((err) => {
        
          //todo - else add to queue
      })
      
      
    } else {
      fetch(`${baseUrl}scheduledJobs/${eventJob.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceStatus: "Complete",
          message: eventJob.message,
        }),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.scheduledJob !== undefined) {
            dispatch(
              updateOldJob({
                date: myDate,
                job: {
                  id: eventJob.id,
                  carAvailable: eventJob.carAvailable,
                  imageUrl: localPic,
                  interior: eventJob.interior,
                  lightsOff: eventJob.lightsOff,
                  message: eventJob.message,
                  returnKeys: eventJob.returnKeys,
                  status: "Complete",
                },
              })
            );
            fetch(`${baseUrl}imageUpload/${eventJob.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imgSource: localPic.base64,
              }),
            })
              .then((res) => res.json())
              .then((resp) => {
                console.log("image upload response", resp);
              })
              .catch((err) => {
                //todo - add in queue
              });
          }
        })
        .catch((err) => {
          updateOldJob({
            date: myDate,
            job: {
              id: eventJob.id,
              carAvailable: eventJob.carAvailable,
              imageUrl: localPic,
              interior: eventJob.interior,
              lightsOff: eventJob.lightsOff,
              message: eventJob.message,
              returnKeys: eventJob.returnKeys,
              status: "Complete",
            },
          });
          console.log("ADD IN QUEUE");
        });
    }
    await navigation.navigate("dashboard");
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={
          (Styles({ service: selectedData.service }).ManageContainer,
          { marginTop: StatusBar.currentHeight })
        }
      >
        <View style={Styles().dateContainer}>
          <Text style={Styles().DateText}>{format(myDate, "dd MMM")}</Text>
        </View>
        <View style={Styles().serviceContainer}>
          <AntDesign name="car" size={30} />
          <Text style={Styles().ServiceText}>{selectedData.service}</Text>
        </View>
        <View style={Styles().jobdetailsContainer}>
          <View style={Styles().carNameContainer}>
            <Text style={Styles().CarTextStyleTopic}>Car No</Text>
            <Text style={Styles().CarTextStyleDash}>-</Text>
            <Text style={Styles().CarTextStyleData}>
              {selectedData.title?.toString()?.substr(12)}
            </Text>
          </View>
          <View style={Styles().addressContainer}>
            <Text style={Styles().addressTextStyleTopic}>Address</Text>
            <Text style={Styles().addressTextStyleDash}>-</Text>
            <Text style={Styles().addressTextStyleData}>
              {selectedData.title?.toString()?.substr(12)}
            </Text>
          </View>
          <View style={Styles().adressContainer}></View>
        </View>
        {selectedData.service === "WASHING" ? (
          selectedData.serviceSurface === "INTERIOR" ? (
            <View>
              <View style={Styles().carAvailiableContainer}>
                <CheckBox
                  disabled={selectedData.serviceStatus === "Complete"}
                  value={eventJob.carAvailable}
                  onValueChange={() =>
                    setEventJob({
                      ...eventJob,
                      carAvailable: !eventJob.carAvailable,
                    })
                  }
                  style={Styles().checkbox}
                />
                <Text>Car Availiable</Text>
              </View>
              <View style={Styles().interiorLightsCheckBoc}>
                <Text>Return Keys</Text>
                <CheckBox
                  disabled={selectedData.serviceStatus === "Complete"}
                  value={eventJob.returnKeys}
                  onValueChange={() =>
                    setEventJob({
                      ...eventJob,
                      returnKeys: !eventJob.returnKeys,
                    })
                  }
                  style={Styles().checkbox}
                />
              </View>
            </View>
          ) : (
            <View style={Styles().carAvailiableContainer}>
              <CheckBox
                disabled={selectedData.serviceStatus === "Complete"}
                value={eventJob.carAvailable}
                onValueChange={() =>
                  setEventJob({
                    ...eventJob,
                    carAvailable: !eventJob.carAvailable,
                  })
                }
                style={Styles().checkbox}
              />
              <Text>Car Availiable</Text>
            </View>
          )
        ) : (
          <View style={Styles().interiornlightsContainer}>
            <View style={Styles().interiorLightsCheckBoc}>
              <Text>Interior</Text>
              <CheckBox
                disabled={selectedData.serviceStatus === "Complete"}
                value={eventJob.interior}
                onValueChange={() =>
                  setEventJob({
                    ...eventJob,
                    interior: !eventJob.interior,
                  })
                }
                style={Styles().checkbox}
              />
            </View>
            <View style={Styles().interiorLightsCheckBoc}>
              <Text>Lights Off</Text>
              <CheckBox
                disabled={selectedData.serviceStatus === "Complete"}
                value={eventJob.lightsOff}
                onValueChange={() =>
                  setEventJob({
                    ...eventJob,
                    lightsOff: !eventJob.lightsOff,
                  })
                }
                style={Styles().checkbox}
              />
            </View>
            <View style={Styles().interiorLightsCheckBoc}>
              <Text>Return Keys</Text>
              <CheckBox
                disabled={selectedData.serviceStatus === "Complete"}
                value={eventJob.returnKeys}
                onValueChange={() =>
                  setEventJob({
                    ...eventJob,
                    returnKeys: !eventJob.returnKeys,
                  })
                }
                style={Styles().checkbox}
              />
            </View>
          </View>
        )}
        <View style={Styles().imageContainer}>
          <TouchableOpacity
            disabled={selectedData.serviceStatus === "Complete"}
            onPress={() =>
              navigation.navigate("camera", { eventId: eventJob.id })
            }
          >
            <Image
              style={Styles().logo}
              source={{
                uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==",
              }}
            />
          </TouchableOpacity>

          <Image
            style={Styles().logo2}
            source={{
              uri: localPic?.uri,
              //todo : see redux first then put localPic and clear async
            }}
          />
        </View>
        <View style={Styles().messageContainer}>
          <TextInput
            disabled={selectedData.serviceStatus === "Complete"}
            onChangeText={(text) => setEventJob({ ...eventJob, message: text })}
            placeholder="Write a Message"
            value={eventJob.message}
            underlineColor="#03588C"
            underlineColorAndroid="#03588C"
            style={{ height: 100 }}
          />
        </View>
        <View style={Styles().buttonContainer}>
          <Button
            color="#03588C"
            disabled={selectedData.serviceStatus === "Complete"}
            onPress={() => updatJobOnline()}
            style={Styles().saveButtom}
            mode="contained"
          >
            SAVE
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
