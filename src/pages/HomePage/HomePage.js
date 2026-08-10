import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Path } from "react-native-svg";

/* COMPONENTS  Home*/
import Advertisement from "../../components/Add/Advertisement";
import InterviewVideos from "../../components/Add/InterviewVideos";
import DistrictList from "../DistrictPage/DistrictPage1";
import EventsPage from "../../components/Events/EventPage1";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
/* DATA */
import { fetchNews } from "../../Controller/NewsController/NewsController";
import Loader from "../../components/Alert/Loader";
import CaucusVideo from "../../components/Add/CaucusVideo";
import ProductScreen1 from "../../pages/ProductItems/ProductScreen1";

/* ================= HELPER FUNCTIONS ================= */
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

/* ================= LOTUS ICON (vector, traced from the provided lotus artwork) ================= */
function LotusIcon({ size = 22, color = "#93210A" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 445.874739 371.485673">
      <G transform="translate(-34.128440,441.000000) scale(0.100000,-0.100000)" fill={color} stroke="none">
        <Path d="M2497 4341 c-305 -377 -441 -845 -397 -1361 36 -419 137 -776 296 -1043 39 -66 156 -227 164 -227 8 0 125 162 162 225 181 307 285 705 304 1169 17 389 -85 764 -293 1085 -60 92 -161 221 -173 221 -4 0 -33 -31 -63 -69z" />
        <Path d="M1283 3996 c62 -160 75 -268 87 -703 12 -438 24 -548 75 -700 118 -353 361 -626 715 -803 93 -46 226 -97 235 -89 2 3 -21 43 -52 89 -69 106 -181 333 -228 464 -125 347 -175 802 -130 1181 17 141 23 126 -98 247 -95 97 -202 180 -297 231 -114 62 -320 118 -307 83z" />
        <Path d="M3768 4000 c-172 -29 -365 -144 -536 -318 -119 -121 -113 -109 -97 -227 8 -56 15 -178 15 -280 0 -529 -132 -1022 -370 -1382 -32 -48 -56 -90 -54 -92 7 -8 142 43 234 89 354 177 597 450 715 803 50 150 62 262 74 682 11 376 23 507 60 636 10 35 22 72 26 82 8 19 6 19 -67 7z" />
        <Path d="M414 3320 c-104 -19 -109 -7 69 -195 302 -320 365 -406 515 -710 118 -239 179 -332 267 -413 144 -131 368 -219 613 -239 l77 -6 -87 63 c-284 203 -496 523 -577 866 -23 101 -41 279 -41 420 0 79 -3 92 -17 97 -145 42 -300 81 -388 98 -124 22 -355 33 -431 19z" />
        <Path d="M4365 3315 c-120 -17 -244 -45 -387 -87 l-108 -31 0 -91 c-1 -296 -49 -522 -157 -741 -113 -227 -286 -428 -483 -561 -64 -44 -65 -44 -31 -44 75 0 252 33 351 66 133 44 221 97 308 182 88 87 138 164 267 412 171 329 224 401 553 748 l122 130 -47 12 c-72 19 -273 21 -388 5z" />
        <Path d="M765 2074 c-116 -41 -243 -86 -282 -100 l-73 -26 58 -47 c144 -120 321 -214 507 -271 56 -17 202 -50 223 -50 5 0 36 34 68 76 33 43 67 87 77 100 l18 23 -71 45 c-90 59 -197 166 -255 256 -25 38 -49 70 -53 69 -4 0 -101 -34 -217 -75z" />
        <Path d="M4078 2073 c-66 -100 -155 -188 -246 -248 l-72 -46 25 -32 c14 -18 47 -59 72 -92 25 -33 49 -64 53 -68 10 -12 195 28 297 64 112 40 226 97 328 164 86 57 173 130 165 138 -5 5 -555 197 -564 197 -3 0 -29 -35 -58 -77z" />
        <Path d="M1410 1638 c-134 -167 -231 -320 -269 -421 -28 -76 -27 -103 5 -123 53 -35 336 1 574 74 108 32 102 22 76 144 -22 104 -18 222 9 309 7 22 7 22 -90 39 -38 7 -104 23 -145 36 -41 13 -79 24 -85 23 -5 0 -39 -36 -75 -81z" />
        <Path d="M3545 1695 c-38 -13 -101 -29 -140 -35 -38 -7 -75 -13 -81 -15 -8 -2 -7 -21 2 -67 20 -92 17 -202 -6 -293 -11 -43 -20 -80 -20 -81 0 -8 210 -68 320 -91 159 -32 339 -38 367 -11 51 51 -61 268 -276 535 -36 46 -73 83 -81 82 -8 -1 -46 -11 -85 -24z" />
        <Path d="M2060 1630 l-125 -5 -12 -45 c-16 -64 -15 -205 2 -270 58 -220 256 -427 548 -571 l88 -44 87 45 c268 137 461 320 532 505 28 75 38 241 18 325 l-13 55 -125 5 c-112 5 -131 3 -180 -16 -114 -45 -189 -58 -325 -57 -133 1 -200 13 -320 59 -43 16 -68 18 -175 14z" />
      </G>
    </Svg>
  );
}

