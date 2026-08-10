import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Loader from "../../../components/Alert/Loader";

const APP_COLOR = "#93210A";
const GOLD = "#D4AF37";
const PARCHMENT = "#FBEEDB";
const CARD_BG = "#FFFDF6";
const DARK_BROWN = "#301913";

// API Configuration - Update this to your actual server IP
// For local development, use your computer's IP address
// For production, use your deployed API URL
const API_BASE_URL = "https://hdrss-backend.onrender.com"; // Using your backend URL
// const API_BASE_URL = "http://192.168.1.17:5000"; // Your local IP - update this

const FILTER_OPTIONS = {
  gender: ["Male", "Female"],
  ageRange: [
    { label: "18-25", min: 18, max: 25 },
    { label: "26-30", min: 26, max: 30 },
    { label: "31-35", min: 31, max: 35 },
    { label: "36-40", min: 36, max: 40 },
    { label: "41+", min: 41, max: 200 },
  ],
  religion: ["Hindu", "Christian", "Muslim", "Sikh", "Other"],
  caste: [
    "Iyer", "Iyengar", "Mudaliar", "Naidu", "Nadar", "Vanniyar",
    "Gounder", "Chettiar", "Pillai", "Reddiar", "Yadava",
    "Adi Dravidar", "Other",
  ],
  profession: [
    "IT / Software", "Government Employee", "Business / Self-Employed",
    "Doctor / Medical", "Teacher / Education", "Engineer", "Other",
  ],
  district: [
    "Coimbatore", "Chennai", "Madurai", "Salem", "Trichy",
    "Tirunelveli", "Erode", "Vellore", "Other",
  ],
};

const FILTER_SECTIONS = [
  { key: "gender", label: "Gender" },
  { key: "ageRange", label: "Age Range" },
  { key: "religion", label: "Religion" },
  { key: "caste", label: "Caste / Community" },
  { key: "profession", label: "Profession" },
  { key: "district", label: "District" },
];

const EMPTY_FILTERS = {
  gender: [],
  ageRange: [],
  religion: [],
  caste: [],
  profession: [],
  district: [],
};

// Sample data for testing when API is not available
const SAMPLE_PROFILES = [
  {
    id: 1,
    name: "Arun Kumar",
    age: 28,
    gender: "Male",
    religion: "Hindu",
    caste: "Iyer",
    profession: "IT / Software",
    district: "Chennai",
    imageUrl: "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Arun",
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 25,
    gender: "Female",
    religion: "Hindu",
    caste: "Iyengar",
    profession: "Doctor / Medical",
    district: "Coimbatore",
    imageUrl: "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Priya",
  },
  {
    id: 3,
    name: "Suresh Raj",
    age: 32,
    gender: "Male",
    religion: "Christian",
    caste: "Other",
    profession: "Business / Self-Employed",
    district: "Madurai",
    imageUrl: "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Suresh",
  },
  {
    id: 4,
    name: "Lakshmi Narayanan",
    age: 29,
    gender: "Female",
    religion: "Hindu",
    caste: "Mudaliar",
    profession: "Teacher / Education",
    district: "Trichy",
    imageUrl: "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Lakshmi",
  },
  {
    id: 5,
    name: "Ravi Varma",
    age: 35,
    gender: "Male",
    religion: "Muslim",
    caste: "Other",
    profession: "Engineer",
    district: "Salem",
    imageUrl: "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Ravi",
  },
];

