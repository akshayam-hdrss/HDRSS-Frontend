import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, Platform,
  FlatList, Alert, Modal, Animated, Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Alert/Loader';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 600;
const isLargeTablet = width >= 1024;

const COMPLETED_LEVELS_KEY = 'completed_levels';
const API_URL = 'https://hdrss-backend.onrender.com/api/course-page2/by-course';

export default function GurukulamPage2({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const lang = route?.params?.lang || 'en';

  const [levels, setLevels] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchLevels = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/${courseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      let mappedLevels = [];
      if (Array.isArray(data) && data.length > 0) {
        mappedLevels = data.map((item, index) => {
          let galleryArray = [];
          if (item.gallery) {
            if (Array.isArray(item.gallery)) {
              galleryArray = item.gallery
                .filter(img => img && typeof img === 'object' && img.url && typeof img.url === 'string')
                .map(img => img.url);
            } else if (typeof item.gallery === 'string') {
              galleryArray = [item.gallery];
            } else if (typeof item.gallery === 'object' && item.gallery.url) {
              galleryArray = [item.gallery.url];
            }
          }
          return {
            _id: String(item.id || item._id || index),
            level: item.level || `Level ${index + 1}`,
            intro: item.intro || 'No description available',
            videolink: item.videolink || '',
            orderno: item.orderno || index + 1,
            gallery: galleryArray
          };
        });
        mappedLevels.sort((a, b) => (a.orderno || 0) - (b.orderno || 0));
      }
      return mappedLevels;
    } catch (error) {
      console.log('Error fetching levels:', error);
      setError(true);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(false);
      const fetchedLevels = await fetchLevels(courseId);
      if (fetchedLevels.length === 0) {
        setError(true);
        setLevels([]);
        setIsLoading(false);
        return;
      }
      setLevels(fetchedLevels);
      await loadSavedData(fetchedLevels);
      setIsLoading(false);
    };
    loadData();
  }, [courseId]);

  const loadSavedData = async (sortedLevels) => {
    try {
      const savedCompleted = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      const completedData = savedCompleted ? JSON.parse(savedCompleted) : {};
      const completedForCourse = completedData[courseId] || [];
      setCompletedLevels(completedForCourse);

      const progress = sortedLevels.length > 0 ? Math.round((completedForCourse.length / sortedLevels.length) * 100) : 0;
      setCourseProgress(progress);

      const firstUncompleted = sortedLevels.find(l => !completedForCourse.includes(l._id));
      setActiveLevel(firstUncompleted || sortedLevels[0]);
    } catch (e) {
      console.log('Error loading data:', e);
      setActiveLevel(sortedLevels[0]);
    }
  };

  const saveCompletedLevels = async (completed) => {
    try {
      const saved = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      const completedData = saved ? JSON.parse(saved) : {};
      completedData[courseId] = completed;
      await AsyncStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(completedData));
    } catch (e) {
      console.log('Error saving completed levels:', e);
    }
  };

  const handleVideoComplete = () => {
    if (!activeLevel) return;
    if (!completedLevels.includes(activeLevel._id)) {
      const newCompleted = [...completedLevels, activeLevel._id];
      setCompletedLevels(newCompleted);
      const newProgress = Math.round((newCompleted.length / levels.length) * 100);
      setCourseProgress(newProgress);
      saveCompletedLevels(newCompleted);
      setCompletionMessage(`🎉 Great job! You've completed "${activeLevel.level}"`);
      setShowCompletionModal(true);
      setTimeout(() => {
        setShowCompletionModal(false);
        advanceToNextLevel();
      }, 3000);
    }
  };

  const advanceToNextLevel = () => {
    const currentIndex = levels.findIndex(l => l._id === activeLevel?._id);
    const nextLevel = levels[currentIndex + 1];
    if (nextLevel) {
      setActiveLevel(nextLevel);
    } else {
      setCompletionMessage('🎊 Congratulations! You\'ve completed all levels!');
      setShowCompletionModal(true);
      setTimeout(() => setShowCompletionModal(false), 4000);
    }
  };

  const navigateToLevel = (level) => {
    const levelIndex = levels.findIndex(l => l._id === level._id);
    const previousLevels = levels.slice(0, levelIndex);
    const allPreviousCompleted = previousLevels.every(l => completedLevels.includes(l._id));
    if (allPreviousCompleted || levelIndex === 0) {
      setActiveLevel(level);
    } else {
      Alert.alert('🔒 Level Locked', 'Please complete previous levels first to unlock this content.', [{ text: 'OK' }]);
    }
  };

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to check if URL is YouTube
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const renderVideoPlayer = () => {
    if (!activeLevel || !activeLevel.videolink) {
      return (
        <View style={isTablet ? tabletStyles.playerEmpty : mobileStyles.playerEmpty}>
          <Ionicons name="play-circle-outline" size={isTablet ? (isLargeTablet ? 60 : 50) : 40} color="rgba(255,255,255,0.4)" />
          <Text style={isTablet ? tabletStyles.playerEmptyTxt : mobileStyles.playerEmptyTxt}>
            {lang === 'ta' ? 'வீடியோ கிடைக்கவில்லை' : 'No video available'}
          </Text>
        </View>
      );
    }

    const videoLink = activeLevel.videolink;
    const isYouTube = isYouTubeUrl(videoLink);

    // For YouTube videos - use embed with controls disabled for cleaner look
    if (isYouTube) {
      const videoId = getYouTubeVideoId(videoLink);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=1`;
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { margin: 0; padding: 0; }
                body { background: #000; }
                .container {
                  position: relative;
                  width: 100%;
                  height: 100vh;
                  background: #000;
                }
                iframe {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 100%;
                  height: 100%;
                  border: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <iframe 
                  src="${embedUrl}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
              <script>
                // Detect video end
                window.addEventListener('message', function(event) {
                  if (event.data === 'ended') {
                    window.ReactNativeWebView.postMessage('video-ended');
                  }
                });
              </script>
            </body>
          </html>
        `;

        return (
          <WebView
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            style={isTablet ? tabletStyles.video : mobileStyles.video}
            source={{ html: htmlContent }}
            onMessage={(event) => {
              if (event.nativeEvent.data === 'video-ended') {
                handleVideoComplete();
              }
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          />
        );
      }
    }

    // For direct video URLs (non-YouTube)
    const injectedJS = `
      const video = document.querySelector('video');
      if (video) {
        video.addEventListener('ended', () => {
          window.ReactNativeWebView.postMessage('video-ended');
        });
        video.play();
      }
      true;
    `;

    return (
      <WebView
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        style={isTablet ? tabletStyles.video : mobileStyles.video}
        source={{ uri: videoLink }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'video-ended') {
            handleVideoComplete();
          }
        }}
        injectedJavaScript={injectedJS}
        javaScriptEnabled={true}
      />
    );
  };

  const renderCompletionModal = () => (
    <Modal transparent visible={showCompletionModal} animationType="fade" onRequestClose={() => setShowCompletionModal(false)}>
      <View style={isTablet ? tabletStyles.modalOverlay : mobileStyles.modalOverlay}>
        <Animated.View style={[isTablet ? tabletStyles.modalContent : mobileStyles.modalContent, { opacity: fadeAnim }]}>
          <View style={isTablet ? tabletStyles.modalIcon : mobileStyles.modalIcon}>
            <Ionicons name="checkmark-circle" size={isTablet ? (isLargeTablet ? 80 : 70) : 60} color="#4CAF50" />
          </View>
          <Text style={isTablet ? tabletStyles.modalTitle : mobileStyles.modalTitle}>
            {lang === 'ta' ? 'படி முடிந்தது!' : 'Level Complete!'}
          </Text>
          <Text style={isTablet ? tabletStyles.modalMessage : mobileStyles.modalMessage}>{completionMessage}</Text>
          <View style={isTablet ? tabletStyles.modalProgress : mobileStyles.modalProgress}>
            <View style={isTablet ? tabletStyles.progressTrack : mobileStyles.progressTrack}>
              <View style={[isTablet ? tabletStyles.progressFill : mobileStyles.progressFill, { width: `${(completedLevels.length / levels.length) * 100}%` }]} />
            </View>
            <Text style={isTablet ? tabletStyles.progressText : mobileStyles.progressText}>
              {completedLevels.length} / {levels.length} {lang === 'ta' ? 'முடிந்தது' : 'completed'}
            </Text>
          </View>
          <TouchableOpacity style={isTablet ? tabletStyles.modalButton : mobileStyles.modalButton} onPress={() => { setShowCompletionModal(false); advanceToNextLevel(); }}>
            <Text style={isTablet ? tabletStyles.modalButtonText : mobileStyles.modalButtonText}>
              {lang === 'ta' ? 'தொடரவும் →' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const progress = levels.length > 0 ? (completedLevels.length / levels.length) * 100 : 0;

  if (isLoading) {
    return (
      <View style={isTablet ? tabletStyles.loadingContainer : mobileStyles.loadingContainer}>
        <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />
        <Loader />
      </View>
    );
  }

  if (error || levels.length === 0) {
    return (
      <View style={isTablet ? tabletStyles.errorContainer : mobileStyles.errorContainer}>
        <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />
        <Ionicons name="cloud-offline-outline" size={isTablet ? (isLargeTablet ? 100 : 80) : 60} color="#CBD5E1" />
        <Text style={isTablet ? tabletStyles.errorTitle : mobileStyles.errorTitle}>
          {lang === 'ta' ? 'படநெறி கிடைக்கவில்லை' : 'No Course Available'}
        </Text>
        <Text style={isTablet ? tabletStyles.errorSub : mobileStyles.errorSub}>
          {lang === 'ta' ? 'படநெறி நிலைகளை ஏற்ற முடியவில்லை.' : 'Unable to load course levels.'}
        </Text>
        <TouchableOpacity style={isTablet ? tabletStyles.retryButton : mobileStyles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={isTablet ? tabletStyles.retryButtonText : mobileStyles.retryButtonText}>
            {lang === 'ta' ? 'திரும்பு' : 'Go Back'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={isTablet ? tabletStyles.container : mobileStyles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      <View style={isTablet ? tabletStyles.headerContainer : mobileStyles.headerContainer}>
        <TouchableOpacity style={isTablet ? tabletStyles.backButton : mobileStyles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? (isLargeTablet ? 36 : 30) : 24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={isTablet ? tabletStyles.titleContainer : mobileStyles.titleContainer}>
          <Text style={isTablet ? tabletStyles.headerTitle : mobileStyles.headerTitle} numberOfLines={1}>
            {courseName}
          </Text>
        </View>
        <TouchableOpacity style={isTablet ? tabletStyles.progressButton : mobileStyles.progressButton} onPress={() => {
          Alert.alert(
            lang === 'ta' ? '📊 படநெறி முன்னேற்றம்' : '📊 Course Progress',
            lang === 'ta'
              ? `முடிந்தவை: ${completedLevels.length} / ${levels.length} நிலைகள்\nமுன்னேற்றம்: ${Math.round(progress)}%`
              : `Completed: ${completedLevels.length} / ${levels.length} levels\nProgress: ${Math.round(progress)}%`,
            [{ text: 'OK' }]
          );
        }}>
          <Ionicons name="stats-chart" size={isTablet ? (isLargeTablet ? 28 : 24) : 20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={isTablet ? tabletStyles.progressHeader : mobileStyles.progressHeader}>
        <View style={isTablet ? tabletStyles.progressBarTrack : mobileStyles.progressBarTrack}>
          <View style={[isTablet ? tabletStyles.progressBarFill : mobileStyles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={isTablet ? tabletStyles.progressHeaderText : mobileStyles.progressHeaderText}>
          {Math.round(progress)}% {lang === 'ta' ? 'முடிந்தது' : 'Complete'}
        </Text>
      </View>

      <View style={isTablet ? tabletStyles.playerWrap : mobileStyles.playerWrap}>
        {renderVideoPlayer()}
      </View>

      {/* Level Info - shows current level title and intro */}
      {activeLevel && (
        <View style={isTablet ? tabletStyles.infoCard : mobileStyles.infoCard}>
          <Text style={isTablet ? tabletStyles.levelTitle : mobileStyles.levelTitle}>{activeLevel.level}</Text>
          <Text style={isTablet ? tabletStyles.levelIntro : mobileStyles.levelIntro}>{activeLevel.intro}</Text>
        </View>
      )}

      {/* Syllabus Section */}
      <View style={isTablet ? tabletStyles.syllabusHeader : mobileStyles.syllabusHeader}>
        <Text style={isTablet ? tabletStyles.sectionLbl : mobileStyles.sectionLbl}>
          {lang === 'ta' ? 'படநெறி பாடத்திட்டம்' : 'Course Syllabus'}
        </Text>
        <Text style={isTablet ? tabletStyles.completedCount : mobileStyles.completedCount}>
          {completedLevels.length}/{levels.length} {lang === 'ta' ? 'முடிந்தது' : 'completed'}
        </Text>
      </View>

      <FlatList 
        data={levels} 
        renderItem={({ item, index }) => {
          const isCompleted = completedLevels.includes(item._id);
          const isActive = activeLevel?._id === item._id;
          const isLocked = !isCompleted && !isActive && index > 0 && !completedLevels.includes(levels[index - 1]?._id);

          return (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.75}
              style={[
                isTablet ? tabletStyles.syllabusRow : mobileStyles.syllabusRow,
                isActive && (isTablet ? tabletStyles.syllabusRowActive : mobileStyles.syllabusRowActive),
                isCompleted && (isTablet ? tabletStyles.syllabusRowCompleted : mobileStyles.syllabusRowCompleted),
                isLocked && (isTablet ? tabletStyles.syllabusRowLocked : mobileStyles.syllabusRowLocked),
              ]}
              onPress={() => navigateToLevel(item)}
              disabled={isLocked}
            >
              <View style={[isTablet ? tabletStyles.statusCircle : mobileStyles.statusCircle, isCompleted && (isTablet ? tabletStyles.statusCircleCompleted : mobileStyles.statusCircleCompleted)]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={isTablet ? (isLargeTablet ? 18 : 16) : 14} color="#fff" />
                ) : isActive ? (
                  <Ionicons name="play" size={isTablet ? (isLargeTablet ? 16 : 14) : 12} color="#fff" />
                ) : isLocked ? (
                  <Ionicons name="lock-closed" size={isTablet ? (isLargeTablet ? 16 : 14) : 12} color="#94A3B8" />
                ) : (
                  <Text style={isTablet ? tabletStyles.indexTxt : mobileStyles.indexTxt}>{index + 1}</Text>
                )}
              </View>
              <View style={isTablet ? tabletStyles.levelInfo : mobileStyles.levelInfo}>
                <Text style={[
                  isTablet ? tabletStyles.syllabusName : mobileStyles.syllabusName,
                  isActive && (isTablet ? tabletStyles.syllabusNameActive : mobileStyles.syllabusNameActive),
                  isCompleted && (isTablet ? tabletStyles.syllabusNameCompleted : mobileStyles.syllabusNameCompleted),
                  isLocked && (isTablet ? tabletStyles.syllabusNameLocked : mobileStyles.syllabusNameLocked),
                ]} numberOfLines={isTablet ? 2 : 1}>
                  {item.level}
                </Text>
              </View>
              {isActive && (
                <View style={isTablet ? tabletStyles.watchingBadge : mobileStyles.watchingBadge}>
                  <Text style={isTablet ? tabletStyles.watchingTxt : mobileStyles.watchingTxt}>
                    {lang === 'ta' ? '▶ ஓடுகிறது' : '▶ Playing'}
                  </Text>
                </View>
              )}
              {isCompleted && !isActive && (
                <View style={isTablet ? tabletStyles.completedBadge : mobileStyles.completedBadge}>
                  <Text style={isTablet ? tabletStyles.completedTxt : mobileStyles.completedTxt}>
                    {lang === 'ta' ? '✓ முடிந்தது' : '✓ Done'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }} 
        keyExtractor={(item) => item._id} 
        style={isTablet ? tabletStyles.syllabusList : mobileStyles.syllabusList}
        contentContainerStyle={isTablet ? tabletStyles.syllabusContent : mobileStyles.syllabusContent}
        showsVerticalScrollIndicator={false}
      />

      {completedLevels.length > 0 && completedLevels.length === levels.length && (
        <View style={isTablet ? tabletStyles.completionCard : mobileStyles.completionCard}>
          <Ionicons name="trophy" size={isTablet ? (isLargeTablet ? 48 : 40) : 32} color="#D4AF37" />
          <Text style={isTablet ? tabletStyles.completionTitle : mobileStyles.completionTitle}>
            {lang === 'ta' ? '🏆 படநெறி முடிந்தது!' : '🏆 Course Complete!'}
          </Text>
          <Text style={isTablet ? tabletStyles.completionSub : mobileStyles.completionSub}>
            {lang === 'ta' ? 'இந்த படநெறியின் அனைத்து நிலைகளையும் நீங்கள் முடித்துவிட்டீர்கள்.' : "You've mastered all levels of this course."}
          </Text>
        </View>
      )}

      {renderCompletionModal()}
    </View>
  );
}

// Mobile Styles
const mobileStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBEEDB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20, gap: 12 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#1A0A0A' },
  errorSub: { fontSize: 14, color: '#64748B', textAlign: 'center', maxWidth: 300 },
  retryButton: { backgroundColor: '#8B1A1A', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, marginTop: 8 },
  retryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  headerContainer: {
    backgroundColor: "#9D1B00",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  headerTitle: { color: '#fff', fontSize: 19, fontWeight: '800', letterSpacing: 0.3 },
  progressButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  progressHeader: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  progressBarTrack: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: '#D4AF37', borderRadius: 3 },
  progressHeaderText: { fontSize: 12, fontWeight: '700', color: '#8B1A1A', minWidth: 70, textAlign: 'right' },
  playerWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#0F172A' },
  video: { flex: 1, backgroundColor: '#000' },
  playerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  playerEmptyTxt: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 14, marginTop: 12, borderWidth: 0.5, borderColor: '#E2E8F0', elevation: 2 },
  levelTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  levelIntro: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  syllabusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  sectionLbl: { fontSize: 10, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  completedCount: { fontSize: 11, color: '#8B1A1A', fontWeight: '600' },
  syllabusList: { flex: 1 },
  syllabusContent: { paddingHorizontal: 14, paddingBottom: 20 },
  syllabusRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0', gap: 10 },
  syllabusRowActive: { borderColor: '#8B1A1A', backgroundColor: '#FFF8F7', borderWidth: 2 },
  syllabusRowCompleted: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4', borderWidth: 2 },
  syllabusRowLocked: { opacity: 0.6, backgroundColor: '#F8FAFC' },
  statusCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  statusCircleCompleted: { backgroundColor: '#4CAF50' },
  indexTxt: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  levelInfo: { flex: 1 },
  syllabusName: { fontSize: 12, fontWeight: '500', color: '#374151' },
  syllabusNameActive: { color: '#8B1A1A', fontWeight: '700' },
  syllabusNameCompleted: { color: '#2E7D32', fontWeight: '600' },
  syllabusNameLocked: { color: '#94A3B8' },
  watchingBadge: { backgroundColor: '#FEF2F2', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 0.5, borderColor: '#FECACA' },
  watchingTxt: { fontSize: 9, color: '#8B1A1A', fontWeight: '700' },
  completedBadge: { backgroundColor: '#E8F5E9', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 0.5, borderColor: '#A5D6A7' },
  completedTxt: { fontSize: 9, color: '#2E7D32', fontWeight: '700' },
  completionCard: { backgroundColor: '#FFF8E1', borderRadius: 14, padding: 20, alignItems: 'center', marginTop: 20, marginHorizontal: 14, marginBottom: 20, borderWidth: 2, borderColor: '#D4AF37' },
  completionTitle: { fontSize: 18, fontWeight: '800', color: '#8B1A1A', marginTop: 8 },
  completionSub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: width * 0.85, maxWidth: 400, alignItems: 'center' },
  modalIcon: { marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  modalMessage: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  modalProgress: { width: '100%', marginBottom: 16 },
  progressTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 8, backgroundColor: '#D4AF37', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  modalButton: { backgroundColor: '#8B1A1A', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

// Tablet Styles
const tabletStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 30, gap: 16 },
  errorTitle: { fontSize: 22, fontWeight: '700', color: '#1A0A0A' },
  errorSub: { fontSize: 16, color: '#64748B', textAlign: 'center', maxWidth: 400 },
  retryButton: { backgroundColor: '#8B1A1A', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, marginTop: 12 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  headerContainer: {
    backgroundColor: "#9D1B00",
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  backButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  headerTitle: { color: '#fff', fontSize: isLargeTablet ? 26 : 22, fontWeight: '800', letterSpacing: 0.3 },
  progressButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  progressHeader: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  progressBarTrack: { flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#D4AF37', borderRadius: 4 },
  progressHeaderText: { fontSize: 14, fontWeight: '700', color: '#8B1A1A', minWidth: 80, textAlign: 'right' },
  playerWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#0F172A' },
  video: { flex: 1, backgroundColor: '#000' },
  playerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  playerEmptyTxt: { color: 'rgba(255,255,255,0.45)', fontSize: 15 },
  infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginHorizontal: 20, marginTop: 16, borderWidth: 0.5, borderColor: '#E2E8F0', elevation: 2 },
  levelTitle: { fontSize: isLargeTablet ? 18 : 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  levelIntro: { fontSize: isLargeTablet ? 14 : 13, color: '#64748B', lineHeight: 20 },
  syllabusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  sectionLbl: { fontSize: 12, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  completedCount: { fontSize: 13, color: '#8B1A1A', fontWeight: '600' },
  syllabusList: { flex: 1 },
  syllabusContent: { paddingHorizontal: 20, paddingBottom: 30 },
  syllabusRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: isLargeTablet ? 18 : 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  syllabusRowActive: { borderColor: '#8B1A1A', backgroundColor: '#FFF8F7', borderWidth: isLargeTablet ? 3 : 2 },
  syllabusRowCompleted: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4', borderWidth: isLargeTablet ? 3 : 2 },
  syllabusRowLocked: { opacity: 0.6, backgroundColor: '#F8FAFC' },
  statusCircle: { width: isLargeTablet ? 44 : 38, height: isLargeTablet ? 44 : 38, borderRadius: isLargeTablet ? 22 : 19, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  statusCircleCompleted: { backgroundColor: '#4CAF50' },
  indexTxt: { fontSize: isLargeTablet ? 15 : 13, fontWeight: '700', color: '#64748B' },
  levelInfo: { flex: 1 },
  syllabusName: { fontSize: isLargeTablet ? 16 : 14, fontWeight: '500', color: '#374151' },
  syllabusNameActive: { color: '#8B1A1A', fontWeight: '700' },
  syllabusNameCompleted: { color: '#2E7D32', fontWeight: '600' },
  syllabusNameLocked: { color: '#94A3B8' },
  watchingBadge: { backgroundColor: '#FEF2F2', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: '#FECACA' },
  watchingTxt: { fontSize: 10, color: '#8B1A1A', fontWeight: '700' },
  completedBadge: { backgroundColor: '#E8F5E9', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: '#A5D6A7' },
  completedTxt: { fontSize: 10, color: '#2E7D32', fontWeight: '700' },
  completionCard: { backgroundColor: '#FFF8E1', borderRadius: 16, padding: isLargeTablet ? 32 : 24, alignItems: 'center', marginTop: 24, marginHorizontal: 20, marginBottom: 30, borderWidth: isLargeTablet ? 3 : 2.5, borderColor: '#D4AF37' },
  completionTitle: { fontSize: isLargeTablet ? 24 : 20, fontWeight: '800', color: '#8B1A1A', marginTop: 10 },
  completionSub: { fontSize: isLargeTablet ? 17 : 15, color: '#64748B', textAlign: 'center', marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 28, padding: 28, width: width * 0.7, maxWidth: 450, alignItems: 'center' },
  modalIcon: { marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  modalMessage: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  modalProgress: { width: '100%', marginBottom: 20 },
  progressTrack: { height: 10, backgroundColor: '#E2E8F0', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 10, backgroundColor: '#D4AF37', borderRadius: 5 },
  progressText: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  modalButton: { backgroundColor: '#8B1A1A', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});