import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';
import apiService from '../services/apiService';
import modelService from '../services/modelService';

const { width, height } = Dimensions.get('window');

// Comprehensive waste classification database
const WASTE_CATEGORIES = {
  'Plastic Bottles': {
    confidence: 0.95,
    color: '#FF6B6B',
    description: 'PET bottles, water bottles, soda bottles',
    recyclingInstructions: 'Remove caps and labels, rinse clean',
    environmentalImpact: 'Takes 450 years to decompose',
  },
  'Organic Waste': {
    confidence: 0.89,
    color: '#4ECDC4',
    description: 'Food scraps, fruit peels, vegetable waste',
    recyclingInstructions: 'Suitable for composting',
    environmentalImpact: 'Can be turned into nutrient-rich compost',
  },
  'Paper Cardboard': {
    confidence: 0.87,
    color: '#45B7D1',
    description: 'Newspapers, magazines, cardboard boxes',
    recyclingInstructions: 'Keep dry, remove tape and staples',
    environmentalImpact: 'Saves trees and reduces landfill waste',
  },
  'Glass Containers': {
    confidence: 0.92,
    color: '#96CEB4',
    description: 'Glass bottles, jars, containers',
    recyclingInstructions: 'Remove lids, rinse clean',
    environmentalImpact: '100% recyclable indefinitely',
  },
  'Metal Cans': {
    confidence: 0.88,
    color: '#FFEAA7',
    description: 'Aluminum cans, tin cans, metal containers',
    recyclingInstructions: 'Rinse clean, remove labels',
    environmentalImpact: 'Saves 95% energy when recycled',
  },
  'Electronics': {
    confidence: 0.76,
    color: '#DDA0DD',
    description: 'Phones, batteries, small electronics',
    recyclingInstructions: 'Take to e-waste collection center',
    environmentalImpact: 'Contains valuable metals and toxic materials',
  },
  'Textiles': {
    confidence: 0.73,
    color: '#F4A460',
    description: 'Clothing, fabric, shoes',
    recyclingInstructions: 'Donate if in good condition, recycle if worn out',
    environmentalImpact: 'Fast fashion contributes to pollution',
  },
  'Hazardous Waste': {
    confidence: 0.85,
    color: '#FF4757',
    description: 'Batteries, paint, chemicals, cleaning products',
    recyclingInstructions: 'Take to hazardous waste facility',
    environmentalImpact: 'Can contaminate soil and water',
  },
};

