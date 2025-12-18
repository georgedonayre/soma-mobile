// screens/onboarding/steps.tsx
import type { NutritionTargets, OnboardingData } from "@/src/types/onboarding";
import React from "react";
import { Controller, useFormState } from "react-hook-form";
import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { Colors } from "../../theme";
import { styles } from "./styles";

// Step 1: Name
export function Step1({ control, onNext }: any) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { errors } = useFormState<OnboardingData>({ control });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <View style={styles.header}>
          <ThemedText style={styles.emoji}>🐲</ThemedText>
          <ThemedText style={styles.title}>Welcome!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Let&apos;s set up your fitness profile to give you personalized
            recommendations
          </ThemedText>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>What&apos;s your name?</ThemedText>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && (
            <ThemedText style={styles.errorText}>
              {errors.name.message}
            </ThemedText>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          {
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          },
          { backgroundColor: theme.tint },
        ]}
        onPress={onNext}
      >
        <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// Step 2: Age & Sex
export function Step2({ control, onNext, onBack }: any) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { errors } = useFormState<OnboardingData>({ control });
  console.log("STEP 2 ERRORS");
  console.log("Step2 errors:", errors); // ← Add this

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <ThemedText style={styles.title}>Tell us about yourself</ThemedText>
        <ThemedText style={styles.subtitle}>
          This helps us calculate your calorie needs
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Age</ThemedText>
          <Controller
            control={control}
            name="age"
            rules={{
              required: "Age is required",
              min: { value: 1, message: "Age must be at least 1" },
              max: { value: 150, message: "Age must be less than 150" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="25"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(parseInt(text) || "")}
              />
            )}
          />
          {errors.age && (
            <ThemedText style={styles.errorText}>
              {errors.age.message}
            </ThemedText>
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Sex</ThemedText>

          <Controller
            control={control}
            name="sex"
            rules={{ required: "Sex is required" }}
            render={({ field: { value, onChange } }) => (
              <View style={styles.optionGrid}>
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    value === "male" && [
                      styles.optionCardSelected,
                      { borderColor: theme.tint },
                    ],
                  ]}
                  onPress={() => onChange("male")}
                >
                  <ThemedText style={styles.optionEmoji}>👨</ThemedText>
                  <ThemedText style={styles.optionTitle}>Male</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    value === "female" && [
                      styles.optionCardSelected,
                      { borderColor: theme.tint },
                    ],
                  ]}
                  onPress={() => onChange("female")}
                >
                  <ThemedText style={styles.optionEmoji}>👩</ThemedText>
                  <ThemedText style={styles.optionTitle}>Female</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.sex && (
            <ThemedText style={styles.errorText}>
              {errors.sex.message}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.tint }]}
          onPress={onBack}
        >
          <ThemedText
            style={[styles.secondaryButtonText, { color: theme.tint }]}
          >
            Back
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={onNext}
        >
          <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 3: Height & Weight
