import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import { addCleaner } from "../../Redux/Actions/CleanerActions";
import { baseUrl } from "../../Variables/Variables";
import { EvilIcons } from "@expo/vector-icons";
export const Login = ({ navigation }) => {
  const [cleanerDetails, setCleanerDetails] = React.useState({
    mobileNo: "",
    password: "",
  });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const onSubmitHandler = () => {
    setloading(true);
    fetch(`${baseUrl}cleaners/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobileNo: cleanerDetails.mobileNo,
        password: cleanerDetails.password,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.cleaner !== undefined) {
          setloading(false);
          dispatch(addCleaner(resp.cleaner));
          navigation.navigate("dashboard");
        }
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
        setError(true);
      });

    // navigation.navigate("dashboard");
    //  dispatch(addCleaner("hello"));
    //TODO:should remove above line
  };
  return (
    <View style={styles.mainScreen}>
      <View style={styles.LogoContainer}>
        <Image style={styles.logo} source={logo}></Image>
        <Text style={styles.headerText}>Dhullo Car Care</Text>
      </View>

      <View>
        <TextInput
          maxLength={10}
          style={styles.input}
          label="Mobile"
          keyboardType="number-pad"
          value={cleanerDetails.mobileNo}
          onChangeText={(text) =>
            setCleanerDetails({ ...cleanerDetails, mobileNo: text })
          }
          mode="outlined"
        />
        <TextInput
          mode="outlined"
          secureTextEntry
          style={styles.input}
          label="Password"
          type="password"
          value={cleanerDetails.password}
          onChangeText={(text) =>
            setCleanerDetails({ ...cleanerDetails, password: text })
          }
        />
        {error ? <Text>Invalid Credentials</Text> : null}

        <Button
          icon={() =>
            loading ? (
              <EvilIcons name="spinner" size={20} color="white" />
            ) : (
              <EvilIcons name="unlock" size={20} color="white" />
            )
          }
          onPress={() => onSubmitHandler()}
          style={styles.button}
          mode="contained"
        >
          LOGIN
        </Button>
        {
          loading ? <ActivityIndicator/> : null
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "column",
    height: "100%",
    marginTop: "50%",
  },
  headerText: {
    display: "flex",
    fontSize: 10,
  },
  input: {
    height: 50,
    width: 250,
    marginTop: 40,
    borderRadius: 0,
  },
  button: {
    marginTop: 40,
    backgroundColor: "#03588C",
    borderRadius: 0,
    paddingTop: 5,
    paddingBottom: 5,
  },
  logo: {
    height: 50,
    width: 100,
  },
  LogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "40%",
    padding: 30,
    // borderWidth: 2,
    // borderColor: 'grey',
    // borderRadius:5
  },
});
