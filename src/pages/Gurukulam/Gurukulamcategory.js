import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../components/Alert/Loader';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;

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

const API_URL = 'https://hdrss-backend.onrender.com/api/course-category';

export default function Gurukulamcategory({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : data?.data || [];

      const uniqueCategories = list.filter(
        (item, index, self) =>
          index === self.findIndex((category) => category.id === item.id)
      );

      const sorted = [...uniqueCategories].sort(
        (a, b) => (a.orderno ?? 0) - (b.orderno ?? 0)
      );

      setCategories(sorted);
    } catch (err) {
      console.error('Failed to fetch course categories:', err);
      setError('Unable to load categories. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const getCategoryName = (item) => {
    return item.categoryname || item.name || 'Unnamed Category';
  };

  const getCategoryImage = (item) => {
    return item.imageurl || item.image || null;
  };

  const renderCard = ({ item, index }) => {
    const palette = BANNER_PALETTES[index % BANNER_PALETTES.length];
    const imageUri = getCategoryImage(item);
    const displayName = getCategoryName(item);
    const label = displayName.split(' ').slice(0, 4).join(' ');

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_W }]}
        activeOpacity={0.78}
        onPress={() =>
          navigation.navigate('GurukulamPage1', {
            categoryId: item.id,
            category: displayName,
          })
        }
      >
        {/* Image Section - Full Card Width */}
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
            <Image source={{ uri: imageUri }} style={styles.categoryImage} resizeMode="cover" />
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
        </View>

        {/* Title Section - Below the Image */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gurukulam</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && (
        <Loader/>
      )}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchCategories}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && categories.length === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>No categories found</Text>
        </View>
      )}

      {!loading && !error && categories.length > 0 && (
        <FlatList
          key={`cols-${NUM_COLS}`}
          data={categories}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          numColumns={NUM_COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[C.gold]}
              tintColor={C.gold}
            />
          }
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <View style={styles.sectionPill} />
              <Text style={styles.sectionTitle}>Category</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    backgroundColor: C.primary,
    paddingTop: 45,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSpacer: {
    width: 40,
    height: 40,
  },

  headerCenter: { flex: 1, alignItems: 'center' },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

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

  categoryImage: {
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

  imgOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },

  goldTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isTablet ? 3 : 2.5,
    backgroundColor: C.gold,
    opacity: 0.85,
  },

  body: { 
    paddingHorizontal: isTablet ? 10 : 8, 
    paddingTop: isTablet ? 10 : 8, 
    paddingBottom: isTablet ? 10 : 8,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: isTablet ? 13 : 11,
    fontWeight: '700',
    color: C.textDark,
    lineHeight: isTablet ? 18 : 15,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  centerBox: {
    flex: 1,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    fontSize: 15,
    color: C.primary,
    textAlign: 'center',
    marginBottom: 12,
  },

  retryBtn: {
    backgroundColor: C.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },
});