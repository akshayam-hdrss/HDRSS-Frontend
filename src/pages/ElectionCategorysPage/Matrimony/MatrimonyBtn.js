// // import React from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   Dimensions,
// //   ImageBackground,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';

// // const { width, height } = Dimensions.get('window');

// // const MatrimonyBtn = () => {
// //   const navigation = useNavigation();

// //   return (
// //     <View style={styles.container}>
// //       <ImageBackground
// //         source={{ uri: 'https://images.unsplash.com/photo-1516589091380-5c6a2e8b5c3a?w=800' }}
// //         style={styles.backgroundImage}
// //       >
// //         <View style={styles.overlay}>
          
// //           {/* Couple Photo Area - Decorative text instead */}
// //           <View style={styles.coupleContainer}>
// //             <Text style={styles.coupleEmoji}>💑</Text>
// //             <Text style={styles.coupleText}>Find Your Soulmate</Text>
// //           </View>

// //           {/* Two Buttons */}
// //           <View style={styles.buttonsContainer}>
// //             <TouchableOpacity
// //               style={styles.button}
// //               onPress={() => navigation.navigate('CreateProfile')}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.buttonIcon}>📝</Text>
// //               <Text style={styles.buttonText}>Create Profile</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={[styles.button, styles.secondButton]}
// //               onPress={() => navigation.navigate('MatrimoneyProfiles')}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={styles.buttonIcon}>❤️</Text>
// //               <Text style={styles.buttonText}>View Profiles</Text>
// //             </TouchableOpacity>
// //           </View>

// //         </View>
// //       </ImageBackground>
// //     </View>
// //   );
// // };

// // export default MatrimonyBtn;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   backgroundImage: {
// //     width: width,
// //     height: height,
// //   },
// //   overlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0, 0, 0, 0.55)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 30,
// //   },
// //   coupleContainer: {
// //     alignItems: 'center',
// //     marginBottom: 80,
// //   },
// //   coupleEmoji: {
// //     fontSize: 80,
// //     marginBottom: 15,
// //   },
// //   coupleText: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     textAlign: 'center',
// //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// //     textShadowOffset: { width: 1, height: 1 },
// //     textShadowRadius: 3,
// //   },
// //   buttonsContainer: {
// //     width: '100%',
// //   },
// //   button: {
// //     backgroundColor: '#93210A',
// //     borderRadius: 50,
// //     paddingVertical: 16,
// //     paddingHorizontal: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 5,
// //     elevation: 5,
// //   },
// //   secondButton: {
// //     backgroundColor: '#D32F2F',
// //   },
// //   buttonIcon: {
// //     fontSize: 24,
// //     marginRight: 12,
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });



// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Dimensions,
//   ImageBackground,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const MAROON = '#93210A';
// const GOLD = '#D4AF37';
// const PARCHMENT = '#FBEEDB';
// const DARK_BROWN = '#301913';

// const MatrimonyBtn = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={{ uri: 'https://images.unsplash.com/photo-1516589091380-5c6a2e8b5c3a?w=800' }}
//         style={styles.backgroundImage}
//       >
//         {/* Maroon-tinted overlay instead of plain black, keeps brand feel */}
//         <View style={styles.overlay}>

//           {/* Top gold kolam-style divider */}
//           <View style={styles.topOrnament}>
//             <View style={styles.ornamentLine} />
//             <Text style={styles.ornamentSymbol}>ॐ</Text>
//             <View style={styles.ornamentLine} />
//           </View>

//           <View style={styles.coupleContainer}>
//             <View style={styles.iconCircle}>
//               <Text style={styles.coupleEmoji}>💑</Text>
//             </View>
//             <Text style={styles.brandTitle}>HDRSS Matrimony</Text>
//             <Text style={styles.coupleText}>Find a life partner rooted in tradition</Text>
//           </View>

//           {/* Trust strip - real matrimony apps always show this */}
//           <View style={styles.trustStrip}>
//             <View style={styles.trustItem}>
//               <Text style={styles.trustNumber}>100%</Text>
//               <Text style={styles.trustLabel}>Verified</Text>
//             </View>
//             <View style={styles.trustDivider} />
//             <View style={styles.trustItem}>
//               <Text style={styles.trustNumber}>Secure</Text>
//               <Text style={styles.trustLabel}>Payments</Text>
//             </View>
//             <View style={styles.trustDivider} />
//             <View style={styles.trustItem}>
//               <Text style={styles.trustNumber}>Private</Text>
//               <Text style={styles.trustLabel}>Contact Info</Text>
//             </View>
//           </View>

