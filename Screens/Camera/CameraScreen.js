import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity ,Platform,TouchableWithoutFeedback} from 'react-native'
import { Camera } from "expo-camera";
import { Button } from 'react-native-paper';
import './Camera.styles'
import { Styles } from './Camera.styles';
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraScreen({navigation}) {
     const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

const cameraRef= useRef(null)

     useEffect(() => {
       (async () => {
         const { status } = await Camera.requestPermissionsAsync();
         setHasPermission(status === "granted");
       })();
     }, []);
     if (hasPermission === null) {
       return <View />;
     }
     if (hasPermission === false) {
       return <Text>No access to camera</Text>;
     }
 
    const snap = async () => {
      
      if (cameraRef) {
          let photo = await cameraRef.current.takePictureAsync();
          console.log(photo)
        if (photo.uri !== undefined) {
            console.log("before",photo)
           
            const compressedImage = await ImageManipulator.manipulateAsync(
              photo.uri,
              [{
                resize: {
                  width: photo.width * 0.5,
                height:photo.height*0.5}
              }],
              {compress:0.9,format:ImageManipulator.SaveFormat.JPEG}
          )
          await console.log("after",compressedImage)
          const jsonPhoto = await JSON.stringify(compressedImage);
          await AsyncStorage.setItem("localPhoto", jsonPhoto);
          navigation.navigate("manage", { myPhoto: photo });
              
        }
       
        }
       
    };
    
 
    return (
      <View>
        <Camera
          style={Styles.cameraContainer}
          ref={(cam) => (cameraRef.current = cam)}
          type={Camera.Constants.Type.back}
          autoFocus={"on"}
                ratio={"16:9"}
     
        />
        <View style={Styles.buttonContainer}>
                <Button
                    mode="contained"
                    style={Styles.button}
            onPress={()=>snap()}
            
          >
            
          </Button>
        </View>
      </View>
    );
}
