import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

export default function AboutPage1({ navigation }) {
  const handleEmailPress = () => Linking.openURL("mailto:hdrss.in@gmail.com");
  const handlePhonePress = () => Linking.openURL("tel:+919677717474");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, isTablet && styles.backButtonTablet]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
          </TouchableOpacity>

          {/* ===== HERO: single logo, shown once ===== */}
          <View style={[styles.heroSection, isTablet && styles.heroSectionTablet]}>
            <View style={[styles.logoRing, isTablet && styles.logoRingTablet]}>
              <Image
                source={require("../../../assets/hinduthua/ak technology logo.png")}
                style={[styles.logoImage, isTablet && styles.logoImageTablet]}
              />
            </View>

            <Text style={[styles.companyName, isTablet && styles.companyNameTablet]}>
              AK TECHNOLOGIES
            </Text>
          </View>

          {/* ===== ABOUT ===== */}
          <View style={[styles.aboutContainer, isTablet && styles.aboutContainerTablet]}>
            <Text style={[styles.aboutTitle, isTablet && styles.aboutTitleTablet]}>
              ABOUT
            </Text>
            <Text style={[styles.aboutText, isTablet && styles.aboutTextTablet]}>
              A smart platform designed to promote and enhance local businesses,
              sales, and tourism across different districts. It connects local
              businesses, tourist destinations, hotels, restaurants, shops,
              service providers, and visitors in one place.
            </Text>
            <Text style={[styles.aboutText, isTablet && styles.aboutTextTablet, { marginTop: 12 }]}>
              The platform helps businesses increase their visibility, customer
              reach, and sales by promoting their products and services to
              tourists and local customers. It also helps visitors discover
              popular tourist attractions, local businesses, restaurants,
              accommodations, shopping areas, and essential services within
              each district.
            </Text>
          </View>

          {/* ===== CONTACT INFORMATION ===== */}
          <View style={[styles.contactContainer, isTablet && styles.contactContainerTablet]}>
            <View style={styles.contactHeaderRow}>
              <View style={styles.contactHeaderLine} />
              <Text style={[styles.contactTitle, isTablet && styles.contactTitleTablet]}>
                CONTACT INFORMATION
              </Text>
              <View style={styles.contactHeaderLine} />
            </View>

            {/* Phone */}
            <TouchableOpacity
              onPress={handlePhonePress}
              style={[styles.contactRow, isTablet && styles.contactRowTablet]}
              activeOpacity={0.7}
            >
              <View style={styles.contactIconWrapper}>
                <Ionicons name="call" size={isTablet ? 20 : 17} color="#93210A" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                  Phone
                </Text>
                <Text style={[styles.contactInfo, isTablet && styles.contactInfoTablet]}>
                  +91 9677717474
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={isTablet ? 18 : 15}
                color="#D9C3B4"
              />
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              onPress={handleEmailPress}
              style={[styles.contactRow, isTablet && styles.contactRowTablet]}
              activeOpacity={0.7}
            >
              <View style={styles.contactIconWrapper}>
                <Ionicons name="mail" size={isTablet ? 20 : 17} color="#93210A" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                  Email
                </Text>
                <Text style={[styles.contactInfo, isTablet && styles.contactInfoTablet]}>
                  hdrss.in@gmail.com
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={isTablet ? 18 : 15}
                color="#D9C3B4"
              />
            </TouchableOpacity>

            {/* Address */}
            <View style={[styles.contactRow, isTablet && styles.contactRowTablet, styles.addressRow]}>
              <View style={styles.contactIconWrapper}>
                <Ionicons name="location" size={isTablet ? 20 : 17} color="#93210A" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                  Address
                </Text>
                <Text
                  style={[
                    styles.contactInfo,
                    isTablet && styles.contactInfoTablet,
                    styles.addressText,
                  ]}
                >
                 Sunrise Crystal Complex, Thadagam Main Rd, Kalappa Naicken Palayam,Coimbatore -641108
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FBEEDB",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 40,
  },

  // ============ BACK BUTTON ============
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 6,
  },
  backButtonTablet: {
    top: Platform.OS === "ios" ? 50 : 40,
    left: 30,
    padding: 8,
  },

  // ============ HERO / LOGO ============
  heroSection: {
    width: "100%",
    backgroundColor: "#93210A",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroSectionTablet: {
    paddingTop: 75,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logoRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#D4AF37",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoRingTablet: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 4,
  },
  logoImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    resizeMode: "contain",
  },
  logoImageTablet: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  companyName: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#D4AF37",
    textAlign: "center",
  },
  companyNameTablet: {
    fontSize: 22,
    marginTop: 20,
  },

  // ============ ABOUT SECTION ============
  aboutContainer: {
    marginTop: 26,
    paddingHorizontal: 22,
    width: "100%",
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#93210A",
    letterSpacing: 1,
  },
  aboutText: {
    fontSize: 14,
    color: "#444",
    textAlign: "justify",
    lineHeight: 22,
  },
  aboutContainerTablet: {
    marginTop: 34,
    paddingHorizontal: 50,
  },
  aboutTitleTablet: {
    fontSize: 19,
    marginBottom: 15,
  },
  aboutTextTablet: {
    fontSize: 17,
    lineHeight: 27,
  },

  // ============ CONTACT SECTION ============
  contactContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 22,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignSelf: "center",
    maxWidth: 500,
  },
  contactHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  contactHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#EBD9CC",
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#93210A",
    letterSpacing: 1.2,
    textAlign: "center",
    marginHorizontal: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FBF6F0",
    marginBottom: 10,
  },
  contactIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#F0E1D4",
  },
  contactTextGroup: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B98A6F",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E2A28",
    lineHeight: 25,
  },
  addressRow: {
    alignItems: "flex-start",
    marginBottom: 0,
  },
  addressText: {
    flexShrink: 1,
  },
  contactContainerTablet: {
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 22,
    maxWidth: 600,
  },
  contactTitleTablet: {
    fontSize: 18,
  },
  contactRowTablet: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderRadius: 14,
  },
  contactLabelTablet: {
    fontSize: 12,
  },
  contactInfoTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
});