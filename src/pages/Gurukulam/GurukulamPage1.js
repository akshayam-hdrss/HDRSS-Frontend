import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Alert/Loader';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const isLargeTablet = width >= 1024;

const NUM_COLS = isTablet ? 4 : 3;
const H_PAD = isTablet ? 24 : 14;
const GAP = isTablet ? 12 : 8;
const CARD_W = (width - H_PAD * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

const C = {
  primary: '#8B1A1A',
  primaryDeep: '#4A0D0D',
  gold: '#D4AF37',
  goldLight: '#F0D060',
  bg: '#FBEEDB',
  surface: '#FFFFFF',
  textDark: '#1A0A0A',
  textLight: '#9E7070',
  border: '#EDE0DC',
};

const BANNER_PALETTES = [
  { top: '#8B1A1A', bottom: '#4A0D0D' },
  { top: '#1a4f3a', bottom: '#0d2e20' },
  { top: '#7c2d12', bottom: '#431607' },
  { top: '#1e3a5f', bottom: '#0f1e33' },
  { top: '#4a1d6b', bottom: '#270d3c' },
  { top: '#5a3200', bottom: '#301a00' },
  { top: '#0f4c75', bottom: '#072640' },
  { top: '#1b4332', bottom: '#0a2318' },
  { top: '#6d2b2b', bottom: '#3b1414' },
];

const API_URL = 'https://hdrss-backend.onrender.com/api/course-page1';
const COMPLETED_LEVELS_KEY = 'completed_levels';
const lang = 'en';

export default function GurukulamPage1({ navigation, route }) {
  const category = route?.params?.category || null;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadCompletedLevels = async (courseId) => {
    try {
      const saved = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      if (saved) {
        const completedData = JSON.parse(saved);
        return completedData[courseId] || [];
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const fetchTotalLevels = async (courseId) => {
    try {
      const response = await fetch(
        `https://hdrss-backend.onrender.com/api/course-page2/by-course/${courseId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data.length : 0;
    } catch (error) {
      return 0;
    }
  };

  const calculateCourseProgress = async (courseId) => {
    try {
      const completedLevels = await loadCompletedLevels(courseId);
      const totalLevels = await fetchTotalLevels(courseId);
      if (totalLevels === 0) return 0;
      return Math.round((completedLevels.length / totalLevels) * 100);
    } catch (error) {
      return 0;
    }
  };

  const mapApiResponse = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map((item) => ({
      id: String(item.id ?? item._id),
      coursename: item.coursename || item.title || item.name || 'Untitled Course',
      imageurl: item.imageurl || item.image || null,
      orderno: item.orderno ?? item.order ?? 0,
      progress: 0,
      category: item.category || item.categoryname || null,
    }));
  };

  const fetchCourses = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      let rawData = Array.isArray(json) ? json : json?.data ?? [];
      let mappedData = mapApiResponse(rawData);

      const seenIds = new Set();
      mappedData = mappedData.filter((course) => {
        if (seenIds.has(course.id)) return false;
        seenIds.add(course.id);
        return true;
      });

      if (mappedData.length === 0) {
        setError(true);
        setCourses([]);
        setLoading(false);
        return;
      }

      const coursesWithProgress = await Promise.all(
        mappedData.map(async (course) => {
          const progress = await calculateCourseProgress(course.id);
          return { ...course, progress };
        })
      );

      const sortedList = coursesWithProgress.sort((a, b) => (a.orderno ?? 0) - (b.orderno ?? 0));
      setCourses(sortedList);
    } catch (e) {
      console.log('GurukulamPage1 fetch error:', e);
      setError(true);
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  const renderCard = ({ item, index }) => {
    const palette = BANNER_PALETTES[index % BANNER_PALETTES.length];
    const progress = item.progress ?? 0;
    const imageUri = item.imageurl;

    const displayName = item.coursename || 'Untitled';
    const label = displayName.split(' ').slice(0, 4).join(' ');
    const isCompleted = progress >= 100;
    const isNew = progress === 0;

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_W }]}
        activeOpacity={0.78}
        onPress={() =>
          navigation.navigate('GurukulamPage2', {
            courseId: item.id,
            courseName: item.coursename,
            currentProgress: progress,
            lang,
          })
        }
      >
        {/* Image Section - Full Cover */}
        <View
          style={[
            styles.banner,
            {
              backgroundColor: palette.top,
              width: CARD_W,
              height: CARD_W * 0.85,
            },
          ]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.courseImage} resizeMode="cover" />
          ) : (
            <>
              <View style={[styles.diagonalStripe, { backgroundColor: palette.bottom }]} />
              <View style={styles.iconCircle}>
                <Ionicons name="book-outline" size={isTablet ? 32 : 28} color={C.goldLight} />
              </View>
            </>
          )}

          {imageUri && <View style={styles.imgOverlay} />}
          <View style={styles.goldTopLine} />

          {isCompleted ? (
            <View style={[styles.badge, styles.badgeDone]}>
              <Ionicons name="checkmark" size={8} color="#fff" />
              <Text style={styles.badgeTxt}>DONE</Text>
            </View>
          ) : isNew ? (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeTxt}>NEW</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeTrack]}>
              <Text style={styles.badgeTxt}>{Math.round(progress)}%</Text>
            </View>
          )}

          <View style={styles.progRow}>
            <View style={styles.progTrack}>
              <View style={[styles.progBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Title, Percentage & Arrow Section */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {label}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.pctTxt}>{Math.round(progress)}%</Text>
            <View style={[styles.arrowBtn, isCompleted && styles.arrowBtnDone]}>
              <Ionicons name={isCompleted ? 'checkmark' : 'arrow-forward'} size={isTablet ? 9 : 8} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerTitleText = category || 'Gurukulam';

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{headerTitleText}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <Loader />
      </View>
    );
  }

  if (error && courses.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{headerTitleText}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={isTablet ? 80 : 60} color={C.textLight} />
          <Text style={styles.errorTitle}>Unable to Load Courses</Text>
          <Text style={styles.errorSub}>Please check your internet connection and try again</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{headerTitleText}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        key={`cols-${NUM_COLS}`}
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        numColumns={NUM_COLS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[C.gold]} tintColor={C.gold} />}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <View style={styles.sectionPill} />
            <Text style={styles.sectionTitle}>Available Courses</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="book-outline" size={32} color={C.gold} />
            </View>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySub}>Check back soon</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    backgroundColor: C.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 24 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: isTablet ? 30 : 25,
    borderBottomRightRadius: isTablet ? 30 : 25,
    elevation: isTablet ? 6 : 4,
  },
  backBtn: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerSpacer: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: isTablet ? 24 : 19, fontWeight: '800', letterSpacing: 0.5 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isTablet ? 24 : 18,
    paddingBottom: isTablet ? 16 : 12,
    gap: isTablet ? 12 : 8,
  },
  sectionPill: { width: isTablet ? 5 : 4, height: isTablet ? 24 : 18, borderRadius: 3, backgroundColor: C.gold },
  sectionTitle: { fontSize: isTablet ? 18 : 15, fontWeight: '800', color: C.textDark, letterSpacing: 0.3 },
  countPill: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 4 : 2,
    marginLeft: isTablet ? 8 : 4,
  },
  countTxt: { fontSize: isTablet ? 13 : 11, color: '#fff', fontWeight: '700' },
  listContent: { paddingHorizontal: H_PAD, paddingTop: 4, paddingBottom: 44 },
  row: { gap: GAP, marginBottom: GAP + 4 },
  card: {
    backgroundColor: C.surface,
    borderRadius: isTablet ? 16 : 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    elevation: isTablet ? 6 : 5,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: isTablet ? 6 : 4 },
    shadowOpacity: isTablet ? 0.16 : 0.14,
    shadowRadius: isTablet ? 8 : 6,
  },
  banner: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative', 
    overflow: 'hidden',
  },
  courseImage: { 
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%', 
    height: '100%',
  },
  diagonalStripe: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: CARD_W * 0.7,
    height: CARD_W * 0.7,
    borderRadius: 10,
    opacity: 0.45,
    transform: [{ rotate: '25deg' }],
  },
  iconCircle: {
    width: isTablet ? 70 : 55,
    height: isTablet ? 70 : 55,
    borderRadius: isTablet ? 35 : 27.5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  goldTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isTablet ? 3 : 2.5,
    backgroundColor: C.gold,
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: isTablet ? 10 : 7,
    left: isTablet ? 10 : 7,
    borderRadius: isTablet ? 8 : 6,
    paddingHorizontal: isTablet ? 8 : 5,
    paddingVertical: isTablet ? 4 : 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: isTablet ? 4 : 2,
  },
  badgeTrack: { backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  badgeNew: { backgroundColor: C.gold, shadowColor: C.gold, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  badgeDone: {
    backgroundColor: '#2d7a45',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#2d7a45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeTxt: { color: '#fff', fontSize: isTablet ? 9 : 8, fontWeight: '800', letterSpacing: 0.5 },
  progRow: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  progTrack: { height: isTablet ? 4 : 3.5, backgroundColor: 'rgba(255,255,255,0.2)' },
  progBar: { height: isTablet ? 4 : 3.5, backgroundColor: C.gold, borderTopRightRadius: 2, borderBottomRightRadius: 2 },
  body: { 
    paddingHorizontal: isTablet ? 10 : 8, 
    paddingTop: isTablet ? 10 : 8, 
    paddingBottom: isTablet ? 10 : 8,
    backgroundColor: C.surface,
  },
  title: { 
    fontSize: isTablet ? 13 : 11, 
    fontWeight: '700', 
    color: C.textDark, 
    lineHeight: isTablet ? 18 : 15, 
    marginBottom: isTablet ? 8 : 6, 
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  pctTxt: { 
    fontSize: isTablet ? 12 : 10, 
    fontWeight: '800', 
    color: C.primary, 
    letterSpacing: 0.3 
  },
  arrowBtn: {
    width: isTablet ? 22 : 18,
    height: isTablet ? 22 : 18,
    borderRadius: 99,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  arrowBtnDone: { backgroundColor: '#2d7a45', shadowColor: '#2d7a45' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  errorTitle: { fontSize: isTablet ? 22 : 18, fontWeight: '700', color: C.textDark, marginTop: 8 },
  errorSub: { fontSize: isTablet ? 16 : 14, color: C.textLight, textAlign: 'center', maxWidth: isTablet ? 400 : 300 },
  retryBtn: { backgroundColor: C.primary, paddingVertical: isTablet ? 14 : 10, paddingHorizontal: isTablet ? 40 : 30, borderRadius: isTablet ? 12 : 10, marginTop: 8 },
  retryBtnText: { color: '#fff', fontSize: isTablet ? 16 : 14, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', paddingVertical: isTablet ? 100 : 70, gap: isTablet ? 14 : 10 },
  emptyIcon: {
    width: isTablet ? 80 : 68,
    height: isTablet ? 80 : 68,
    borderRadius: isTablet ? 40 : 34,
    backgroundColor: C.primaryDeep,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 4,
    borderWidth: isTablet ? 3 : 2,
    borderColor: C.gold,
  },
  emptyTitle: { fontSize: isTablet ? 20 : 16, fontWeight: '700', color: C.textDark },
  emptySub: { fontSize: isTablet ? 16 : 13, color: C.textLight },
});