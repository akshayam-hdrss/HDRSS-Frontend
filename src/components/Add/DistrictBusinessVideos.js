// screens/DistrictBusinessVideos.js
//
// Sidebar entry point: "District Business Video"
// Flow: Search/select a district -> shows that district's business videos
//       (reuses your existing InterviewVideos.js exactly as-is, passing districtId).
//
// If a district has no videos (deleted / never uploaded), InterviewVideos already
// shows "No videos available" — nothing extra to do there.
//
// Adjust the import path below to wherever InterviewVideos.js actually lives.
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InterviewVideos from "./InterviewVideos"; // 👈 adjust path if needed

/* ─────────────────────────────────────────────────────────
   Tamil Nadu districts (32).
   ⚠️ Replace `id` values with the actual districtId your
   backend uses (the same id InterviewVideos expects), so
   the fetch to /district-business-videos/district/:id works.
   ───────────────────────────────────────────────────────── */
const DISTRICTS = [
  { id: 1, name: "Ariyalur" },
  { id: 2, name: "Chengalpattu" },
  { id: 3, name: "Chennai" },
  { id: 4, name: "Coimbatore" },
  { id: 5, name: "Cuddalore" },
  { id: 6, name: "Dharmapuri" },
  { id: 7, name: "Dindigul" },
  { id: 8, name: "Erode" },
  { id: 9, name: "Kallakurichi" },
  { id: 10, name: "Kancheepuram" },
  { id: 11, name: "Kanyakumari" },
  { id: 12, name: "Karur" },
  { id: 13, name: "Krishnagiri" },
  { id: 14, name: "Madurai" },
  { id: 15, name: "Mayiladuthurai" },
  { id: 16, name: "Nagapattinam" },
  { id: 17, name: "Namakkal" },
  { id: 18, name: "Nilgiris" },
  { id: 19, name: "Perambalur" },
  { id: 20, name: "Pudukkottai" },
  { id: 21, name: "Ramanathapuram" },
  { id: 22, name: "Ranipet" },
  { id: 23, name: "Salem" },
  { id: 24, name: "Sivagangai" },
  { id: 25, name: "Tenkasi" },
  { id: 26, name: "Thanjavur" },
  { id: 27, name: "Theni" },
  { id: 28, name: "Thoothukudi" },
  { id: 29, name: "Tiruchirappalli" },
  { id: 30, name: "Tirunelveli" },
  { id: 31, name: "Tirupathur" },
  { id: 32, name: "Tiruppur" },
  { id: 33, name: "Tiruvallur" },
  { id: 34, name: "Tiruvannamalai" },
  { id: 35, name: "Tiruvarur" },
  { id: 36, name: "Vellore" },
  { id: 37, name: "Viluppuram" },
  { id: 38, name: "Virudhunagar" },
];

/* ─── Top header bar (back arrow + title) ─── */
function TopHeader({ title, onBackPress }) {
  return (
    <View style={styles.topHeader}>
      <TouchableOpacity
        onPress={onBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.topHeaderTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

/* ─── A single district row ─── */
function DistrictRow({ item, onPress }) {
  const initial = item.name.charAt(0).toUpperCase();
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={styles.rowText}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#B0ABAB" />
    </TouchableOpacity>
  );
}

export default function DistrictBusinessVideos({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const filteredDistricts = useMemo(() => {
    if (!query.trim()) return DISTRICTS;
    const q = query.trim().toLowerCase();
    return DISTRICTS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const goBack = () => {
    // Navigates back to whatever screen opened this one.
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  /* ── District selected: show its business videos ── */
  if (selectedDistrict) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#93210A" />
        <View style={styles.detailHeader}>
          <TouchableOpacity
            onPress={() => setSelectedDistrict(null)}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            {selectedDistrict.name}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <InterviewVideos districtId={selectedDistrict.id} />
      </SafeAreaView>
    );
  }

  /* ── Default: header + searchable district list ── */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      <TopHeader title="District Business Video" onBackPress={goBack} />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#A69C9C" style={{ marginRight: 6 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search district..."
          placeholderTextColor="#A69C9C"
          style={styles.searchInput}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={18} color="#A69C9C" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredDistricts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DistrictRow item={item} onPress={setSelectedDistrict} />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={30} color="#C9A9A9" />
            <Text style={styles.emptyText}>No matching district</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#93210A",
    paddingTop: 55,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topHeaderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4EEEE",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#93210A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: "#2D2D2D",
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0E9E9",
    marginLeft: 64,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    marginTop: 8,
    color: "#A69C9C",
    fontSize: 15,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#93210A",
    paddingTop: 55,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    padding: 2,
  },
  detailTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
});