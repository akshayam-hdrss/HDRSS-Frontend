import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const RootPage = () => {
  const navigation = useNavigation();
  
  // Animation value for rotation - COMMENTED OUT
  // const rotateAnim = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   // Continuous rotation animation
  //   Animated.loop(
  //     Animated.timing(rotateAnim, {
  //       toValue: 1,
  //       duration: 8000, // 8 seconds for one full rotation
  //       useNativeDriver: true,
  //     })
  //   ).start();
  // }, []);

  // // Interpolate rotation value to degrees - COMMENTED OUT
  // const spin = rotateAnim.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "360deg"],
  // });

  const logoSize = width > 600 ? 220 : 300;
  const logoSize1 = height > 600 ? 220 : 160; // Tablet responsive

  return (
    <LinearGradient
      colors={["#8B0000", "#a32311", "#c0392b"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Logo Section - Rotation Removed */}
        <View style={styles.sunWrapper}>
          <Image
            source={require("../../../assets/Header/partner type.png")}
            style={[
              {
                width: logoSize,
                height: logoSize1,
                // transform: [{ rotate: spin }], // Rotation removed
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        {/* <Text style={styles.title}>Welcome to</Text> */}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RootPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Changed from "center" to "flex-start"
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Add top padding for status bar
  },

  sunWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.05, // Add some margin from top (5% of screen height)
    marginBottom: 20, // Reduced from 40
  },

  title: {
    fontSize: 30,
    fontFamily: "Impact",
    fontWeight: "800",
    marginBottom: 40, // Reduced from 50
    color: "#fff",
    letterSpacing: 1,
  },
  
  buttonContainer: {
    width: "100%",
    marginTop: 10, // Add some space above buttons
  },

  loginButton: {
    width: "100%",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  signupButton: {
    width: "100%",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});