const MatrimonyProfiles = () => {
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [expandedSection, setExpandedSection] = useState("gender");
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
      return () => {};
    }, [])
  );

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setNetworkError(false);
      
      // Try to fetch from API
      const response = await axios.get(`${API_BASE_URL}/api/matrimony`);
      
      if (response.data && response.data.success) {
        setProfiles(response.data.data || []);
        console.log("Profiles fetched from API:", response.data.data?.length || 0);
      } else {
        // If API returns but no data, use sample data
        console.log("No data from API, using sample data");
        setProfiles(SAMPLE_PROFILES);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error.message);
      setNetworkError(true);
      
      // Use sample data as fallback
      Alert.alert(
        "Network Error",
        "Unable to connect to server. Showing sample profiles.",
        [{ text: "OK" }]
      );
      setProfiles(SAMPLE_PROFILES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  const handleProfilePress = (profile) => {
    navigation.navigate("MatrimoneyProfiledetails", { profileId: profile.id });
  };

  const openFilterModal = () => {
    setDraftFilters(filters);
    setFilterModalVisible(true);
  };

  const toggleOption = (categoryKey, value) => {
    setDraftFilters((prev) => {
      const current = prev[categoryKey] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [categoryKey]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const isSelected = (categoryKey, value) =>
    (draftFilters[categoryKey] || []).includes(value);

  const clearDraft = () => setDraftFilters(EMPTY_FILTERS);

  const applyFilters = () => {
    setFilters(draftFilters);
    setFilterModalVisible(false);
  };

  const draftActiveCount = Object.values(draftFilters).reduce(
    (sum, arr) => sum + (arr ? arr.length : 0),
    0
  );

  const filteredProfiles = useMemo(() => {
    if (!profiles || profiles.length === 0) return [];
    
    return profiles.filter((item) => {
      if (filters.gender.length && !filters.gender.includes(item.gender)) return false;
      if (filters.religion.length && !filters.religion.includes(item.religion)) return false;
      if (filters.caste.length && !filters.caste.includes(item.caste)) return false;
      if (filters.profession.length && !filters.profession.includes(item.profession)) return false;
      if (filters.district.length && !filters.district.includes(item.district)) return false;

      if (filters.ageRange.length) {
        const age = Number(item.age);
        const matchesAnyRange = filters.ageRange.some((label) => {
          const rangeDef = FILTER_OPTIONS.ageRange.find((r) => r.label === label);
          return rangeDef && age >= rangeDef.min && age <= rangeDef.max;
        });
        if (!matchesAnyRange) return false;
      }
      return true;
    });
  }, [profiles, filters]);

  const activeFilterCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const renderChips = (categoryKey) => {
    const options = FILTER_OPTIONS[categoryKey];

    if (categoryKey === "ageRange") {
      return (
        <View style={styles.chipsWrap}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.chip, isSelected("ageRange", opt.label) && styles.chipActive]}
              onPress={() => toggleOption("ageRange", opt.label)}
            >
              <Text style={[styles.chipText, isSelected("ageRange", opt.label) && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.chipsWrap}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, isSelected(categoryKey, opt) && styles.chipActive]}
            onPress={() => toggleOption(categoryKey, opt)}
          >
            <Text style={[styles.chipText, isSelected(categoryKey, opt) && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderProfileCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleProfilePress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/120x120/8B1A1A/FFFFFF?text=Profile" }}
          style={styles.profileImage}
          onError={() => console.log("Image load error for:", item.name)}
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.profileName}>{item.name || "Unknown"}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{item.age || "N/A"} years</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Religion:</Text>
          <Text style={styles.infoValue}>{item.religion || "Not specified"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Caste:</Text>
          <Text style={styles.infoValue}>{item.caste || "Not specified"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Profession:</Text>
          <Text style={styles.infoValue}>{item.profession || "Not specified"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>District:</Text>
          <Text style={styles.infoValue}>{item.district || "Not specified"}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleProfilePress(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
     <Loader/>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backCircle}>
              <Text style={styles.backButtonText}>‹</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Matrimony Profiles</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {filteredProfiles.length} of {profiles.length} Profiles
            {networkError && " (Offline Mode)"}
          </Text>
        </View>

        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
            <Text style={styles.filterButtonText}>
              ⚙ Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
            </Text>
          </TouchableOpacity>
          {activeFilterCount > 0 && (
            <TouchableOpacity onPress={() => setFilters(EMPTY_FILTERS)}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredProfiles}
          renderItem={renderProfileCard}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[APP_COLOR]}
              tintColor={APP_COLOR}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
             
              <Text style={styles.emptyText}>
                {profiles.length === 0
                  ? "No profiles available yet"
                  : "No profiles match your filters"}
              </Text>
              {profiles.length === 0 && (
                <TouchableOpacity style={styles.retryButton} onPress={fetchProfiles}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetHeaderTitle}>Filter Profiles</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sheetHeaderLine} />

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {FILTER_SECTIONS.map((section) => {
                  const isOpen = expandedSection === section.key;
                  const count = (draftFilters[section.key] || []).length;
                  return (
                    <View key={section.key} style={styles.section}>
                      <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setExpandedSection(isOpen ? null : section.key)}
                      >
                        <Text style={styles.sectionTitle}>
                          {section.label}
                          {count > 0 ? `  (${count})` : ""}
                        </Text>
                        <Text style={styles.sectionArrow}>{isOpen ? "▲" : "▼"}</Text>
                      </TouchableOpacity>
                      {isOpen && renderChips(section.key)}
                    </View>
                  );
                })}
                <View style={{ height: 20 }} />
              </ScrollView>

              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.clearButton} onPress={clearDraft}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>
                    Apply {draftActiveCount > 0 ? `(${draftActiveCount})` : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MatrimonyProfiles;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PARCHMENT,
  },
  
  container: {
    flex: 1,
    backgroundColor: PARCHMENT,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PARCHMENT,
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: DARK_BROWN,
  },
  
  header: {
    backgroundColor: APP_COLOR,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  
  backButton: {
    padding: 4,
  },
  
  backCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  
  backButtonText: {
    fontSize: 30,
    color: "#FFFDF6",
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -2,
  },
  
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFDF6",
    textAlign: "center",
    flex: 1,
    marginLeft: 4,
  },
  
  headerRight: {
    width: 48,
  },
  
  statsBar: {
    backgroundColor: "rgba(147, 33, 10, 0.08)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  
  statsText: {
    fontSize: 13,
    color: APP_COLOR,
    fontWeight: "600",
  },
  
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  
  filterButton: {
    backgroundColor: APP_COLOR,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: GOLD,
  },
  
  filterButtonText: {
    color: "#FFFDF6",
    fontWeight: "bold",
    fontSize: 13,
  },
  
  resetText: {
    color: APP_COLOR,
    fontSize: 13,
    fontWeight: "600",
    padding: 8,
  },
  
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: PARCHMENT,
  },
  
  profileImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  
  cardContent: {
    flex: 1,
    padding: 12,
  },
  
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: DARK_BROWN,
    marginBottom: 8,
  },
  
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  
  infoLabel: {
    fontSize: 13,
    color: "#666",
    width: 75,
    fontWeight: "500",
  },
  
  infoValue: {
    fontSize: 13,
    color: DARK_BROWN,
    flex: 1,
  },
  
  viewButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GOLD,
  },
  
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  
  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  
  retryButton: {
    marginTop: 16,
    backgroundColor: APP_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  
  retryButtonText: {
    color: "#FFFDF6",
    fontWeight: "bold",
    fontSize: 14,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(48,25,19,0.5)",
    justifyContent: "flex-end",
  },
  
  sheet: {
    backgroundColor: PARCHMENT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingTop: 18,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
  },
  
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  
  sheetHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: APP_COLOR,
  },
  
  closeIcon: {
    fontSize: 20,
    color: DARK_BROWN,
    padding: 4,
    fontWeight: "bold",
  },
  
  sheetHeaderLine: {
    height: 1,
    backgroundColor: "rgba(212,175,55,0.4)",
    marginTop: 14,
  },
  
  sheetBody: {
    paddingHorizontal: 20,
  },
  
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.25)",
    paddingVertical: 14,
  },
  
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: DARK_BROWN,
  },
  
  sectionArrow: {
    fontSize: 12,
    color: APP_COLOR,
  },
  
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  
  chip: {
    borderWidth: 1.5,
    borderColor: APP_COLOR,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: CARD_BG,
  },
  
  chipActive: {
    backgroundColor: APP_COLOR,
  },
  
  chipText: {
    fontSize: 13,
    color: APP_COLOR,
    fontWeight: "600",
  },
  
  chipTextActive: {
    color: "#FFFDF6",
  },
  
  sheetFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(212,175,55,0.3)",
    backgroundColor: PARCHMENT,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  clearButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: APP_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 8,
  },
  
  clearButtonText: {
    color: APP_COLOR,
    fontWeight: "bold",
    fontSize: 14,
  },
  
  applyButton: {
    flex: 1,
    backgroundColor: APP_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: GOLD,
  },
  
  applyButtonText: {
    color: "#FFFDF6",
    fontWeight: "bold",
    fontSize: 14,
  },
});