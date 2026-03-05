import NavigateNext from "@/assets/images/navigate-next.svg";
import { getValueFromKey } from "@/libs/global";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//? ICONS
import FaqsIcon from "@/assets/images/faqs.svg";
import InfoIcon from "@/assets/images/info.svg";
import Logout from "@/assets/images/logout.svg";
import PersonalIcon from "@/assets/images/person.svg";
import GeneralIcon from "@/assets/images/settings.svg";
import ThemeIcon from "@/assets/images/theme.svg";
import UserPolicyIcon from "@/assets/images/userpolicy.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export function SingleTile({
  title,
  icon,
  border = true,
  noIndicator = false,
  textColor = "#3C3A45",
}: {
  title: string;
  icon: string;
  border?: boolean;
  noIndicator?: boolean;
  textColor?: string;
}) {
  console.log(typeof NavigateNext);

  let ProfileIconsList = {
    personal: (
      <PersonalIcon
        width={18}
        height={18}
        style={profileStyles.singleTileIcons}
      />
    ),
    general: (
      <GeneralIcon
        width={18}
        height={18}
        style={profileStyles.singleTileIcons}
      />
    ),
    theme: (
      <ThemeIcon width={18} height={18} style={profileStyles.singleTileIcons} />
    ),
    faqs: (
      <FaqsIcon width={18} height={18} style={profileStyles.singleTileIcons} />
    ),
    userpolicy: (
      <UserPolicyIcon
        width={18}
        height={18}
        style={profileStyles.singleTileIcons}
      />
    ),
    help: (
      <InfoIcon width={18} height={18} style={profileStyles.singleTileIcons} />
    ),
    logout: (
      <Logout width={18} height={18} style={profileStyles.singleTileIcons} />
    ),
  };

  return (
    <TouchableOpacity
        onPress={()=> true}
      style={border ? profileStyles.singleTile : profileStyles.singleTileNB}
    >
      {getValueFromKey(ProfileIconsList, icon as any)}
      <Text style={[profileStyles.singleTileText, { color: textColor }]}>
        {title}
      </Text>
      {!noIndicator ? (
        <NavigateNext
          width={20}
          height={20}
          style={profileStyles.singleTileIndicator}
        />
      ) : (
        ""
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fefefe" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={profileStyles.blockHeading}>
          <Text style={profileStyles.blockHeadingText}>Preferences</Text>
        </View>
        <View style={profileStyles.preferences}>
          <SingleTile title={"Personal"} icon={"personal"} />
          <SingleTile title={"General"} icon={"general"} />
          <SingleTile title={"Theme"} icon={"theme"} border={false} />
        </View>
        <View style={profileStyles.blockHeading}>
          <Text style={profileStyles.blockHeadingText}>Support</Text>
        </View>
        <View style={profileStyles.supportBlock}>
          <SingleTile title={"FAQs"} icon={"faqs"} />
          <SingleTile title={"User Policy"} icon={"userpolicy"} />
          <SingleTile title={"Help"} icon={"help"} />
          <SingleTile
            title={"Log Out"}
            icon={"logout"}
            border={false}
            noIndicator={true}
            textColor="#FF5555"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  preferences: {
    width: "80%",
    height: "auto",
    paddingVertical: 16,
    backgroundColor: "#FBFCFB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth : 2,
    borderColor : "#d9d9d9"
},
supportBlock: {
    width: "80%",
    height: "auto",
    paddingVertical: 16,
    backgroundColor: "#FBFCFB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth : 2,
    borderColor : "#d9d9d9"
  },
  blockHeading: {
    width: "80%",
    height: "auto",
    marginTop : 20,
    marginBottom : 8
  },
  blockHeadingText: {
    fontWeight: "600",
    fontSize: 12,
    color : '#3C3A45'
  },
  singleTile: {
    width: "90%",
    height: 50,
    // borderRadius : 8,
    backgroundColor: "#FBFCFB",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 0,
    borderColor: "#d9d9d9",
    borderBottomWidth: 1,
  },
  singleTileNB: {
    width: "90%",
    height: 40,
    backgroundColor: "#FBFCFB",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 0,
    borderBottomWidth: 0,
  },
  singleTileText: {
    width: "80%",
    fontSize : 16,
    fontWeight : 300,
    marginLeft : 4
  },
  singleTileIcons: {
    width: "10%",
    marginHorizontal: 4,
  },
  singleTileIndicator: {
    width: "10%",
  },
});
