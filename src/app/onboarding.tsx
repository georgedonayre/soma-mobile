// screens/Onboarding.tsx
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
} from "@/src/components/onboarding/steps";
import * as UserModel from "@/src/database/models/userModel";
import { stepFields, type OnboardingData } from "@/src/types/onboarding";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "../components/themed-view";
import { Colors } from "../theme";
import { calculateTargets } from "../util/onboarding";

export default function Onboarding() {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSex, setSelectedSex] = useState<"male" | "female">("male");
  const [selectedGoal, setSelectedGoal] = useState<
    "lose" | "maintain" | "gain" | ""
  >("");
  const [selectedActivity, setSelectedActivity] = useState<
    "sedentary" | "light" | "moderate" | "active" | "extra" | ""
  >("");

  const router = useRouter();
  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingData>({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const goToNextStep = async () => {
    console.log("NEXT STEP IS CLICKED");
    const fields = stepFields[currentStep];
    const isValid = await trigger(fields);

    console.log("TRIGGER A RERENDER");
    console.log(errors);
    if (!isValid) return;
    console.log("IS VALID");

    setCurrentStep((prev) => prev + 1);
  };

  const goToPrevStep = async () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onFinish = async () => {
    const formData = getValues();
    const targets = calculateTargets(formData);

    try {
      await UserModel.createUser({
        name: formData.name,
        age: formData.age,
        sex: formData.sex,
        height: formData.height,
        weight: formData.weight,
        goal: formData.goal,
        activity_level: formData.activity_level,
        daily_calorie_target: targets.daily_calorie_target,
        daily_protein_target: targets.daily_protein_target,
        daily_carbs_target: targets.daily_carbs_target,
        daily_fat_target: targets.daily_fat_target,
        calorie_deficit: targets.calorie_deficit,
        maintaining_calorie: targets.maintaining_calorie,
        onboarded: 1,
        streak: 0,
        longest_streak: 0,
        last_logged_at: null,
        earned_badges: null,
        exp: 0,
      });

      router.replace("/(tabs)/dashboard");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user data");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1 control={control} errors={errors} onNext={goToNextStep} />
        );
      case 2:
        return (
          <Step2
            control={control}
            errors={errors}
            selectedSex={selectedSex}
            setSelectedSex={setSelectedSex}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
      case 3:
        return (
          <Step3
            control={control}
            errors={errors}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        );
      case 4:
        return (
          <Step4
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            control={control}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            onNext={goToNextStep}
            onBack={goToPrevStep}
            control={control}
            errors={errors}
          />
        );
      case 6:
        return (
          <Step6
            data={getValues()}
            targets={calculateTargets({
              ...getValues(),
              sex: selectedSex as any,
              goal: selectedGoal as any,
              activity_level: selectedActivity as any,
            })}
            onFinish={onFinish}
            onBack={goToPrevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: theme.tint },
            ]}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {renderStep()}
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e5e5e5",
  },
  progressBarFill: {
    height: "100%",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
});