const CameraScannerScreen = ({ navigation, route }) => {
  const [currentStep, setCurrentStep] = useState('camera');
  const [scanResult, setScanResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [simulatedCamera, setSimulatedCamera] = useState(true); // Start with simulation
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const cameraPermission = permission?.granted || false;

  useEffect(() => {
    if (!permission) {
      // Camera permissions are still loading.
      return;
    }

    if (permission.granted) {
      // Use real camera when permission is granted
      setSimulatedCamera(false);
    } else {
      // Use simulated camera when permission is not granted
      setSimulatedCamera(true);
    }
  }, [permission]);

  useEffect(() => {
    // Initialize ML service when component mounts
    const initializeML = async () => {
      try {
        await modelService.loadModel();
        console.log('ML service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize ML service:', error);
      }
    };
    
    initializeML();
  }, []);

  const checkCameraPermission = async () => {
    await requestPermission();
  };

  const takePicture = async () => {
    if (cameraRef.current && !simulatedCamera) {
      try {
        setIsScanning(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        console.log('Photo taken, analyzing with ML...');
        
        // Use our ML service to classify the waste
        const classificationResult = await modelService.classifyWaste(photo.uri, photo.base64);
        
        // Update scan result with ML classification
        setScanResult(classificationResult);
        setIsScanning(false);
        setShowResults(true);
        setCurrentStep('results');
        
      } catch (error) {
        console.error('Error taking picture or classifying:', error);
        setIsScanning(false);
        Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } else {
      // Fallback to simulation using ML service
      startScanning();
    }
  };

  const simulateAIClassification = () => {
    const wasteTypes = Object.keys(WASTE_CATEGORIES);
    const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const category = WASTE_CATEGORIES[randomType];
    
    // Add some randomness to confidence
    const confidenceVariation = (Math.random() - 0.5) * 0.1;
    const finalConfidence = Math.max(0.5, Math.min(0.99, category.confidence + confidenceVariation));
    
    return {
      type: randomType,
      confidence: finalConfidence,
      ...category,
      detectedAt: new Date().toISOString(),
      recommendations: generateRecommendations(randomType),
    };
  };

  const generateRecommendations = (wasteType) => {
    const recommendations = {
      'Plastic Bottles': [
        'Crush the bottle to save space',
        'Check if your local recycling accepts this type',
        'Consider reusing for storage or crafts',
      ],
      'Organic Waste': [
        'Start a home compost bin',
        'Check community composting programs',
        'Reduce food waste by meal planning',
      ],
      'Paper Cardboard': [
        'Break down boxes to save space',
        'Use as packaging material',
        'Check for recycling symbols',
      ],
      'Glass Containers': [
        'Reuse for storage',
        'Remove all labels and adhesive',
        'Separate by color if required',
      ],
      'Metal Cans': [
        'Check for can return programs',
        'Crush to save space',
        'Remove paper labels',
      ],
      'Electronics': [
        'Data wipe before disposal',
        'Check manufacturer take-back programs',
        'Donate if still functional',
      ],
      'Textiles': [
        'Donate to charity if in good condition',
        'Use for cleaning rags',
        'Check textile recycling programs',
      ],
      'Hazardous Waste': [
        'Never put in regular trash',
        'Find nearest hazardous waste collection',
        'Check for manufacturer return programs',
      ],
    };
    
    return recommendations[wasteType] || ['Take to appropriate recycling facility', 'Check local guidelines'];
  };

  const startScanning = async () => {
    if (!simulatedCamera) {
      takePicture();
    } else {
      // Use ML service even for simulated camera
      setIsScanning(true);
      try {
        // Simulate taking a photo and classify with ML
        const result = await modelService.classifyWaste('simulated://image', null);
        setScanResult(result);
        setIsScanning(false);
        setShowResults(true);
        setCurrentStep('results');
      } catch (error) {
        console.error('Error in simulated scan:', error);
        // Fallback to old simulation
        const result = simulateAIClassification();
        setScanResult(result);
        setIsScanning(false);
        setShowResults(true);
        setCurrentStep('results');
      }
    }
  };

  const handleSchedulePickup = () => {
    setShowResults(false);
    navigation.navigate('SchedulePickup', {
      preselectedWasteType: scanResult?.type,
      scanData: scanResult,
    });
  };

  const handleRetry = () => {
    setScanResult(null);
    setShowResults(false);
  };

  const renderCameraView = () => {
    if (!cameraPermission) {
      return (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            Please grant camera permission to scan waste items
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={checkCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (simulatedCamera) {
      return (
        <View style={styles.simulatedCamera}>
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {isScanning && (
                <View style={styles.scanningLine}>
                  <View style={styles.scanningIndicator} />
                </View>
              )}
            </View>
            
            <Text style={styles.instructionText}>
              Position waste item within the frame
            </Text>
            
            {isScanning && (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.scanningText}>Analyzing waste type...</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    // Real camera implementation
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          ratio="16:9"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {isScanning && (
                <View style={styles.scanningLine}>
                  <View style={styles.scanningIndicator} />
                </View>
              )}
            </View>
            
            <Text style={styles.instructionText}>
              Position waste item within the frame
            </Text>
            
            {isScanning && (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.scanningText}>Analyzing waste type...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  };

  const renderResults = () => (
    <Modal
      visible={showResults}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowResults(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.resultsModal}>
          <ScrollView style={styles.resultsContent}>
            <View style={styles.resultsHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowResults(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.resultsTitle}>Scan Results</Text>
            </View>

            {scanResult && (
              <>
                <View style={[styles.wasteTypeCard, { backgroundColor: scanResult.color + '20' }]}>
                  <View style={styles.wasteTypeHeader}>
                    <Text style={styles.wasteTypeName}>{scanResult.type}</Text>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceText}>
                        {Math.round(scanResult.confidence * 100)}% confident
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.wasteDescription}>{scanResult.description}</Text>
                  
                  {/* Category Badge */}
                  <View style={[styles.categoryBadge, { 
                    backgroundColor: scanResult.isBiodegradable ? '#4ECDC4' : '#FF6B6B' 
                  }]}>
                    <Text style={styles.categoryText}>
                      {scanResult.category || (scanResult.isBiodegradable ? 'Biodegradable' : 'Non-Biodegradable')}
                    </Text>
                  </View>
                </View>

                {/* ML Analysis Details */}
                {scanResult.mlAnalysis && (
                  <View style={styles.mlAnalysisSection}>
                    <Text style={styles.sectionTitle}>🤖 AI Analysis</Text>
                    <View style={styles.mlDetailsGrid}>
                      <View style={styles.mlDetail}>
                        <Text style={styles.mlDetailLabel}>Model</Text>
                        <Text style={styles.mlDetailValue}>{scanResult.mlAnalysis.modelVersion}</Text>
                      </View>
                      <View style={styles.mlDetail}>
                        <Text style={styles.mlDetailLabel}>Processing Time</Text>
                        <Text style={styles.mlDetailValue}>{scanResult.mlAnalysis.processingTime}</Text>
                      </View>
                      <View style={styles.mlDetail}>
                        <Text style={styles.mlDetailLabel}>Image Quality</Text>
                        <Text style={styles.mlDetailValue}>{scanResult.mlAnalysis.imageQuality}</Text>
                      </View>
                      <View style={styles.mlDetail}>
                        <Text style={styles.mlDetailLabel}>Certainty</Text>
                        <Text style={styles.mlDetailValue}>{scanResult.mlAnalysis.certaintyLevel}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>♻️ Recycling Instructions</Text>
                  <Text style={styles.sectionContent}>{scanResult.recyclingInstructions}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🌍 Environmental Impact</Text>
                  <Text style={styles.sectionContent}>{scanResult.environmentalImpact}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💡 Recommendations</Text>
                  {scanResult.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={handleSchedulePickup}
                  >
                    <Ionicons name="calendar" size={20} color={COLORS.surface} />
                    <Text style={styles.scheduleButtonText}>Schedule Pickup</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRetry}
                  >
                    <Ionicons name="camera" size={20} color={COLORS.primary} />
                    <Text style={styles.retryButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Waste Scanner</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => Alert.alert(
            'How it works',
            'Point your camera at waste items and our AI will classify them and provide recycling guidance.'
          )}
        >
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        {renderCameraView()}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
          onPress={startScanning}
          disabled={isScanning}
        >
          <Ionicons 
            name={isScanning ? "hourglass" : "camera"} 
            size={24} 
            color={COLORS.surface} 
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Waste'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Position the waste item clearly in the frame and tap scan
        </Text>
      </View>

      {renderResults()}
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SIZES.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoButton: {
    padding: SIZES.small,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.large,
    marginBottom: SIZES.medium,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  simulatedCamera: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    marginBottom: SIZES.large,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanningLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    width: '80%',
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  instructionText: {
    color: COLORS.surface,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  scanningContainer: {
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  scanningText: {
    color: COLORS.surface,
    fontSize: 16,
    marginTop: SIZES.medium,
  },
  controls: {
    padding: SIZES.large,
    backgroundColor: COLORS.surface,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.large,
    borderRadius: 8,
    marginBottom: SIZES.medium,
  },
  scanButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  scanButtonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: SIZES.small,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  resultsModal: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  resultsContent: {
    padding: SIZES.large,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  closeButton: {
    padding: SIZES.small,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginRight: SIZES.large,
  },
  wasteTypeCard: {
    padding: SIZES.large,
    borderRadius: 8,
    marginBottom: SIZES.large,
  },
  wasteTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  wasteTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  confidenceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: 4,
  },
  confidenceText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  wasteDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  sectionContent: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.small,
  },
  bullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: SIZES.small,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: SIZES.large,
  },
  scheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: 8,
    marginRight: SIZES.small,
  },
  scheduleButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SIZES.small,
  },
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: 8,
    marginLeft: SIZES.small,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SIZES.small,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  categoryBadge: {
    marginTop: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mlAnalysisSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.medium,
    marginVertical: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mlDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.small,
  },
  mlDetail: {
    width: '48%',
    marginBottom: SIZES.small,
  },
  mlDetailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  mlDetailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default CameraScannerScreen;