//           <View style={styles.buttonsContainer}>
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => navigation.navigate('CreateProfile')}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.buttonIcon}>📝</Text>
//               <Text style={styles.primaryButtonText}>Create Your Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={() => navigation.navigate('MatrimoneyProfiles')}
//               activeOpacity={0.85}
//             >
//               <Text style={styles.buttonIconGold}>👥</Text>
//               <Text style={styles.secondaryButtonText}>Browse Profiles</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.bottomOrnament}>
//             <View style={styles.ornamentLine} />
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// export default MatrimonyBtn;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   backgroundImage: { width, height },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(48, 25, 19, 0.72)', // dark brown tint, not plain black
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 28,
//   },
//   topOrnament: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   ornamentLine: {
//     width: 50,
//     height: 1.5,
//     backgroundColor: GOLD,
//   },
//   ornamentSymbol: {
//     color: GOLD,
//     fontSize: 22,
//     marginHorizontal: 12,
//   },
//   coupleContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   iconCircle: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: PARCHMENT,
//     borderWidth: 3,
//     borderColor: GOLD,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   coupleEmoji: { fontSize: 44 },
//   brandTitle: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#FFFDF6',
//     marginBottom: 8,
//     letterSpacing: 0.5,
//   },
//   coupleText: {
//     fontSize: 14,
//     color: PARCHMENT,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   trustStrip: {
//     flexDirection: 'row',
//     backgroundColor: 'rgba(251, 238, 219, 0.12)',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: 'rgba(212, 175, 55, 0.4)',
//     paddingVertical: 14,
//     paddingHorizontal: 10,
//     width: '100%',
//     marginBottom: 40,
//   },
//   trustItem: { flex: 1, alignItems: 'center' },
//   trustNumber: { color: GOLD, fontWeight: 'bold', fontSize: 14 },
//   trustLabel: { color: PARCHMENT, fontSize: 11, marginTop: 3 },
//   trustDivider: { width: 1, backgroundColor: 'rgba(212,175,55,0.4)' },
//   buttonsContainer: { width: '100%' },
//   primaryButton: {
//     backgroundColor: MAROON,
//     borderRadius: 14,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: GOLD,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderRadius: 14,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1.5,
//     borderColor: GOLD,
//   },
//   buttonIcon: { fontSize: 20, marginRight: 10 },
//   buttonIconGold: { fontSize: 20, marginRight: 10 },
//   primaryButtonText: {
//     color: '#FFFDF6',
//     fontSize: 16,
//     fontWeight: 'bold',
//     letterSpacing: 0.3,
//   },
//   secondaryButtonText: {
//     color: GOLD,
//     fontSize: 16,
//     fontWeight: 'bold',
//     letterSpacing: 0.3,
//   },
//   bottomOrnament: { marginTop: 34, width: '40%' },
// });


import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MAROON = '#93210A';
const GOLD = '#242320';
const PARCHMENT = '#FBEEDB';

const MatrimonyBtn = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://img.magnific.com/free-photo/hands-indian-bride-groom-intertwined-together-making-authentic-wedding-ritual_8353-10047.jpg?semt=ais_hybrid&w=740&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(232,195,158,0.30)',
            'rgba(147,33,10,0.50)',
            'rgba(48,25,19,0.80)',
          ]}
          style={styles.gradientOverlay}
        >
          <View style={styles.contentWrap}>

            <View style={styles.topOrnament}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentSymbol}>ॐ</Text>
              <View style={styles.ornamentLine} />
            </View>

            <View style={styles.brandBlock}>
              <Text style={styles.brandTitle}>Partner Matrimony</Text>
              <Text style={styles.brandSubtitle}>Find a life partner rooted in tradition</Text>
            </View>

            <View style={{ flex: 1 }} />

            <View style={styles.cardWrap}>
              <BlurView intensity={45} tint="light" style={styles.glassPanel}>
                <View style={styles.glassInner}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('CreateProfile')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryButtonText}>Create Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('MatrimoneyProfiles')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.secondaryButtonText}>Browse Profiles</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>

            <View style={{ flex: 1 }} />

          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default MatrimonyBtn;

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { width, height },
  gradientOverlay: { flex: 1 },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
  },
  topOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  ornamentLine: { width: 44, height: 1.5, backgroundColor: GOLD },
  ornamentSymbol: { color: GOLD, fontSize: 20, marginHorizontal: 12 },
  brandBlock: { alignItems: 'center' },
  brandTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFDF6',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  brandSubtitle: {
    fontSize: 14,
    color: PARCHMENT,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  cardWrap: { alignItems: 'center', justifyContent: 'center' },
  glassPanel: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.55)',
    width: '100%',
  },
  glassInner: {
    backgroundColor: 'rgba(251,238,219,0.16)',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: MAROON,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: GOLD,
    backgroundColor: 'rgba(251,238,219,0.10)',
  },
  primaryButtonText: {
    color: '#FFFDF6',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  secondaryButtonText: {
    color: GOLD,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
});