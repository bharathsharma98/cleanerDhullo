import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { baseUrl } from "../../Variables/Variables";
import { useDispatch } from "react-redux";
import { addCleaner, addJobs } from "../../Redux/Actions/CleanerActions";
import logo from "../../assets/logo.png";
export const Login = ({ navigation }) => {
  const [cleanerDetails, setCleanerDetails] = React.useState({
    mobileNo: "",
    password: "",
  });
  const [error, setError] = React.useState(false);

  const dispatch = useDispatch();
  const onSubmitHandler = () => {
    console.log(cleanerDetails, "send to ", baseUrl);
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
          fetch(`${baseUrl}scheduledJobs/cleaners/${resp.cleaner.id}`)
            .then((respo) => respo.json())
            .then((res) => {
              dispatch(addCleaner(resp.cleaner));
              dispatch(addJobs(res.scheduledJobs));
              navigation.navigate("dashboard");
            });

          
        }
      })
      .catch((err) => {
        
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
          onPress={() => onSubmitHandler()}
          style={styles.button}
          mode="contained"
        >
          LOGIN
        </Button>
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
