import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const CameraScannerScreen = ({ navigation, route }) => {
  const [cameraMode, setCameraMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    console.log('Camera Scanner initialized');
  }, []);

  const handleCameraCapture = async () => {
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      setCapturedImage(photo);
      setCameraMode(false);
      await processImageWithML(photo);
    } catch (error) {
      console.error('Camera capture error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleGalleryPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setCapturedImage(selectedImage);
        await processImageWithML(selectedImage);
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const processImageWithML = async (imageData) => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = generateMockMLResult(imageData);
      setAnalysisResult(mockResult);
      setIsProcessing(false);
      setShowResults(true);
    } catch (error) {
      console.error('ML processing error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    }
  };

  const generateMockMLResult = (imageData) => {
    const imageSize = imageData.base64?.length || Math.random() * 1000000;
    const seed = (imageSize % 1000) / 1000;
    
    const wasteTypes = {
      biodegradable: [
        {
          type: 'Organic Waste',
          description: 'Food scraps, fruit peels, vegetable matter',
          color: '#4ECDC4',
          recyclingTip: 'Perfect for composting! Start a home compost bin.',
          environmentalImpact: 'Decomposes naturally within 2-8 weeks'
        },
        {
          type: 'Paper & Cardboard',
          description: 'Paper products, cardboard packaging',
          color: '#45B7D1',
          recyclingTip: 'Remove tape and staples before recycling.',
          environmentalImpact: 'Saves trees and reduces landfill waste'
        }
      ],
      nonBiodegradable: [
        {
          type: 'Plastic Waste',
          description: 'Plastic bottles, containers, packaging',
          color: '#FF6B6B',
          recyclingTip: 'Clean thoroughly and check recycling symbols.',
          environmentalImpact: 'Takes 450+ years to decompose'
        },
        {
          type: 'Metal Containers',
          description: 'Aluminum cans, tin containers',
          color: '#FFEAA7',
          recyclingTip: 'Rinse clean and crush to save space.',
          environmentalImpact: 'Infinitely recyclable, saves 95% energy'
        }
      ]
    };

    const isBiodegradable = seed > 0.5;
    const category = isBiodegradable ? wasteTypes.biodegradable : wasteTypes.nonBiodegradable;
    const selectedWaste = category[Math.floor(seed * category.length)];
    
    return {
      ...selectedWaste,
      category: isBiodegradable ? 'Biodegradable' : 'Non-Biodegradable',
      confidence: 0.75 + (seed * 0.23),
      isBiodegradable,
      timestamp: new Date().toISOString(),
      processingTime: '2.1s',
      modelVersion: 'MobileNetV2-WasteClassifier-v2.0'
    };
  };

  const openCamera = async () => {
    if (!permission) return;
    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }
    setCameraMode(true);
  };

  const resetScreen = () => {
    setCameraMode(false);
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowResults(false);
    setIsProcessing(false);
  };

  const handleSchedulePickup = () => {
    setShowResults(false);
    navigation.navigate('SchedulePickup', {
      preselectedWasteType: analysisResult?.type,
      scanData: analysisResult,
    });
  };

  const renderMainOptions = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waste Scanner</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionCard}>
          <Ionicons name="scan" size={60} color={COLORS.primary} />
          <Text style={styles.instructionTitle}>AI-Powered Waste Analysis</Text>
          <Text style={styles.instructionText}>
            Take a photo or upload an image to identify waste type and get recycling recommendations
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, styles.cameraButton]}
            onPress={openCamera}
          >
            <Ionicons name="camera" size={32} color="white" />
            <View style={styles.optionButtonContent}>
              <Text style={styles.optionButtonText}>Take Photo</Text>
              <Text style={styles.optionButtonSubtext}>Use camera to capture</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, styles.galleryButton]}
            onPress={handleGalleryPick}
          >
            <Ionicons name="images" size={32} color="white" />
            <View style={styles.optionButtonContent}>
              <Text style={styles.optionButtonText}>Choose from Gallery</Text>
              <Text style={styles.optionButtonSubtext}>Select existing photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {capturedImage && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.sectionTitle}>Selected Image</Text>
            <Image source={{ uri: capturedImage.uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.resetButton} onPress={resetScreen}>
              <Text style={styles.resetButtonText}>Choose Different Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity 
              style={styles.cameraCloseButton}
              onPress={() => setCameraMode(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Position waste item in frame</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.cameraFrame}>
            <View style={styles.frameCorner} />
            <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={handleCameraCapture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );

  const renderProcessing = () => (
    <Modal visible={isProcessing} transparent={true}>
      <View style={styles.processingOverlay}>
        <View style={styles.processingCard}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.processingTitle}>Analyzing Image</Text>
          <Text style={styles.processingText}>
            Our AI is identifying the waste type and providing recycling recommendations...
          </Text>
        </View>
      </View>
    </Modal>
  );

  const renderResults = () => (
    <Modal visible={showResults} animationType="slide" transparent={true}>
      <View style={styles.resultsOverlay}>
        <View style={styles.resultsContainer}>
          <ScrollView style={styles.resultsContent} showsVerticalScrollIndicator={false}>
            <View style={styles.resultsHeader}>
              <TouchableOpacity 
                style={styles.resultsCloseButton}
                onPress={() => setShowResults(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.resultsTitle}>Analysis Results</Text>
              <View style={styles.headerSpacer} />
            </View>

            {capturedImage && (
              <Image source={{ uri: capturedImage.uri }} style={styles.resultImage} />
            )}

            {analysisResult && (
              <>
                <View style={[styles.resultCard, { backgroundColor: analysisResult.color + '20' }]}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.wasteType}>{analysisResult.type}</Text>
                    <View style={[styles.categoryBadge, { 
                      backgroundColor: analysisResult.isBiodegradable ? '#4ECDC4' : '#FF6B6B' 
                    }]}>
                      <Text style={styles.categoryText}>{analysisResult.category}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.wasteDescription}>{analysisResult.description}</Text>
                  
                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confidence:</Text>
                    <Text style={styles.confidenceValue}>
                      {Math.round(analysisResult.confidence * 100)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>♻️ Recycling Instructions</Text>
                  <Text style={styles.sectionContent}>{analysisResult.recyclingTip}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>🌍 Environmental Impact</Text>
                  <Text style={styles.sectionContent}>{analysisResult.environmentalImpact}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
                  <View style={styles.analysisGrid}>
                    <View style={styles.analysisItem}>
                      <Text style={styles.analysisLabel}>Model</Text>
                      <Text style={styles.analysisValue}>{analysisResult.modelVersion}</Text>
                    </View>
                    <View style={styles.analysisItem}>
                      <Text style={styles.analysisLabel}>Processing Time</Text>
                      <Text style={styles.analysisValue}>{analysisResult.processingTime}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleSchedulePickup}
              >
                <Ionicons name="calendar" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Schedule Pickup</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={resetScreen}
              >
                <Ionicons name="refresh" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Scan Another Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (cameraMode) {
    return renderCamera();
  }

  return (
    <>
      {renderMainOptions()}
      {renderProcessing()}
      {renderResults()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SIZES.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: SIZES.medium,
  },
  instructionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.large,
    alignItems: 'center',
    marginBottom: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: SIZES.medium,
  },
  optionButton: {
    borderRadius: 16,
    padding: SIZES.large,
    alignItems: 'center',
    flexDirection: 'row',
    gap: SIZES.medium,
  },
  optionButtonContent: {
    flex: 1,
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
  },
  galleryButton: {
    backgroundColor: '#7B68EE',
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  optionButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  imagePreviewContainer: {
    marginTop: SIZES.large,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: SIZES.medium,
  },
  resetButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cameraHeader: {
    paddingTop: 50,
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraCloseButton: {
    padding: SIZES.small,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  cameraFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
    borderWidth: 3,
    top: -100,
    left: -100,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  frameCornerTopRight: {
    right: -100,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  frameCornerBottomLeft: {
    bottom: -100,
    top: 'auto',
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  frameCornerBottomRight: {
    bottom: -100,
    right: -100,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraControls: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.large,
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
  },
  processingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  resultsContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
  },
  resultsContent: {
    padding: SIZES.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SIZES.medium,
  },
  resultsCloseButton: {
    padding: SIZES.small,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: SIZES.medium,
  },
  resultCard: {
    borderRadius: 16,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  wasteType: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: SIZES.small,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  wasteDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SIZES.medium,
    lineHeight: 22,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: SIZES.small,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  sectionContent: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  analysisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analysisItem: {
    flex: 1,
  },
  analysisLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionButtons: {
    gap: SIZES.medium,
    paddingTop: SIZES.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScannerScreen;