/* ================= WAVE DIVIDER (thin line, lotus perfectly centered) ================= */
function WaveDivider() {
  return (
    <View style={dividerStyles.container}>
      <View style={dividerStyles.line} />
      <View style={dividerStyles.lotusWrapper}>
        <LotusIcon size={22} color="#93210A" />
      </View>
      <View style={dividerStyles.line} />
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D4AF37",
  },
  lotusWrapper: {
    marginHorizontal: 10,
  },
});

/* ================= FEATURES ================= */
const FEATURES = [
  { id: 0,label: "பஞ்சாங்கம்", image: require("../../../assets/panchagam/panchagam.jpg") },
  { id: 1, label: "இந்துத்துவா", image: require("../../../assets/hinduthua/hindu.webp") },
  { id: 2, label: "வரலாறு", image: require("../../../assets/Left Swap/history2.png") },
  { id: 3, label: "ஜோதிடம்", image: require("../../../assets/Left Swap/astrology.jpg") },
  { id: 4, label: "கதைகள்", image: require("../../../assets/Left Swap/Story.jpg") },
  { id: 5, label: "பூஜை", image: require("../../../assets/Left Swap/poojai.jpg") },
  { id: 6, label: "யாத்திரை", image: require("../../../assets/Left Swap/tourism1.jpg") },
  { id: 7, label: "வாஸ்து", image: require("../../../assets/Left Swap/vasthu.jpeg") },
  { id: 8, label: "மந்திரம்", image: require("../../../assets/home-bg-img/ohm-img.png") },
  { id: 9, label: "பக்திப் பாடல்கள்", image: require("../../../assets/home-bg-img/ruthurasa-img.png") },
  { id: 10, label: "நூல்கள்", image: require("../../../assets/hinduthua/Noolgal.jpg") },
  // { id: 11, label: "மேட்ரிமோனி", image: require("../../../assets/hinduthua/matrimony.png") },
  // { id: 12, label: "குருகுலம்", image: require("../../../assets/Left Swap/gurukulam.png") }
];

const columns = 25; 
const size = 5;  

const BACKGROUNDS = [
  require("../../../assets/home-bg-img/header-img.png"),
  require("../../../assets/home-bg-img/ohm-img.png"),
  require("../../../assets/home-bg-img/ruthurasa-img.png"),
  require("../../../assets/home-bg-img/header-img.png"),
  require("../../../assets/home-bg-img/ohm-img.png"),
  require("../../../assets/home-bg-img/ruthurasa-img.png"),
];

/* ================= NEWS AUTO-SCROLL SETTINGS ================= */
const NEWS_CAROUSEL_LIMIT = 3;
const AUTO_SCROLL_INTERVAL = 3000; // ms

const GURUKULAM_HOME_CARD = {
  title: 'குருகுலம்',
  slogan: 'பாரம்பரிய குருகுல கல்வியை கற்றுக்கொள்ளுங்கள்',
  image: require('../../../assets/Left Swap/gurukulam.png'),
};

