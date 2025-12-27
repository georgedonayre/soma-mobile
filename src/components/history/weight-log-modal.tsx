import { createWeightLog } from "@/src/database/models/weightLogModel";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";

interface WeightLogModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  theme: any;
}

export default function WeightLogModal({
  isVisible,
  onClose,
  onSuccess,
  userId,
  theme,
}: WeightLogModalProps) {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setWeight("");
    setDate(new Date());
    setNotes("");
    setShowDatePicker(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateWeight = (value: string): boolean => {
    const weightNum = parseFloat(value);
    if (isNaN(weightNum)) return false;
    if (weightNum < 20 || weightNum > 300) return false;
    return true;
  };

  const handleSubmit = async () => {
    // Validate weight
    if (!weight.trim()) {
      Toast.show({
        type: "error",
        text1: "Weight required",
        text2: "Please enter your weight",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (!validateWeight(weight)) {
      Toast.show({
        type: "error",
        text1: "Invalid weight",
        text2: "Weight must be between 20-300 kg",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createWeightLog({
        user_id: userId,
        date: format(date, "yyyy-MM-dd"),
        weight: parseFloat(weight),
        notes: notes.trim() || null,
      });

      Toast.show({
        type: "success",
        text1: "Weight logged! 🎉",
        text2: `${weight} kg recorded for ${format(date, "MMM d")}`,
        position: "top",
        visibilityTime: 2000,
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Failed to log weight:", error);

      if (error.message?.includes("Weight already logged")) {
        Toast.show({
          type: "error",
          text1: "Already logged",
          text2: `Weight already exists for ${format(date, "MMM d, yyyy")}`,
          position: "top",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to log weight",
          text2: "Please try again",
          position: "top",
          visibilityTime: 2000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      swipeDirection={["down"]}
      onSwipeComplete={handleClose}
      style={styles.modal}
      backdropOpacity={0.5}
      useNativeDriverForBackdrop
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
          {/* Handle bar for swipe down */}
          <View style={styles.handleBar}>
            <View
              style={[styles.handleIndicator, { backgroundColor: theme.icon }]}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>
                Log Weight
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.closeText, { color: theme.icon }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Weight (kg) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter weight"
                placeholderTextColor={theme.icon}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                autoFocus
              />
              <Text style={[styles.hint, { color: theme.icon }]}>
                Must be between 20-300 kg
              </Text>
            </View>

            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.dateText, { color: theme.text }]}>
                  {format(date, "MMMM d, yyyy")}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor={theme.text}
              />
            )}

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Notes (optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.notesInput,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Add notes (e.g., morning, after workout)"
                placeholderTextColor={theme.icon}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.tint },
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Logging..." : "Log Weight"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "90%",
  },
  handleBar: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 24,
    fontWeight: "300",
  },
  inputGroup: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 80,
    paddingTop: 14,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
  },
  submitButton: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
