import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function PrinciplesScreen({ navigation }) {

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Principles content array - Cleaned up text
  const principles = [
    {
      id: 1,
      tamil: "வைரம், வைணவம், சாக்தம், கௌமாரம், காணபத்தியம், சௌரம் என்று ஆறு சங்கர் அடைவில் வண்பொருத்திருதும், வள்ளல் பெருமாள் அடைவில் சுக்த சண்பார்க்ஷையும், ராகவேகரர் அடைவில் மாத்துவா மார்க்கத்தையும் மொக்கும் மற்றும் சிக்கியம் மார்க்கங்களை ஒன்றிலணைத்து இந்து மாமாக போற்றி காக்கல்",
      english: "Protecting and promoting the six traditional Hindu schools of worship - Shaivam, Vaishnavism, Shaktism, Kaumaram, Ganapathyam, and Sauram - along with Jainism, Buddhism, and Sikhism as part of the unified Hindu Dharma tradition."
    },
    {
      id: 2,
      tamil: "இந்தியாவை ஒரு இந்து நாட்டாக மாற்றுவது மற்றும் இந்துப் பண்பாடு மற்றும் விழுமியங்களை ஊக்குவித்தல், இந்திப் அடைவடுக்கும் பொறு சிவில் சட்டம் போன்ற இணக்குகளை அடையப செய்தல்",
      english: "Working towards establishing India as a Hindu nation and promoting Hindu culture, values, and unified civil code for all Hindu denominations."
    },
    {
      id: 3,
      tamil: "சாதி வெறியைத் தூண்டும் சங்கங்கள் மற்றும் மதமாற்றம் செய்யும் அமைப்புகளை தடை செய்தல்",
      english: "Opposing caste-based discrimination and preventing forced religious conversions."
    },
    {
      id: 4,
      tamil: "ஆபாசமாகப் பெண்களைச் சித்தரிக்கும் ஊடகங்களையும், அவைகள் சுகாட்டங்களையும் மதநடைகளையும், போதைப் பொருட்களையும் நிரந்தரமாக கிந்தனை இனற்றி தடை செய்தல்",
      english: "Banning media that depicts women inappropriately, preventing drug abuse, and stopping activities that harm cultural values and youth."
    },
    {
      id: 5,
      tamil: "ஆலயங்களின் நிர்வாகத்தை அரசு மற்றும் அரசியல் சார்பின்ற அமைவோர் வாரியத்தில் ஒப்படைக்க செய்தல் மற்றும் சித்தம் அடைந்த கோயில்களை புராமாந்து தடுமுபக்க மற்றும் உறவாரப்பணி சேர்ப்ப இனஞ்சீரனை ஒன்றிநைத்தல்",
      english: "Ensuring temple administration is free from government and political interference, and restoring ancient temples while preserving archaeological heritage."
    },
    {
      id: 6,
      tamil: "இந்து தர்மத்தில் பிறந்த அனைவரின் பொருளாதாரம், கல்வி, வேலையாய்ப்பு மேம்பாட்டுதல், இந்து மகத்தீ காயாகமப், கடவுளாகம் வணங்க கூடிய பக் வமனு குற்பத்தளம், அதை பராமரிக்க கோ சாலை அமைதல்",
      english: "Promoting economic development, education, and employment opportunities for all members of the Hindu community."
    },
    {
      id: 7,
      tamil: "இந்து தர்ம போதனைகளையும், அறம் சார்ந்த கொள்கைகளையும், இத்திகாசங்கள், நூங்கள் மற்றும் மறையனின் பெருமையையும், உண்மையத்தன்மையையும் அடுத்த தலைமுறைக்கு கொண்டு செர்த்தல்",
      english: "Teaching Hindu Dharma principles, ethical values, epics, scriptures, and Vedic knowledge to the next generation."
    },
    {
      id: 8,
      tamil: "இளம் தலைமுறைக்கு கல்வி, விழிப்போன மற்றும் தற்காப்புக்கலை, அறம், கலை, கற்பித்து தேசம் காக்கவும், தேசம் முன்னேறவும், சுய ஒழுக்கத்துடன் வாழவும் உக்கவித்தல்",
      english: "Educating youth in self-defense, ethics, arts, and discipline to protect the nation, promote progress, and live with moral values."
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#7f1d1d"
        barStyle="light-content"
      />

      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          இந்து தர்ம ரக்ஷ சேனா - கொள்கைகள்
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isTablet && styles.scrollContainerTablet,
        ]}
      >
        {/* MOTTO SECTION */}
        <View style={styles.mottoCard}>
          <Text style={styles.mottoText}>
            தேசம் காப்போம் !  தெய்வீகம் காப்போம் !!
          </Text>
          <Text style={styles.mottoEnglish}>
            Let's Protect Our Nation!  Let's Protect Divinity!!
          </Text>
        </View>

        {/* MAP PRINCIPLES DATA */}
        {principles.map((principle, index) => (
          <View key={principle.id} style={styles.card}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            
            <Text style={styles.englishText}>
              {principle.english}
            </Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.tamilText}>
              {principle.tamil}
            </Text>
          </View>
        ))}

        {/* CLOSING CARD */}
        <View style={styles.closingCard}>
          <Text style={styles.closingText}>
            இந்து மதம் காக்க மட்டும் அல்ல, இந்து மதத்தை வாழ்விக்கும் பணியிலும் ஈடுபடுவோம்!
          </Text>
          <Text style={styles.closingEnglish}>
            Let's not only protect Hinduism but also actively work to live by its principles!
          </Text>
          <Text style={styles.orgName}>
            இந்து தர்ம ரக்ஷ சேனா
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/About/RamaSandilyan.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>Dr. Rama Sandilyan</Text>
            <Text style={styles.nameTamil}>முனைவர் இராம சாண்டில்யன்</Text>
            <Text style={styles.designationText}>Founder / Leader</Text>
            <Text style={styles.designationTamil}>நிறுவனர் / தலைவர்</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* HEADER */
  header: {
    backgroundColor: "#7f1d1d",
    paddingTop: 25,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 5,
    position: 'relative',
  },

  headerTablet: {
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    zIndex: 10,
    padding: 5,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 17,
    marginTop: 15,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  headerTitleTablet: {
    fontSize: 32,
    letterSpacing: 1,
  },

  /* SCROLL */
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  scrollContainerTablet: {
    paddingHorizontal: 50,
    paddingVertical: 25,
  },

  /* MOTTO CARD */
  mottoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#a72828",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  mottoText: {
    color: "#7f1d1d",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  mottoEnglish: {
    color: "#a72828",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    paddingRight: 55,
    marginBottom: 16,
    elevation: 3,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  numberBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#a72828',
    width: 26,
    height: 26,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  numberText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ENGLISH */
  englishText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
    letterSpacing: 0.2,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },

  /* TAMIL */
  tamilText: {
    color: "#444",
    fontSize: 14,
    lineHeight: 28,
    fontWeight: "400",
    textAlign: "justify",
    letterSpacing: 0.3,
  },

  /* CLOSING CARD */
  closingCard: {
    backgroundColor: "#fff8f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#a72828",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  closingText: {
    color: "#7f1d1d",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
    letterSpacing: 0.5,
  },

  closingEnglish: {
    color: "#a72828",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: 0.3,
  },

  orgName: {
    color: "#a72828",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  /* PROFILE CARD */
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#a72828",
    marginBottom: 16,
    elevation: 5,
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profileInfo: {
    alignItems: "center",
  },

  nameText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  nameTamil: {
    color: "#555",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  designationText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 2,
    letterSpacing: 0.3,
  },

  designationTamil: {
    color: "#777",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});