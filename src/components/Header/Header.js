import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ toggleSidebar }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isTablet = width >= 600;

  // Load fonts
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Impact: require("../../../assets/fonts/impact.ttf"),
        TitanOne: require("../../../assets/fonts/TitanOne-Regular.ttf"),
      });
      setFontLoaded(true);
    })();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "white" }}>Loading fonts...</Text>
      </View>
    );
  }

  // Debug: Check if toggleSidebar is a function
  console.log('toggleSidebar type:', typeof toggleSidebar);

  const handleMenuPress = () => {
    console.log('Menu pressed');
    if (toggleSidebar) {
      toggleSidebar();
    } else {
      console.warn('toggleSidebar prop is not provided or not a function');
    }
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    navigation.navigate("Profile");
  };

  return (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      {/* Menu - left side */}
      <TouchableOpacity 
        onPress={handleMenuPress} 
        style={styles.menuWrapper}
        activeOpacity={0.7}
      >
        <Text style={[styles.menuIcon, isTablet && styles.menuIconTablet]}>
          ☰
        </Text>
      </TouchableOpacity>

      {/* Center - PARTNER title + small tagline */}
      <View style={styles.titleContainer}>
        <Image
          source={require("../../../assets/Header/partner type.png")}
          style={[styles.partnerImage, isTablet && styles.partnerImageTablet]}
          resizeMode="contain"
        />
      </View>

      {/* Right side - Profile Icon */}
      <TouchableOpacity 
        onPress={handleProfilePress}
        style={styles.profileWrapper}
        activeOpacity={0.7}
      >
        <FontAwesome
          name="user-circle-o"
          size={isTablet ? 36 : 34}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#800000",
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#800000",
    paddingVertical: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 45,
  },

  headerTablet: {
    paddingVertical: 28,
    borderBottomLeftRadius: 75,
  },

  /* MENU */
  menuWrapper: {
    width: 50, // Increased width for better touch area
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 5, // Added padding for better touch
  },

  menuIcon: {
    fontSize: 35,
    color: "white",
    marginTop: 15,
    marginLeft: 5,
  },

  menuIconTablet: {
    fontSize: 40,
  },

  /* TITLE (CENTER) */
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -5,
  },

  /* Partner Image */
  partnerImage: {
    width: 200, // Adjusted for better display
    height: 65,
    marginTop: 25,
    marginLeft: 5,
  },

  partnerImageTablet: {
    width: 280,
    height: 60,
  },

  /* PROFILE ICON (RIGHT SIDE) */
  profileWrapper: {
    width: 50, // Increased width for better touch area
    marginTop: 25,
    marginLeft:5, // Added padding for better touch
  },
});