export function Step3({ control, onNext, onBack }: any) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { errors } = useFormState<OnboardingData>({ control });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <ThemedText style={styles.title}>Your measurements</ThemedText>
        <ThemedText style={styles.subtitle}>
          We&apos;ll use this to track your progress
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Height (cm)</ThemedText>
          <Controller
            control={control}
            name="height"
            rules={{
              required: "Height is required",
              min: { value: 1, message: "Invalid height" },
              max: { value: 300, message: "Invalid height" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="170"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={value?.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || "")}
              />
            )}
          />
          {errors.height && (
            <ThemedText style={styles.errorText}>
              {errors.height.message}
            </ThemedText>
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Weight (kg)</ThemedText>
          <Controller
            control={control}
            name="weight"
            rules={{
              required: "Weight is required",
              min: { value: 1, message: "Invalid weight" },
              max: { value: 500, message: "Invalid weight" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="70"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={value?.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || "")}
              />
            )}
          />
          {errors.weight && (
            <ThemedText style={styles.errorText}>
              {errors.weight.message}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.tint }]}
          onPress={onBack}
        >
          <ThemedText
            style={[styles.secondaryButtonText, { color: theme.tint }]}
          >
            Back
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={onNext}
        >
          <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 4: Goal
export function Step4({ onNext, onBack, control }: any) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { errors } = useFormState<OnboardingData>({ control });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <ThemedText style={styles.title}>What&apos;s your goal?</ThemedText>
        <ThemedText style={styles.subtitle}>
          This determines your calorie target
        </ThemedText>
        <Controller
          control={control}
          name="goal"
          rules={{ required: "Goal is required" }}
          render={({ field: { value, onChange } }) => (
            <View style={styles.optionColumn}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "lose" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("lose");
                }}
              >
                <ThemedText style={styles.optionEmoji}>📉</ThemedText>
                <ThemedText style={styles.optionTitle}>Lose Weight</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Calorie deficit for fat loss
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "maintain" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("maintain");
                }}
              >
                <ThemedText style={styles.optionEmoji}>⚖️</ThemedText>
                <ThemedText style={styles.optionTitle}>
                  Maintain Weight
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Stay at current weight
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "gain" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("gain");
                }}
              >
                <ThemedText style={styles.optionEmoji}>📈</ThemedText>
                <ThemedText style={styles.optionTitle}>Gain Weight</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Calorie surplus for muscle gain
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        />

        {errors.goal && (
          <ThemedText style={styles.errorText}>
            {errors.goal.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.tint }]}
          onPress={onBack}
        >
          <ThemedText
            style={[styles.secondaryButtonText, { color: theme.tint }]}
          >
            Back
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={onNext}
        >
          <ThemedText style={styles.primaryButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 5: Activity Level
export function Step5({ onNext, onBack, control }: any) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  const { errors } = useFormState<OnboardingData>({ control });

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <ThemedText style={styles.title}>Activity level</ThemedText>
        <ThemedText style={styles.subtitle}>
          How active are you on a typical day?
        </ThemedText>
        <Controller
          control={control}
          name="activity_level"
          rules={{ required: "Activity level is required" }}
          render={({ field: { value, onChange } }) => (
            <View style={styles.optionColumn}>
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "sedentary" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("sedentary");
                }}
              >
                <ThemedText style={styles.optionTitle}>Sedentary</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Little or no exercise
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "light" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("light");
                }}
              >
                <ThemedText style={styles.optionTitle}>
                  Lightly Active
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Exercise 1-3 days/week
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "moderate" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("moderate");
                }}
              >
                <ThemedText style={styles.optionTitle}>
                  Moderately Active
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Exercise 3-5 days/week
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "active" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("active");
                }}
              >
                <ThemedText style={styles.optionTitle}>Very Active</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Exercise 6-7 days/week
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  value === "extra" && [
                    styles.optionCardSelected,
                    { borderColor: theme.tint },
                  ],
                ]}
                onPress={() => {
                  onChange("extra");
                }}
              >
                <ThemedText style={styles.optionTitle}>Extra Active</ThemedText>
                <ThemedText style={styles.optionDescription}>
                  Very intense exercise daily
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.activity_level && (
          <ThemedText style={styles.errorText}>
            {errors.activity_level.message}
          </ThemedText>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.tint }]}
          onPress={onBack}
        >
          <ThemedText
            style={[styles.secondaryButtonText, { color: theme.tint }]}
          >
            Back
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={onNext}
        >
          <ThemedText style={styles.primaryButtonText}>Calculate</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 6: Summary
export function Step6({
  data,
  targets,
  onFinish,
  onBack,
}: {
  data: OnboardingData;
  targets: NutritionTargets;
  onFinish: () => void;
  onBack: () => void;
}) {
  const colorScheme = useColorScheme() ?? "dark";
  const theme = Colors[colorScheme];
  console.log(data);

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <ThemedText style={styles.title}>Your personalized plan</ThemedText>
        <ThemedText style={styles.subtitle}>
          Based on your information, here are your daily targets
        </ThemedText>

        <View style={styles.summaryCard}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Age</ThemedText>
              <ThemedText style={styles.summaryValue}>{data.age}</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Sex</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.sex === "male" ? "Male" : "Female"}
              </ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Height</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.height} cm
              </ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Weight</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.weight} kg
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.targetsCard, { borderColor: theme.tint }]}>
          <ThemedText style={styles.targetsTitle}>Daily Targets</ThemedText>

          <View style={styles.targetRow}>
            <ThemedText style={styles.targetLabel}>Calories</ThemedText>
            <ThemedText style={styles.targetValue}>
              {targets.daily_calorie_target} cal
            </ThemedText>
          </View>
          <View style={styles.targetRow}>
            <ThemedText style={styles.targetLabel}>Protein</ThemedText>
            <ThemedText style={styles.targetValue}>
              {targets.daily_protein_target}g
            </ThemedText>
          </View>
          <View style={styles.targetRow}>
            <ThemedText style={styles.targetLabel}>Carbs</ThemedText>
            <ThemedText style={styles.targetValue}>
              {targets.daily_carbs_target}g
            </ThemedText>
          </View>
          <View style={styles.targetRow}>
            <ThemedText style={styles.targetLabel}>Fat</ThemedText>
            <ThemedText style={styles.targetValue}>
              {targets.daily_fat_target}g
            </ThemedText>
          </View>

          <View style={styles.targetDivider} />

          <ThemedText style={styles.targetNote}>
            Maintenance: {targets.maintaining_calorie} cal
          </ThemedText>
          <ThemedText style={styles.targetNote}>
            {targets.calorie_deficit > 0
              ? "Deficit"
              : targets.calorie_deficit < 0
              ? "Surplus"
              : "No change"}
            : {Math.abs(targets.calorie_deficit)} cal
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.tint }]}
          onPress={onBack}
        >
          <ThemedText
            style={[styles.secondaryButtonText, { color: theme.tint }]}
          >
            Back
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.tint }]}
          onPress={onFinish}
        >
          <ThemedText style={styles.primaryButtonText}>
            Start Tracking!
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
