import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Loader from "../../../components/Alert/Loader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// 2 Default ad images
const DEFAULT_AD_IMAGES = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
];

const getDefaultAdImages = () => [...DEFAULT_AD_IMAGES];

export default function DistrictBusinessPage1() {
  const route = useRoute();
  const navigation = useNavigation();

  const { businessId, businessName, districtId = 16 } = route.params || {};

  const [businessList, setBusinessList] = useState([]);
  const [advertisementImages, setAdvertisementImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adLoading, setAdLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  
  const flatListRef = useRef(null);
  const scrollInterval = useRef(null);

  // Fetch Business List
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/business/district/${businessId}`;
        const res = await axios.get(url);

        if (res.data?.resultData && Array.isArray(res.data.resultData)) {
          const sortedBusiness = res.data.resultData.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
          );
          setBusinessList(sortedBusiness);
        } else {
          setBusinessList([]);
        }
      } catch (err) {
        console.log("❌ Error =", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  // Fetch Advertisement Images
  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/district-business-ads/filter?districtId=${districtId}&pageLevel=2&entityId=${businessId}`;

        const res = await axios.get(url);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const firstAd = res.data[0];
          if (firstAd.adImages && Array.isArray(firstAd.adImages) && firstAd.adImages.length > 0) {
            const validImages = firstAd.adImages.filter(img => img && img.trim() !== "");
            
            if (validImages.length > 0) {
              setAdvertisementImages(validImages);
            } else {
              setAdvertisementImages(getDefaultAdImages());
            }
          } else {
            setAdvertisementImages(getDefaultAdImages());
          }
        } else {
          setAdvertisementImages(getDefaultAdImages());
        }
      } catch (err) {
        console.log("❌ Error fetching advertisement:", err);
        setAdvertisementImages(getDefaultAdImages());
      } finally {
        setAdLoading(false);
      }
    };

    if (districtId && businessId) {
      fetchAdvertisement();
    } else {
      setAdvertisementImages(getDefaultAdImages());
      setAdLoading(false);
    }
  }, [districtId, businessId]);

  // Handle image load error
  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    
    if (advertisementImages[index]) {
      const newImages = [...advertisementImages];
      const defaultIndex = index % DEFAULT_AD_IMAGES.length;
      newImages[index] = DEFAULT_AD_IMAGES[defaultIndex];
      setAdvertisementImages(newImages);
    }
  };

  // Auto-scroll functionality for ads
  useEffect(() => {
    if (advertisementImages.length > 0 && flatListRef.current) {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }

      scrollInterval.current = setInterval(() => {
        setCurrentAdIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          if (nextIndex >= advertisementImages.length) {
            nextIndex = 0;
          }
          
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToOffset({
                offset: nextIndex * screenWidth,
                animated: true,
              });
            } catch (error) {
              console.log("Scroll error:", error);
            }
          }
          
          return nextIndex;
        });
      }, 3000);

      return () => {
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current);
        }
      };
    }
  }, [advertisementImages.length]);

  // Handle manual scroll
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    if (newIndex !== currentAdIndex) {
      setCurrentAdIndex(newIndex);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentAdIndex(newIndex);
  };

  // Render Advertisement Banner
  const renderAdvertisement = () => {
    if (adLoading) {
      return (
        <View style={[styles.adContainer, isTablet && styles.adContainerTablet]}>
          <ActivityIndicator size="small" color="#E37714" />
          <Text style={[styles.adLoadingText, isTablet && styles.adLoadingTextTablet]}>
            Loading Ads...
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.adContainer, isTablet && styles.adContainerTablet]}>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          data={advertisementImages}
          keyExtractor={(item, index) => `${index}-${item.substring(0, 20)}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.adItem, isTablet && styles.adItemTablet]}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item }}
                style={[styles.adImage, isTablet && styles.adImageTablet]}
                resizeMode="cover"
                onError={() => handleImageError(index)}
              />
            </TouchableOpacity>
          )}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          initialScrollIndex={0}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          decelerationRate="fast"
        />
      </View>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header - Fixed at top */}
      <View style={[styles.appBar, isTablet && styles.appBarTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
          {businessName} Business
        </Text>

        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      {/* ScrollView for content below header */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Advertisement Banner */}
        {renderAdvertisement()}

        {/* Business List */}
        <FlatList
          data={businessList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isTablet ? 3 : 2}
          contentContainerStyle={[
            styles.listContainer, 
            isTablet && styles.listContainerTablet,
            { paddingTop: advertisementImages.length > 0 ? 10 : 16 }
          ]}
          columnWrapperStyle={isTablet && styles.columnWrapper}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, isTablet && styles.cardTablet]}
              onPress={() =>
                navigation.navigate("DistrictBusinessPage2", {
                  businessId: item.id,
                  businessName: item.name,
                  districtId: districtId,
                })
              }
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri:
                    item.imageUrl?.trim() !== ""
                      ? item.imageUrl
                      : "https://via.placeholder.com/200x200?text=No+Image",
                }}
                style={[styles.image, isTablet && styles.imageTablet]}
                resizeMode="cover"
              />
              <Text style={[styles.name, isTablet && styles.nameTablet]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={60} color="#ccc" />
              <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
                No businesses found
              </Text>
            </View>
          }
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  // Header - Mobile (Fixed at top)
  appBar: {
    height: 90,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    justifyContent: "space-between",
    elevation: 6,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingBottom: 12,
  },
  appBarTablet: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 30,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  backButtonTablet: {
    padding: 10,
    borderRadius: 25,
  },

  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  appBarTitleTablet: {
    fontSize: 24,
  },

  // Advertisement Container
  adContainer: {
    backgroundColor: "#f5f5f5",
    height: 200,
    width: screenWidth,
    overflow: "hidden",
  },
  adContainerTablet: {
    height: 250,
  },

  adLoadingText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  adLoadingTextTablet: {
    fontSize: 14,
  },

  adItem: {
    width: screenWidth,
    height: 200,
  },
  adItemTablet: {
    height: 250,
  },

  adImage: {
    width: screenWidth,
    height: "100%",
  },
  adImageTablet: {
    width: screenWidth,
    height: "100%",
  },

  // List Container
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  listContainerTablet: {
    padding: 16,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // Card
  card: {
    width: "48%",
    backgroundColor: "#fff",
    margin: "1%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    width: "32%",
    padding: 16,
    borderRadius: 14,
    margin: "0.66%",
  },

  // Image
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  imageTablet: {
    height: 140,
    borderRadius: 10,
  },

  // Name
  name: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    color: "#222",
    paddingHorizontal: 4,
  },
  nameTablet: {
    fontSize: 18,
    marginTop: 12,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },
});