export default function HomePage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet, width);

  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📰 NEWS CAROUSEL STATE */
  const newsCarouselRef = useRef(null);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const CARD_WIDTH = width - (isTablet ? 40 : 30);

  /* 🗳 ELECTION BUTTON ANIMATION */
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useFocusEffect(
    React.useCallback(() => {
      slideAnim.setValue(-300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  /* 📰 FETCH ALL DATA SIMULTANEOUSLY */
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // Mock functions - replace with your actual API calls
        const fetchAds = async () => []; // Your actual fetch function
        const fetchDistricts = async () => []; // Your actual fetch function
        const fetchEvents = async () => []; // Your actual fetch function
        const fetchInterviews = async () => []; // Your actual fetch function

        const [
          newsRes,
          adsRes,
          districtRes,
          eventsRes,
          interviewRes,
        ] = await Promise.all([
          fetchNews(),
          fetchAds(),
          fetchDistricts(),
          fetchEvents(),
          fetchInterviews(),
        ]);

        // Sort news by orderNo
        const orderedNews = newsRes.sort((a, b) =>
          (a.orderNo ?? Infinity) - (b.orderNo ?? Infinity)
        );

        setNews(orderedNews);
        setAdsData(adsRes);
        setDistrictData(districtRes);
        setEventsData(eventsRes);
        setInterviewData(interviewRes);

      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  /* 📰 AUTO-SCROLL THE NEWS CAROUSEL */
  const carouselNews = news.slice(0, NEWS_CAROUSEL_LIMIT);

  useEffect(() => {
    if (carouselNews.length <= 1) return;

    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => {
        const next = (prev + 1) % carouselNews.length;
        newsCarouselRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [carouselNews.length]);

  const handleNewsMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveNewsIndex(index);
  };

  const getNewsItemLayout = (data, index) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  });

  // Show loader only during initial data fetch
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🏺 VINTAGE PARCHMENT BASE GRADIENT */}
      <LinearGradient
        colors={["#C9B96A", "#C9B96A", "#C9B96A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 🔥 Background Collage (sepia-tinted) */}
      <View style={styles.backgroundWrapper}>
        {[...Array(500)].map((_, index) => {
          const img = BACKGROUNDS[index % BACKGROUNDS.length];
          return (
            <Image
              key={index}
              source={img}
              style={[
                styles.backgroundImage,
                {
                  width: `${size}%`,
                  height: `${size}%`,
                  top: `${Math.floor(index / columns) * size}%`,
                  left: `${(index % columns) * size}%`,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.overlay}>
        {/* ✅ HEADER */}
        <Header toggleSidebar={() => setShowSidebar(!showSidebar)} />

        {/* ✅ LEFT SIDEBAR */}
        {showSidebar && (
          <View style={[styles.sidebarOverlay, isTablet && styles.sidebarOverlayTablet]}>
            <Sidebar closeSidebar={() => setShowSidebar(false)} isTablet={isTablet} />
          </View>
        )}

        <FlatList
          data={[]}
          keyExtractor={() => "home"}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* 🗳 Election Button */}
              <Animated.View
                style={[
                  styles.centerButtonContainer,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <TouchableOpacity
                  // onPress={() => navigation.navigate("Assemblies")}
                >
                  <LinearGradient
                    colors={["#FFD700", "#FF8C00", "#93210A"]}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.gradientButtonText}>
                      வாகை 2026...
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Advertisement Component */}
              <View style={styles.advertisementWrapper}>
                <Advertisement data={adsData} />
              </View>

              <CaucusVideo/>

              {/* District List */}
              <DistrictList data={districtData} />
            </>
          }
          ListFooterComponent={
            <>
              {interviewData.length > 0 && (
                <InterviewVideos data={interviewData} />
              )}

              {/* 📰 NEWS SECTION */}
              <View style={styles.newsHeaderContainer}>
                <View>
                  <Text style={styles.heading}>News</Text>
                </View>
                {news.length > 0 && (
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => navigation.navigate("NewsPage1")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>See All News</Text>
                    <Ionicons name="arrow-forward" size={14} color="#93210A" />
                  </TouchableOpacity>
                )}
              </View>

              {news.length === 0 ? (
                <Text style={styles.noDataText}>No news available</Text>
              ) : (
                <>
                  {/* 🔸 Auto-scrolling News Carousel (max 3 items) */}
                  <FlatList
                    ref={newsCarouselRef}
                    data={carouselNews}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleNewsMomentumScrollEnd}
                    getItemLayout={getNewsItemLayout}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{ width: CARD_WIDTH }}
                        onPress={() =>
                          navigation.navigate("Newspage2", { news: item })
                        }
                        activeOpacity={0.85}
                      >
                        <View style={styles.newsCard}>
                          <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.newsImageBg}
                            imageStyle={styles.newsImageBgRadius}
                          >
                            <LinearGradient
                              colors={["transparent", "rgba(43,10,5,0.55)", "rgba(30,7,4,0.92)"]}
                              locations={[0, 0.5, 1]}
                              style={styles.newsGradientOverlay}
                            >
                              {index === 0 && (
                                <View style={styles.topBadge}>
                                  <Ionicons name="flame" size={12} color="#3A0D07" />
                                  <Text style={styles.topBadgeText}>TOP</Text>
                                </View>
                              )}
                              <Text style={styles.newsTitle} numberOfLines={3}>
                                {item.title}
                              </Text>
                            </LinearGradient>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    )}
                  />

                  {/* 🔸 Dot Pagination */}
                  <View style={styles.dotsContainer}>
                    {carouselNews.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          activeNewsIndex === i && styles.dotActive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}

              <WaveDivider />

              {/* Events Page */}
              <EventsPage data={eventsData} />

              <WaveDivider />

              {/* ProductScreen1 */}
              <ProductScreen1 />
              <WaveDivider />

              {/* 🔵 EXPLORE MORE - FIXED TO LEFT ALIGN */}
              <View style={styles.circleMenuContainer}>
                <Text style={styles.heading}>Explore More</Text>

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollViewContent}
                >
                  {FEATURES.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        if (item.label === "வரலாறு") navigation.navigate("HistoryPage1");
                        if (item.label === "ஜோதிடம்") navigation.navigate("AstrologyPage1");
                        if (item.label === "கதைகள்") navigation.navigate("StoryPage1");
                        if (item.label === "பூஜை") navigation.navigate("PoojaPage1");
                        if (item.label === "யாத்திரை") navigation.navigate("TourismPage1");
                        if (item.label === "வாஸ்து") navigation.navigate("VaasthuPage");
                        if (item.label === "இந்துத்துவா") navigation.navigate("HinduThuvm");
                        if (item.label === "பஞ்சாங்கம்") navigation.navigate("Panchangam");
                        if (item.label === "மேட்ரிமோனி") navigation.navigate("matrimonyBtn");
                        if (item.label === "நூல்கள்") navigation.navigate("HinduNoolgal1" ,{ categoryTypes: 'நூல்கள்' });
                        if (item.label === "மந்திரம்") navigation.navigate("SloganPage1",{ name: item.label });
                        if (item.label === "பக்திப் பாடல்கள்") navigation.navigate("DivinePage1",{ name: item.label });
                        if (item.label === "குருகுலம்") navigation.navigate("GurukulamPage1",{name: item.label});
                      }}
                    >
                      <View style={styles.circleCardWrapper}>
                        <LinearGradient
                          colors={["#FFF8E7", "#FFD89B", "#FFB75E"]}
                          style={styles.circleGradient}
                        >
                          <Image source={item.image} style={styles.circleImage} />
                        </LinearGradient>
                        <Text style={styles.label}>{item.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <WaveDivider />

              {/* 💍 MATRIMONY SECTION */}
              <Text style={styles.heading}>Matrimony</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("matrimonyBtn")}
                activeOpacity={0.9}
                style={styles.matrimonyBannerWrapper}
              >
                <LinearGradient
                  colors={['#FFF3D9', '#F0CE8C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.matrimonyBanner}
                >
                  <View style={styles.matrimonyBannerLeft}>
                    <Text style={styles.matrimonyBannerSubtitle}>
                      Find Your Perfect Life Partner
                    </Text>

                    <View style={styles.matrimonyExploreButton}>
                      <Text style={styles.matrimonyExploreButtonText}>Explore Matrimony</Text>
                      <Ionicons name="arrow-forward" size={isTablet ? 18 : 14} color="#fff" />
                    </View>
                  </View>

                  <Image
                    source={require("../../../assets/hinduthua/matrimony.png")}
                    style={styles.matrimonyBannerImage}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <WaveDivider />

              {/* 🟠 GURUKULAM SECTION - resized to match Matrimony banner */}
              <Text style={styles.heading}>Gurukulam</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Gurukulamcategory")}
                style={styles.gurukulamBannerWrapper}
              >
                <LinearGradient
                  colors={["#8B1A1A", "#B33A1E", "#E07A2C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gurukulamBanner}
                >
                  {/* decorative circles */}
                  <View style={styles.gurukulamDecorCircle1} />
                  <View style={styles.gurukulamDecorCircle2} />

                  <View style={styles.gurukulamBannerLeft}>
                    <View style={styles.gurukulamBadge}>
                      <Text style={styles.gurukulamBadgeText}>✦ பாரம்பரிய கல்வி</Text>
                    </View>

                    <Text style={styles.gurukulamBannerTitle}>
                      {GURUKULAM_HOME_CARD.title}
                    </Text>

                    <View style={styles.gurukulamExploreButton}>
                      <Text style={styles.gurukulamExploreButtonText}>Explore Gurukulam</Text>
                      <Ionicons name="arrow-forward" size={isTablet ? 18 : 14} color="#8B1A1A" />
                    </View>
                  </View>

                  <Image
                    source={GURUKULAM_HOME_CARD.image}
                    style={styles.gurukulamBannerImage}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </>
          }
        />
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const getStyles = (isTablet, width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5E9D3",
    },

    sidebarOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "120%",
      height: "100%",
      zIndex: 999,
    },

    sidebarOverlayTablet: {
      left: -440,
      paddingHorizontal: -50,
    },

    backgroundWrapper: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
    },

    backgroundImage: {
      position: "absolute",
      opacity: 0.10,
      tintColor: "#8B5E34",
    },

    overlay: {
      flex: 1,
      backgroundColor: "rgba(250, 235, 200, 0.55)",
    },

    centerButtonContainer: {
      alignItems: "center",
      marginTop: isTablet ? 25 : 14,
    },

    gradientButton: {
      paddingVertical: isTablet ? 18 : 12,
      paddingHorizontal: isTablet ? 55 : 30,
      borderRadius: 10,
    },

    gradientButtonText: {
      color: "#fff",
      fontSize: isTablet ? 22 : 19,
      fontWeight: "900",
    },

    advertisementWrapper: {
      marginVertical: isTablet ? 25 : 15,
    },

    /* ================= NEWS SECTION STYLES ================= */
    newsHeaderContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginHorizontal: 15,
      marginTop: 10,
    },

    heading: {
      fontSize: isTablet ? 24 : 19,
      fontWeight: "bold",
      color: "#93210A",
      marginLeft: 15,
    },

    headingUnderline: {
      width: 34,
      height: 3,
      backgroundColor: "#93210A",
      borderRadius: 2,
      marginTop: 4,
    },

    seeAllBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },

    viewAllText: {
      fontSize: isTablet ? 15 : 12.5,
      fontWeight: "700",
      color: "#93210A",
    },

    noDataText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: isTablet ? 18 : 14,
      color: "#666",
    },

    newsCard: {
      marginHorizontal: isTablet ? 20 : 15,
      marginTop: isTablet ? 25 : 18,
      borderRadius: isTablet ? 18 : 16,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "#D4AF37",
      elevation: isTablet ? 8 : 6,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: isTablet ? 10 : 8,
      shadowOffset: { width: 0, height: isTablet ? 4 : 3 },
      backgroundColor: "#301913",
    },

    newsImageBg: {
      width: "100%",
      height: isTablet ? 350 : 200,
      justifyContent: "flex-end",
    },

    newsImageBgRadius: {
      borderRadius: isTablet ? 16 : 14,
    },

    newsGradientOverlay: {
      paddingHorizontal: isTablet ? 18 : 14,
      paddingVertical: isTablet ? 16 : 12,
      justifyContent: "flex-end",
    },

    topBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "#D4AF37",
      paddingHorizontal: isTablet ? 12 : 9,
      paddingVertical: isTablet ? 5 : 4,
      borderRadius: 20,
      marginBottom: isTablet ? 10 : 8,
      gap: 4,
    },

    topBadgeText: {
      fontSize: isTablet ? 12 : 10,
      color: "#3A0D07",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    newsTitle: {
      fontSize: isTablet ? 20 : 13,
      fontWeight: "bold",
      color: "#fff",
      lineHeight: isTablet ? 27 : 20,
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },

    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: isTablet ? 14 : 10,
      marginBottom: isTablet ? 10 : 6,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#D9C9A3",
      marginHorizontal: 4,
    },

    dotActive: {
      backgroundColor: "#93210A",
      width: 18,
    },

    /* ================= EXPLORE MORE ================= */
    circleMenuContainer: {
      marginVertical: 4,
      width: "100%",
    },

    scrollViewContent: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingVertical: 10,
    },

    circleCardWrapper: {
      alignItems: "center",
      marginHorizontal: isTablet ? 20 : 12,
    },

    circleGradient: {
      width: isTablet ? 230 : 120,
      height: isTablet ? 230 : 120,
      borderRadius: 120,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },

    circleImage: {
      width: isTablet ? 180 : 90,
      height: isTablet ? 180 : 90,
      borderRadius: 100,
    },

    label: {
      marginTop: 8,
      fontSize: isTablet ? 16 : 13,
      fontWeight: "600",
    },

    /* ================= MATRIMONY STYLES ================= */
    matrimonyBannerWrapper: {
      marginHorizontal: 15,
      marginTop: 22,
      marginBottom: 8,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "#B8860B",
      elevation: 4,
      shadowColor: "#301913",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    matrimonyBanner: {
      flexDirection: "row",
      alignItems: "center",
      padding: isTablet ? 22 : 14,
    },

    matrimonyBannerLeft: {
      flex: 1,
      paddingRight: 10,
    },

    matrimonyBannerSubtitle: {
      fontSize: isTablet ? 15 : 12,
      color: "#8B5E34",
      marginTop: 4,
      marginBottom: 12,
    },

    matrimonyExploreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      backgroundColor: "#6B0F1D",
      paddingVertical: isTablet ? 10 : 7,
      paddingHorizontal: isTablet ? 20 : 14,
      borderRadius: 22,
      gap: 6,
    },

    matrimonyExploreButtonText: {
      color: "#FFF3D9",
      fontSize: isTablet ? 14 : 12,
      fontWeight: "700",
    },

    matrimonyBannerImage: {
      width: isTablet ? 130 : 90,
      height: isTablet ? 130 : 90,
      borderRadius: 65,
    },

    /* ================= GURUKULAM STYLES (matched to Matrimony banner size) ================= */
    gurukulamBannerWrapper: {
      marginHorizontal: 15,
      marginTop: 14,
      marginBottom: 8,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "#7A1810",
      elevation: 4,
      shadowColor: "#301913",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    gurukulamBanner: {
      flexDirection: "row",
      alignItems: "center",
      padding: isTablet ? 22 : 14,
      overflow: "hidden",
    },

    gurukulamDecorCircle1: {
      position: "absolute",
      top: -30,
      right: -10,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "rgba(255,255,255,0.08)",
    },

    gurukulamDecorCircle2: {
      position: "absolute",
      bottom: -30,
      right: 60,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(255,255,255,0.06)",
    },

    gurukulamBannerLeft: {
      flex: 1,
      paddingRight: 10,
    },

    gurukulamBadge: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.35)",
      borderRadius: 20,
      paddingVertical: 2,
      paddingHorizontal: 8,
      marginBottom: 8,
    },

    gurukulamBadgeText: {
      fontSize: isTablet ? 11 : 9,
      color: "#FFE9C4",
      fontWeight: "700",
      letterSpacing: 0.3,
    },

    gurukulamBannerTitle: {
      fontSize: isTablet ? 15 : 12,
      fontWeight: "700",
      color: "#FFF3D9",
      marginBottom: 12,
    },

    gurukulamExploreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      backgroundColor: "#FFE9C4",
      paddingVertical: isTablet ? 10 : 7,
      paddingHorizontal: isTablet ? 20 : 14,
      borderRadius: 22,
      gap: 6,
    },

    gurukulamExploreButtonText: {
      color: "#8B1A1A",
      fontSize: isTablet ? 14 : 12,
      fontWeight: "700",
    },

    gurukulamBannerImage: {
      width: isTablet ? 130 : 90,
      height: isTablet ? 130 : 90,
      borderRadius: 65,
      borderWidth: 2,
      borderColor: "#FFE9C4",
    },
  });