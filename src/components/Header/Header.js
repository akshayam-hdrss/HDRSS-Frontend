import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import * as Font from "expo-font";

export default function Header({ toggleSidebar }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { width } = useWindowDimensions();

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

  

  return (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      {/* Menu - left side */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuWrapper}>
        <Text style={[styles.menuIcon, isTablet && styles.menuIconTablet]}>
          ☰
        </Text>
      </TouchableOpacity>

      {/* Center - PARTNER title + small tagline */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.partnerTitle, isTablet && styles.partnerTitleTablet]}
        >
          PARTNER
        </Text>
        <Text
          style={[styles.tagline, isTablet && styles.taglineTablet]}
        >
          access to success...
        </Text>
      </View>

      {/* Right side spacer - keeps title centered */}
      <View style={styles.menuWrapper} />
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
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  menuIcon: {
    fontSize: 27,
    color: "white",
    marginTop: 20,
    marginLeft: 9, // Changed from 4 to 0
  },

  menuIconTablet: {
    fontSize: 34,
  },

  /* TITLE (CENTER) */
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -5, // Added to pull title slightly left (closer to menu)
  },

  partnerTitle: {
    color: "white",
    fontSize: 33,
    fontFamily: "Impact",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 25,
  },

  partnerTitleTablet: {
    fontSize: 42,
  },

  /* Tagline sits under the second half of PARTNER (roughly E-R), not full width */
  tagline: {
    color: "#000",
    fontSize: 5,
    fontStyle: "italic",
    marginTop: -7,
    alignSelf: "center",
    marginLeft: 100, // Reduced from 60
  },

  taglineTablet: {
    fontSize: 13,
    marginTop: 4,
    marginLeft: 70, // Reduced from 90
  },
});