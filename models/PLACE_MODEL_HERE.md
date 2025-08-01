# Trained Model Directory

## Model Specifications

This directory contains the trained MobileNetV2 model for waste classification:

- **Task**: Binary Classification (Biodegradable vs Non-Biodegradable)
- **Architecture**: MobileNetV2 with custom classification head
- **Input Size**: 224×224×3 RGB images
- **Output**: Single neuron with sigmoid activation
- **Classes**:
  - `0` = Biodegradable (food scraps, paper, organic matter)
  - `1` = Non-Biodegradable (plastic, glass, metal, electronics)

## Expected Files

- `waste_classifier_final.keras` - Final trained model
- `waste_classifier_best.h5` - Best checkpoint during training (optional)
- `Capstone.ipynb` - Training notebook with model development process

## Model Performance

The model is trained using transfer learning with MobileNetV2 as the base model, fine-tuned for binary waste classification. The system automatically loads and uses this model for real-time waste classification through the API endpoints.
