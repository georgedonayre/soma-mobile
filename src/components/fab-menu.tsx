// src/components/fab/fab-menu.tsx
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type LogMethod = "barcode" | "manual" | "ai";

export interface LogOption {
  id: LogMethod;
  label: string;
  icon: string;
  route: string;
  iconFamily: "material" | "materialCommunity";
}

const LOG_OPTIONS: LogOption[] = [
  {
    id: "barcode",
    label: "Scan Barcode",
    icon: "barcode-scan",
    route: "/screens/log-food/barcode/scan",
    iconFamily: "materialCommunity",
  },
  {
    id: "manual",
    label: "USDA Search",
    icon: "search",
    route: "/screens/log-food/usda/search",
    iconFamily: "material",
  },
  {
    id: "ai",
    label: "Ask Fyy",
    icon: "cat",
    route: "/screens/log-food/ai/entry",
    iconFamily: "materialCommunity",
  },
];

const FAB_SIZE = 64;
const MENU_RADIUS = 100; // Distance from FAB to options
const SWIPE_THRESHOLD = 40; // Minimum swipe to open menu
const SELECT_THRESHOLD = 50; // Distance to consider option selected

export function FabMenu() {
  const router = useRouter();

  // State
  const [lastSelected, setLastSelected] = useState<LogMethod>("barcode");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  // Animations
  const fabScale = useSharedValue(1);
  const menuScale = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Find current option
  const currentOption =
    LOG_OPTIONS.find((opt) => opt.id === lastSelected) || LOG_OPTIONS[0];

  // Navigation helper
  const navigateToOption = (option: LogOption) => {
    // Update last selected
    setLastSelected(option.id);

    // Navigate
    router.push(option.route as any);

    // Close menu
    closeMenu();
  };

  // Menu controls
  const openMenu = () => {
    setMenuOpen(true);
    fabScale.value = withSpring(1.1);
    menuScale.value = withSpring(1);
    backdropOpacity.value = withTiming(0.5, { duration: 200 });
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setHoveredOption(null);
    fabScale.value = withSpring(1);
    menuScale.value = withSpring(0);
    backdropOpacity.value = withTiming(0, { duration: 200 });
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
  };

  // Calculate option position (semi-circle, top half)
  const getOptionPosition = (index: number, total: number) => {
    // Spread 180 degrees (from -90 to +90 degrees)
    const startAngle = -90; // Start at left
    const endAngle = 90; // End at right
    const angleRange = endAngle - startAngle;

    // Calculate angle for this option
    const angle = startAngle + (angleRange / (total - 1)) * index;
    const radian = (angle * Math.PI) / 180;

    return {
      x: Math.cos(radian) * MENU_RADIUS,
      y: Math.sin(radian) * MENU_RADIUS,
    };
  };

  // Gesture: Pan (swipe)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Start scaling FAB
      fabScale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      if (!menuOpen) {
        // Check if swipe distance reaches threshold to open menu
        const swipeDistance = Math.sqrt(
          event.translationX ** 2 + event.translationY ** 2
        );

        if (swipeDistance > SWIPE_THRESHOLD) {
          runOnJS(openMenu)();
        }
      } else {
        // Menu is open, check for option hover
        const x = event.translationX;
        const y = event.translationY;
        const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);

        if (distanceFromCenter > SELECT_THRESHOLD) {
          // Calculate which option is being hovered
          const angle = (Math.atan2(y, x) * 180) / Math.PI; // -180 to 180

          // Map angle to option index (0 = leftmost, 2 = rightmost)
          let optionIndex: number;

          if (angle < -120) optionIndex = 0; // Far left
          else if (angle < -60) optionIndex = 0; // Left
          else if (angle < 0) optionIndex = 1; // Center
          else if (angle < 60) optionIndex = 1; // Center
          else if (angle < 120) optionIndex = 2; // Right
          else optionIndex = 2; // Far right

          // Ensure index is within bounds
          optionIndex = Math.max(
            0,
            Math.min(LOG_OPTIONS.length - 1, optionIndex)
          );

          if (hoveredOption !== optionIndex) {
            runOnJS(setHoveredOption)(optionIndex);
          }
        } else {
          // Too close to center, no option hovered
          if (hoveredOption !== null) {
            runOnJS(setHoveredOption)(null);
          }
        }
      }
    })
    .onEnd(() => {
      if (menuOpen && hoveredOption !== null) {
        // Option was selected
        const option = LOG_OPTIONS[hoveredOption];
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(navigateToOption)(option);
      } else if (menuOpen) {
        // No option selected, close menu
        runOnJS(closeMenu)();
      } else {
        // Menu wasn't opened, return to normal
        fabScale.value = withSpring(1);
      }
    });

  // Gesture: Tap
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (menuOpen) {
      runOnJS(closeMenu)();
    } else {
      // Tap on FAB - navigate to last selected
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(navigateToOption)(currentOption);
    }
  });

  // Combine gestures: Tap has priority, but pan can override if movement detected
  const composedGesture = Gesture.Race(tapGesture, panGesture);

  // Animated styles
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
    opacity: menuScale.value,
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Render icon based on icon family
  const renderIcon = (option: LogOption, size: number, color: string) => {
    if (option.iconFamily === "material") {
      return (
        <MaterialIcons name={option.icon as any} size={size} color={color} />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name={option.icon as any}
          size={size}
          color={color}
        />
      );
    }
  };

  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        </Animated.View>
      )}

      {/* Menu Options */}
      {menuOpen && (
        <Animated.View
          style={[styles.menuContainer, menuAnimatedStyle]}
          pointerEvents="none"
        >
          {LOG_OPTIONS.map((option, index) => {
            const position = getOptionPosition(index, LOG_OPTIONS.length);
            const isHovered = hoveredOption === index;

            return (
              <Animated.View
                key={option.id}
                style={[
                  styles.menuItem,
                  {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { scale: isHovered ? 1.2 : 1 },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuButton,
                    {
                      backgroundColor: isHovered ? "#4A90E2" : "#FFFFFF",
                      borderColor: isHovered ? "#4A90E2" : "#E0E0E0",
                    },
                  ]}
                >
                  {renderIcon(option, 24, isHovered ? "#FFFFFF" : "#4A90E2")}
                </View>
                <Text
                  style={[
                    styles.menuLabel,
                    { color: isHovered ? "#4A90E2" : "#666666" },
                  ]}
                >
                  {option.label}
                </Text>
              </Animated.View>
            );
          })}
        </Animated.View>
      )}

      {/* FAB */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.fab, fabAnimatedStyle]}>
            {renderIcon(currentOption, 28, "#FFFFFF")}
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
  },
  fabContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    alignSelf: "center",
    zIndex: 999,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  menuContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 + FAB_SIZE / 2 : 20 + FAB_SIZE / 2,
    alignSelf: "center",
    zIndex: 997,
  },
  menuItem: {
    position: "absolute",
    alignItems: "center",
    width: 80,
  },
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
