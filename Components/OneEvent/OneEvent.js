import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function OneEvent(props, {navigation}) {
 
  

    const NavigationHandler = (selectedData) => {
      console.log(selectedData , "selected data")
    navigation.navigate("manage", { selectedData });
    }
    return (
      <TouchableOpacity
        onPress={() => NavigationHandler(props.job)}
        style={{ backgroundColor: "green", marginBottom: 2 }}
      >
        <Text>{props.job?.service}</Text>
        <Text>{props.job?.serviceSurface}</Text>
        <Text>{props.job?.serviceType}</Text>
      </TouchableOpacity>
    );
}
