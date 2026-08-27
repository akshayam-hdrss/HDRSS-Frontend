import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { fetchHomeAds } from "../../Controller/AdvertisementController/AdvertisementController";
import { useNavigation } from "@react-navigation/native";

export default function AutoScrollAds() {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isTablet = width >= 600; // ✅ tablet detection

  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ads
  useEffect(() => {
    const getAds = async () => {
      const imageList = await fetchHomeAds();
      setAds(imageList);
      setLoading(false);
    };
    getAds();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, ads, width]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.adContainer,
        isTablet && styles.adContainerTablet,
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {ads.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={[
              styles.adImage,
              isTablet && styles.adImageTablet,
              { width: width },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  /* 📱 MOBILE STYLES */
  adContainer: {
    height: 340,
    marginVertical: 10,
  },
  
  adImage: {
    height: 223,
    width: '100%',
  },
  
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  
  /* 📲 TABLET STYLES */
  adContainerTablet: {
    height: 580,
    marginVertical: 20,
  },
  
  adImageTablet: {
    height: 480,
    width: '100%',
    borderRadius: 8,
  },
});