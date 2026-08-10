import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
  Image,
  Modal as RNModal,
  FlatList,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const MAROON = "#93210A";
const GOLD = "#D4AF37";
const PARCHMENT = "#FBEEDB";
const CARD_BG = "#FFFDF6";
const DARK_BROWN = "#301913";

const UPI_ID = "upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=101&cu=INR";
const AMOUNT = 101;

const GENDER_OPTIONS = ["Male", "Female"];
const RELIGION_OPTIONS = ["Hindu", "Christian", "Muslim", "Sikh", "Other"];
const CASTE_OPTIONS = [
  "Iyer", "Iyengar", "Mudaliar", "Naidu", "Nadar", "Vanniyar",
  "Gounder", "Chettiar", "Pillai", "Reddiar", "Yadava",
  "Adi Dravidar", "Other",
];
const PROFESSION_OPTIONS = [
  "IT / Software", "Government Employee", "Business / Self-Employed",
  "Doctor / Medical", "Teacher / Education", "Engineer", "Other",
];
const DISTRICT_OPTIONS = [
  "Coimbatore", "Chennai", "Madurai", "Salem", "Trichy",
  "Tirunelveli", "Erode", "Vellore", "Other",
];

const CreateMatrimonyProfile = () => {
  const navigation = useNavigation();
  const { userData } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [dropdownData, setDropdownData] = useState([]);

  const [formData, setFormData] = useState({
    userId: userData?.id || "",
    imageUrl: "",
    jathagamUrl: "",
    name: "",
    gender: "",
    dob: "",
    age: "",
    height: "",
    natchathiram: "",
    raasi: "",
    timeOfBirth: "",
    religion: "",
    caste: "",
    father: "",
    mother: "",
    fatherWork: "",
    motherWork: "",
    address: "",
    district: "",
    motherTongue: "",
    education: "",
    profession: "",
    salary: "",
    workLocation: "",
    preferredAge: "",
    preferredDistrict: "",
    preferredEducation: "",
    phone: "",
    paymentTransactionId: "",
    paymentStatus: "pending",
  });

  const [errors, setErrors] = useState({});

  const validateStep = (stepNum) => {
    let newErrors = {};

    switch (stepNum) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.age) newErrors.age = "Age is required";
        else if (isNaN(formData.age) || formData.age < 18 || formData.age > 100)
          newErrors.age = "Age must be between 18 and 100";
        if (!formData.height) newErrors.height = "Height is required";
        if (!formData.imageUrl) newErrors.imageUrl = "Profile image is required";
        break;

      case 2:
        if (!formData.religion) newErrors.religion = "Religion is required";
        if (!formData.caste) newErrors.caste = "Caste is required";
        break;

      case 3:
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.motherTongue) newErrors.motherTongue = "Mother tongue is required";
        break;

      case 4:
        if (!formData.education) newErrors.education = "Education is required";
        if (!formData.profession) newErrors.profession = "Profession is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(formData.phone))
          newErrors.phone = "Enter valid 10-digit phone number";
        break;

      case 5:
        if (!formData.preferredAge) newErrors.preferredAge = "Preferred age range is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key, value) => {
    if (key === "dob") {
      const age = calculateAge(value);
      setFormData({ ...formData, [key]: value, age: age.toString() });
    } else if (key === "phone") {
      const cleaned = value.replace(/[^0-9]/g, '');
      if (cleaned.length <= 10) {
        setFormData({ ...formData, [key]: cleaned });
      }
    } else {
      setFormData({ ...formData, [key]: value });
    }
    if (errors[key]) setErrors({ ...errors, [key]: null });
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const parts = dobString.split('/');
    if (parts.length !== 3) return "";
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (isNaN(date.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age > 0 ? age : "";
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      handleChange("dob", formattedDate);
    }
  };

  const pickImage = async (imageType) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "You need to allow gallery access to upload images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setUploadingImages(true);
      const asset = result.assets[0];
      const uploadFormData = new FormData();
      uploadFormData.append("file", {
        uri: asset.uri,
        type: "image/jpeg",
        name: asset.fileName || `${imageType}_${Date.now()}.jpg`,
      });

      try {
        const res = await axios.post(
          "https://hdrss-backend.onrender.com/api/upload",
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.fileUrl) {
          handleChange(imageType, res.data.fileUrl);
          Alert.alert("Success", `${imageType === "imageUrl" ? "Profile" : "Jathagam"} image uploaded successfully`);
        } else {
          Alert.alert("Error", "Failed to get image URL from server");
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      } finally {
        setUploadingImages(false);
      }
    }
  };

  const initiatePayment = () => {
    setShowPaymentModal(true);
    setPaymentStatus("pending");
  };

  const openUpiApp = () => {
    const upiUrl = `upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=101&cu=INR`;
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert(
        "UPI App Not Found",
        `Please manually transfer ₹${AMOUNT} to UPI ID: ${UPI_ID}\n\nAfter payment, enter the Transaction ID below.`,
        [{ text: "OK", onPress: () => setPaymentStatus("manual") }]
      );
    });
  };

  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      Alert.alert("Error", "Please enter the Transaction ID");
      return;
    }
    setPaymentStatus("verifying");
    try {
      handleChange("paymentTransactionId", transactionId);
      handleChange("paymentStatus", "completed");
      setPaymentStatus("success");

      setTimeout(() => {
        setShowPaymentModal(false);
        createProfile();
      }, 1500);
    } catch (error) {
      Alert.alert("Verification Failed", "Could not verify payment. Please try again or contact support.");
      setPaymentStatus("failed");
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      Alert.alert("Validation Error", "Please fill all required fields correctly");
    }
  };

  const prevStep = () => setStep(step - 1);

  const createProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.17:5000/api/matrimony/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile created successfully! Your registration is complete.");
        setFormData({
          userId: userData?.id || "",
          imageUrl: "",
          jathagamUrl: "",
          name: "",
          gender: "",
          dob: "",
          age: "",
          height: "",
          natchathiram: "",
          raasi: "",
          timeOfBirth: "",
          religion: "",
          caste: "",
          father: "",
          mother: "",
          fatherWork: "",
          motherWork: "",
          address: "",
          district: "",
          motherTongue: "",
          education: "",
          profession: "",
          salary: "",
          workLocation: "",
          preferredAge: "",
          preferredDistrict: "",
          preferredEducation: "",
          phone: "",
          paymentTransactionId: "",
          paymentStatus: "pending",
        });
        setStep(1);
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithPayment = () => {
    if (validateStep(5)) {
      if (!formData.imageUrl) {
        Alert.alert("Error", "Please upload a profile image");
        return;
      }
      initiatePayment();
    }
  };

  const openDropdown = (field, options) => {
    setDropdownData(options);
    setDropdownVisible(field);
  };

  const selectOption = (field, value) => {
    handleChange(field, value);
    setDropdownVisible(null);
  };

  const renderDropdown = () => {
    if (!dropdownVisible) return null;
    
    return (
      <RNModal
        transparent={true}
        animationType="fade"
        visible={!!dropdownVisible}
        onRequestClose={() => setDropdownVisible(null)}
      >
        <TouchableOpacity 
          style={styles.dropdownOverlay} 
          activeOpacity={1} 
          onPress={() => setDropdownVisible(null)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={dropdownData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => selectOption(dropdownVisible, item)}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownHeaderText}>Select Option</Text>
                </View>
              }
            />
          </View>
        </TouchableOpacity>
      </RNModal>
    );
  };

  const renderInput = (placeholder, key, options = {}) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#b89a86"
        style={[styles.input, errors[key] && styles.inputError]}
        value={formData[key]}
        onChangeText={(text) => handleChange(key, text)}
        keyboardType={options.keyboardType || "default"}
        editable={!options.disabled}
        maxLength={options.maxLength}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderSelectInput = (label, key, options) => {
    const isOther = formData[key] === "Other";
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TouchableOpacity
          style={[styles.input, styles.selectInput, errors[key] && styles.inputError]}
          onPress={() => openDropdown(key, options)}
        >
          <Text style={formData[key] ? styles.selectText : styles.placeholderText}>
            {formData[key] || `Select ${label}`}
          </Text>
          <Text style={styles.dropdownArrow}>▾</Text>
        </TouchableOpacity>
        {isOther && (
          <TextInput
            style={[styles.input, styles.otherInput, errors[key] && styles.inputError]}
            placeholder={`Specify ${label}`}
            placeholderTextColor="#b89a86"
            value={formData[`${key}Other`] || ""}
            onChangeText={(text) => handleChange(key, text)}
          />
        )}
        {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
      </View>
    );
  };

  const renderChipSelector = (label, key, options) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.chipsWrap}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, formData[key] === opt && styles.chipActive]}
            onPress={() => handleChange(key, opt)}
          >
            <Text style={[styles.chipText, formData[key] === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderCard = (children) => <View style={styles.card}>{children}</View>;

  const renderStep1 = () => (
    <View>
      {renderCard(
        <>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={() => pickImage("imageUrl")}
              disabled={uploadingImages}
              activeOpacity={0.85}
            >
              {uploadingImages ? (
                <ActivityIndicator color={MAROON} />
              ) : formData.imageUrl ? (
                <Image source={{ uri: formData.imageUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarPlaceholder}>+</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {formData.imageUrl ? "Tap to change profile photo" : "Add Profile Photo *"}
            </Text>
            {errors.imageUrl && <Text style={styles.errorText}>{errors.imageUrl}</Text>}

            <TouchableOpacity
              style={styles.jathagamLink}
              onPress={() => pickImage("jathagamUrl")}
              disabled={uploadingImages}
            >
              <Text style={styles.jathagamLinkText}>
                {formData.jathagamUrl ? "✓ Jathagam uploaded — tap to change" : "+ Add Jathagam Image (optional)"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {renderCard(
        <>
          {renderInput("Full Name", "name")}
          {renderChipSelector("Gender", "gender", GENDER_OPTIONS)}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={formData.dob ? styles.dateText : styles.placeholderText}>
                {formData.dob || "DD/MM/YYYY"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dob ? new Date(formData.dob.split('/').reverse().join('-')) : new Date(2000, 0, 1)}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          </View>

          {renderInput("Age", "age", { keyboardType: "numeric", disabled: true })}
          {renderInput("Height (cm)", "height", { keyboardType: "numeric" })}
        </>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      {renderCard(
        <>
          {renderInput("Natchathiram (Birth Star)", "natchathiram")}
          {renderInput("Raasi (Zodiac)", "raasi")}
          {renderInput("Time of Birth (HH:MM)", "timeOfBirth")}
          {renderSelectInput("Religion", "religion", RELIGION_OPTIONS)}
          {renderSelectInput("Caste / Community", "caste", CASTE_OPTIONS)}
        </>
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton} onPress={prevStep}>
          <Text style={styles.outlineButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={nextStep}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      {renderCard(
        <>
          {renderInput("Father's Name", "father")}
          {renderInput("Mother's Name", "mother")}
          {renderInput("Father's Occupation", "fatherWork")}
          {renderInput("Mother's Occupation", "motherWork")}
          {renderInput("Full Address", "address")}
          {renderInput("District", "district")}
          {renderInput("Mother Tongue", "motherTongue")}
        </>
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton} onPress={prevStep}>
          <Text style={styles.outlineButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={nextStep}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      {renderCard(
        <>
          {renderInput("Highest Education", "education")}
          {renderSelectInput("Profession", "profession", PROFESSION_OPTIONS)}
          {renderInput("Annual Salary (Lakhs)", "salary", { keyboardType: "numeric" })}
          {renderInput("Work Location", "workLocation")}
          {renderInput("Phone Number", "phone", { keyboardType: "phone-pad", maxLength: 10 })}
        </>
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton} onPress={prevStep}>
          <Text style={styles.outlineButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonHalf} onPress={nextStep}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      {renderCard(
        <>
          {renderInput("Preferred Age Range (e.g., 25-30)", "preferredAge")}
          {renderSelectInput("Preferred District", "preferredDistrict", DISTRICT_OPTIONS)}
          {renderInput("Preferred Education Level", "preferredEducation")}
        </>
      )}

      <View style={styles.paymentInfoCard}>
        <Text style={styles.paymentInfoLabel}>Registration Fee</Text>
        <Text style={styles.paymentInfoAmount}>₹{AMOUNT}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.outlineButton} onPress={prevStep}>
          <Text style={styles.outlineButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButtonHalf, loading && styles.disabledButton]}
          onPress={handleSubmitWithPayment}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Processing..." : `Pay ₹${AMOUNT} & Submit`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent
      animationType="slide"
      onRequestClose={() => paymentStatus !== "verifying" && setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTopLine} />
          <Text style={styles.modalTitle}>Complete Payment</Text>

          {paymentStatus === "pending" && (
            <>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>₹{AMOUNT}</Text>
                <Text style={styles.paymentUpi}>UPI ID: {UPI_ID}</Text>
              </View>

              <TouchableOpacity style={styles.payButton} onPress={openUpiApp}>
                <Text style={styles.payButtonText}>Pay with UPI App</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                style={styles.transactionInput}
                placeholder="Enter Transaction ID after payment"
                placeholderTextColor="#b89a86"
                value={transactionId}
                onChangeText={setTransactionId}
              />

              <TouchableOpacity style={styles.confirmButton} onPress={confirmPayment}>
                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {paymentStatus === "verifying" && (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator size="large" color={MAROON} />
              <Text style={styles.verifyingText}>Verifying Payment...</Text>
            </View>
          )}

          {paymentStatus === "success" && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>Payment Successful!</Text>
              <Text style={styles.successSubtext}>Creating your profile...</Text>
            </View>
          )}

          {paymentStatus === "failed" && (
            <View style={styles.failedContainer}>
              <Text style={styles.failedIcon}>✗</Text>
              <Text style={styles.failedText}>Payment Verification Failed</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setPaymentStatus("pending")}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <View style={styles.backCircle}>
              <Text style={styles.backButtonText}>‹</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Create Matrimony Profile</Text>
          <View style={styles.headerRight} />
        </View>
        
        <Text style={styles.stepLabel}>
          Step {step} of 5
        </Text>

        <View style={styles.progressTrack}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[styles.progressSegment, step >= s && styles.progressSegmentActive]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </View>
      </ScrollView>

      {renderPaymentModal()}
      {renderDropdown()}
    </SafeAreaView>
  );
};

export default CreateMatrimonyProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PARCHMENT,
  },
  
  header: {
    backgroundColor: MAROON,
    paddingTop: 12,
    paddingBottom: 29,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    alignItems: "center",
  },
  
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 9,
  },
  
  backButton: {
    padding: 4,
  },
  
  backCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    top:18
  },
  
  backButtonText: {
    fontSize: 36,
    color: "#FFFDF6",
    fontWeight: "300",
    lineHeight: 32,
   
  },
  
  title: { 
    fontSize: 19, 
    fontWeight: "bold", 
    color: "#FFFDF6", 
    textAlign: "center",
    flex: 1,
    marginLeft: 4,
    top:18
  },
  
  headerRight: {
    width: 48,
  },
  
  stepLabel: { 
    fontSize: 13, 
    color: GOLD, 
    marginTop: 4, 
    fontWeight: "600" 
  },
  
  progressTrack: { 
    flexDirection: "row", 
    marginTop: 12, 
    width: "100%" 
  },
  
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(251,238,219,0.25)",
    borderRadius: 2,
    marginHorizontal: 3,
  },
  
  progressSegmentActive: { 
    backgroundColor: GOLD 
  },

  scrollContainer: {
    flex: 1,
  },

  body: { 
    padding: 18, 
    paddingBottom: 40 
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  avatarSection: { 
    alignItems: "center" 
  },
  
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: PARCHMENT,
    borderWidth: 3,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  
  avatarImage: { 
    width: "100%", 
    height: "100%" 
  },
  
  avatarPlaceholder: { 
    fontSize: 40, 
    color: MAROON, 
    fontWeight: "300" 
  },
  
  avatarLabel: { 
    fontSize: 13, 
    color: "#7a5c4f", 
    fontWeight: "600" 
  },
  
  jathagamLink: { 
    marginTop: 14 
  },
  
  jathagamLinkText: { 
    fontSize: 13, 
    color: MAROON, 
    fontWeight: "600", 
    textDecorationLine: "underline" 
  },

  inputWrapper: { 
    marginBottom: 16 
  },
  
  inputLabel: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: DARK_BROWN, 
    marginBottom: 6 
  },
  
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.4)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    backgroundColor: "#fff",
    color: DARK_BROWN,
  },
  
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  selectText: { 
    fontSize: 15, 
    color: DARK_BROWN 
  },
  
  dropdownArrow: { 
    fontSize: 18, 
    color: MAROON 
  },
  
  otherInput: { 
    marginTop: 8 
  },
  
  dateInput: { 
    justifyContent: "center" 
  },
  
  dateText: { 
    fontSize: 15, 
    color: DARK_BROWN 
  },
  
  placeholderText: { 
    fontSize: 15, 
    color: "#b89a86" 
  },
  
  inputError: { 
    borderColor: "#c0392b" 
  },
  
  errorText: { 
    color: "#c0392b", 
    fontSize: 12, 
    marginTop: 4 
  },

  chipsWrap: { 
    flexDirection: "row", 
    flexWrap: "wrap" 
  },
  
  chip: {
    borderWidth: 1.5,
    borderColor: MAROON,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  
  chipActive: { 
    backgroundColor: MAROON 
  },
  
  chipText: { 
    fontSize: 13, 
    color: MAROON, 
    fontWeight: "600" 
  },
  
  chipTextActive: { 
    color: "#FFFDF6" 
  },

  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(48,25,19,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  dropdownContainer: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    width: "85%",
    maxHeight: "50%",
    borderWidth: 1,
    borderColor: GOLD,
    overflow: "hidden",
  },
  
  dropdownHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.3)",
    backgroundColor: MAROON,
  },
  
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFDF6",
    textAlign: "center",
  },
  
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.2)",
  },
  
  dropdownItemText: {
    fontSize: 15,
    color: DARK_BROWN,
  },

  primaryButton: {
    backgroundColor: MAROON,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: MAROON,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  primaryButtonHalf: {
    backgroundColor: MAROON,
    flex: 1,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: GOLD,
  },
  
  outlineButton: {
    flex: 1,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: MAROON,
    backgroundColor: "transparent",
  },
  
  outlineButtonText: { 
    color: MAROON, 
    fontWeight: "bold", 
    fontSize: 15 
  },
  
  primaryButtonText: { 
    color: "#FFFDF6", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  
  disabledButton: { 
    backgroundColor: "#c9a99f", 
    borderColor: "#c9a99f", 
    shadowOpacity: 0 
  },
  
  row: { 
    flexDirection: "row", 
    marginTop: 4, 
    marginBottom: 30 
  },

  paymentInfoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 6,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  
  paymentInfoLabel: { 
    fontSize: 13, 
    color: "#7a5c4f", 
    fontWeight: "600" 
  },
  
  paymentInfoAmount: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: MAROON, 
    marginTop: 4 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(48,25,19,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    backgroundColor: PARCHMENT,
    borderRadius: 24,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.4)",
  },
  
  modalTopLine: { 
    width: 40, 
    height: 3, 
    backgroundColor: GOLD, 
    borderRadius: 2, 
    marginBottom: 14 
  },
  
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: MAROON, 
    marginBottom: 20 
  },
  
  paymentDetails: { 
    alignItems: "center", 
    marginBottom: 20 
  },
  
  paymentAmount: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: MAROON 
  },
  
  paymentUpi: { 
    fontSize: 13, 
    color: "#7a5c4f", 
    marginTop: 5 
  },
  
  payButton: {
    backgroundColor: MAROON,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: GOLD,
  },
  
  payButtonText: { 
    color: "#FFFDF6", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  
  divider: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 12, 
    width: "100%" 
  },
  
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: "rgba(212,175,55,0.4)" 
  },
  
  dividerText: { 
    marginHorizontal: 10, 
    color: "#7a5c4f", 
    fontSize: 12 
  },
  
  transactionInput: {
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.4)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 14,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff",
    color: DARK_BROWN,
  },
  
  confirmButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 13,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  
  confirmButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  
  cancelButton: { 
    paddingVertical: 8 
  },
  
  cancelButtonText: { 
    color: "#7a5c4f", 
    fontSize: 14 
  },
  
  verifyingContainer: { 
    alignItems: "center", 
    paddingVertical: 26 
  },
  
  verifyingText: { 
    marginTop: 14, 
    fontSize: 15, 
    color: "#7a5c4f" 
  },
  
  successContainer: { 
    alignItems: "center", 
    paddingVertical: 26 
  },
  
  successIcon: { 
    fontSize: 54, 
    color: "#2e7d32", 
    marginBottom: 12 
  },
  
  successText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#2e7d32", 
    marginBottom: 4 
  },
  
  successSubtext: { 
    fontSize: 13, 
    color: "#7a5c4f" 
  },
  
  failedContainer: { 
    alignItems: "center", 
    paddingVertical: 26 
  },
  
  failedIcon: { 
    fontSize: 54, 
    color: "#c0392b", 
    marginBottom: 12 
  },
  
  failedText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#c0392b", 
    marginBottom: 14 
  },
  
  retryButton: { 
    backgroundColor: MAROON, 
    paddingVertical: 10, 
    paddingHorizontal: 22, 
    borderRadius: 10 
  },
  
  retryButtonText: { 
    color: "#FFFDF6", 
    fontWeight: "bold" 
  },
});