import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
function CustomButton({
  onPressTouch,
  title,
  icon,
  style,
  leftIcon,
  textStyle,
  isLoading = false,
  color,
  value,
}: CustomButtonProps) {
  return (
    // <TouchableOpacity style={[style === 'oauth' ? styles.oauthBtnStyles :  styles.customBtnStyles, {backgroundColor : color}]} onPress={onPressTouch}>
    //   <View>
    //     {isLoading ? (
    //       <ActivityIndicator size={"small"} color={"white"} />
    //     ) : (
    //       <View style={[style === 'oauth' ? styles.oauthBtnWrapper : ""]}>
    //         {leftIcon ? <Feather style={[style === 'oauth' ? styles.btnAuthIcon : ""]} name="user-x" size={14} color="#fff" /> : (<></>)}
    //         <Text style={[style === 'oauth' ? styles.oauthBtnText : styles.customBtnText, {color : textStyle}]}>{title}</Text>
    //       </View>
    //     )}
    //   </View>
    // </TouchableOpacity>

      <TouchableOpacity style={[style === 'big-filled' ? styles.oauthBtnStyles :  styles.customBtnStyles, {backgroundColor : color}]} onPress={onPressTouch}>
      <View>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"white"} />
        ) : (
          <View style={[style === 'big-filled' ? styles.oauthBtnWrapper : ""]}>
            {leftIcon ? icon : (<></>)}
            <Text style={[style === 'big-filled' ? styles.oauthBtnText : styles.customBtnText, {color : textStyle}]}>{title}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default CustomButton;

let styles = StyleSheet.create({
  customBtnStyles: {
    width: 140,
    height: 45,
    justifyContent : "center",
    alignItems : "center",
    borderRadius : 4,
  },
  customBtnText : {
        color : '#fff',
    fontWeight : 'bold',
    fontSize : 16
  },
  oauthBtnText : {
        color : '#fff',
    fontWeight : 'bold',
    fontSize : 14
  },
  oauthBtnStyles : {
    width: 'auto',
    marginLeft : 20,
    marginRight : 20,
    marginBottom : 20,
    height: 50,
    justifyContent : "center",
    alignItems : "center",
    borderRadius : 4,
  }, 
  oauthBtnWrapper: {
    width: "100%",
    height : '100%',
    flexDirection: "row",
    alignItems : "center",
  },
  btnAuthIcon : {
    marginHorizontal : 8
  }
});
