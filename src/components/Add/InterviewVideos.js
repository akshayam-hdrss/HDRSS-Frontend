// components/InterviewVideos.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import YoutubePlayer from "react-native-youtube-iframe";
import Loader from "../Alert/Loader";

/* ─── Single direct-video card ─── */
function DirectVideoCard({ url, width, height }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  return (
    <View style={[styles.card, { width }]}>
      <VideoView
        player={player}
        style={{ width, height }}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />
    </View>
  );
}

export default function InterviewVideos({ districtId }) {
  const { width } = useWindowDimensions();

  const [videos, setVideos] = useState([]);   // { id, type: 'youtube'|'direct', videoId?, url? }
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  const isTablet = width >= 600;
  const videoWidth = isTablet ? 700 : 380;
  const videoHeight = isTablet ? 420 : 240;

  /* ── Extract YouTube ID ── */
  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\/.*v=)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  /* ── Fetch videos ── */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let videoArray = [];

        if (districtId) {
          // ✅ Fetch district-specific business videos
          const response = await fetch(
            `https://hdrss-backend.onrender.com/api/district-business-videos/district/${districtId}`
          );
          // 404 = no videos for this district yet — not an error
          if (response.status === 404) {
            setVideos([]);
            setLoading(false);
            return;
          }
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();

          // data.data is an array of records, each with videoUrl (array of URL strings)
          const records = Array.isArray(data.data) ? data.data : [];
          records.forEach((record) => {
            const urls = Array.isArray(record.videoUrl)
              ? record.videoUrl
              : typeof record.videoUrl === "string"
              ? [record.videoUrl]
              : [];
            videoArray.push(...urls);
          });
        } else {
          // Fallback: old Interviews API
          const response = await fetch(
            "https://hdrss-backend.onrender.com/api/add/Interviews"
          );
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data)) videoArray = data;
          else if (data?.videos) videoArray = data.videos;
          else if (data?.data) videoArray = data.data;
        }

        // Process: determine if each URL is YouTube or direct video
        const processed = videoArray
          .map((item, index) => {
            const url =
              typeof item === "string"
                ? item
                : item?.url || item?.videoUrl || "";
            if (!url) return null;

            const youtubeId = getYouTubeId(url);
            if (youtubeId) {
              return { id: `yt-${index}`, type: "youtube", videoId: youtubeId, url };
            }
            // Treat as a direct video URL (mp4, etc.)
            return { id: `direct-${index}`, type: "direct", url };
          })
          .filter(Boolean);

        setVideos(processed);
      } catch (error) {
        console.error("InterviewVideos fetch error:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [districtId]);

  if (loading) return <Loader />;

  return (
    <View style={styles.interviewContainer}>
      <Text style={[styles.heading1, isTablet && styles.headingTablet]}>
        Business Video
      </Text>

      {videos.length === 0 ? (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>No videos available</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {videos.map((video) =>
            video.type === "youtube" ? (
              <View key={video.id} style={[styles.card, { width: videoWidth }]}>
                <YoutubePlayer
                  height={videoHeight}
                  width={videoWidth}
                  play={playing}
                  videoId={video.videoId}
                  onChangeState={(state) => setPlaying(state === "playing")}
                  webViewStyle={{ opacity: 0.99 }}
                  webViewProps={{ androidLayerType: "hardware" }}
                />
              </View>
            ) : (
              <DirectVideoCard
                key={video.id}
                url={video.url}
                width={videoWidth}
                height={videoHeight}
              />
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  interviewContainer: {
    marginTop: 20,
    marginBottom: -8,
    paddingHorizontal: 10,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 20,
    marginLeft: 90,
  },
  headingTablet: {
    fontSize: 28,
    marginLeft: 20,
  },
  scrollContent: {
    paddingHorizontal: 5,
    paddingTop: 12,
  },
  card: {
    marginHorizontal: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  noVideosContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    backgroundColor: "#e3adad",
    marginHorizontal: 10,
  },
  noVideosText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});