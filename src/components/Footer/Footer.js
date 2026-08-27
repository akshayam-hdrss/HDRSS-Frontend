import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SOCIAL_LINKS = [
  { id: "youtube",   icon: "logo-youtube",   url: "https://www.youtube.com/@Partner-z6k" },
  { id: "instagram", icon: "logo-instagram", url: "https://www.instagram.com/partner12398/" },
  { id: "facebook",  icon: "logo-facebook",  url: "https://www.facebook.com/me/" },
  { id: "linkedin",  icon: "logo-linkedin",  url: "https://www.linkedin.com/in/partner-team-8044a6431" },
];

export default function Footer() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const iconSize = isTablet ? 34 : 30;

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.footerSafe}>
      <View style={[styles.navBar, isTablet && styles.navBarTablet]}>

        {/* 🏠 Home */}
        <TouchableOpacity onPress={() => navigation.navigate("HomePage")}>
          <FontAwesome name="home" size={isTablet ? 38 : 35} color="#fff" />
        </TouchableOpacity>

        {/* 🌐 Social Media Icons */}
        {SOCIAL_LINKS.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => openLink(item.url)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon} size={iconSize} color="#fff" />
          </TouchableOpacity>
        ))}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerSafe: {
    backgroundColor: "#800000",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  navBarTablet: {
    paddingVertical: 20,
  },
});
