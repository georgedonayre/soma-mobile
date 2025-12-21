// src/components/fab/fab-menu.tsx
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
const MENU_RADIUS = 90;
const SWIPE_THRESHOLD = 40;
const SELECT_THRESHOLD = 60;

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
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setHoveredOption(null);
    fabScale.value = withSpring(1);
    menuScale.value = withSpring(0);
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  // Calculate option position (semi-circle above FAB, 180° arc)
  const getOptionPosition = (index: number, total: number) => {
    // For a semi-circle ABOVE the FAB (180° arc)
    // 0° = directly left, 90° = directly up, 180° = directly right
    // We want items spread from left (180°) to right (0°) in the upper half

    let angle: number;

    if (total === 1) {
      // Single item: place directly above (90°)
      angle = 90;
    } else {
      // Multiple items: spread from 180° (left) to 0° (right)
      // This creates a semi-circle in the top half
      angle = 180 - (180 / (total - 1)) * index;
    }

    // Convert angle to radians for Math functions
    const radian = (angle * Math.PI) / 180;

    // Calculate x and y positions
    // Note: We need to invert y because screen coordinates have y increasing downward
    const x = Math.cos(radian) * MENU_RADIUS;
    const y = -Math.sin(radian) * MENU_RADIUS; // Negative to go upward

    return { x, y };
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      fabScale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      if (!menuOpen) {
        const swipeDistance = Math.sqrt(
          event.translationX ** 2 + event.translationY ** 2
        );

        if (swipeDistance > SWIPE_THRESHOLD) {
          runOnJS(openMenu)();
        }
      } else {
        const x = event.translationX;
        const y = event.translationY;
        const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);

        if (distanceFromCenter > SELECT_THRESHOLD) {
          // Calculate angle from touch position
          // atan2 gives us angle where 0° = right, 90° = down (screen coords)
          let angle = (Math.atan2(-y, x) * 180) / Math.PI; // Negate y for screen coords

          // Normalize to 0-360
          if (angle < 0) angle += 360;

          // Check if we're in the top half (semi-circle from 0° to 180°)
          if (angle >= 0 && angle <= 180) {
            // Map angle to option index
            // 0° = rightmost option, 180° = leftmost option
            const optionIndex = Math.round(
              (180 - angle) / (180 / (LOG_OPTIONS.length - 1))
            );

            // Clamp to valid range
            const clampedIndex = Math.max(
              0,
              Math.min(LOG_OPTIONS.length - 1, optionIndex)
            );

            if (hoveredOption !== clampedIndex) {
              runOnJS(setHoveredOption)(clampedIndex);
            }
          } else {
            // Bottom half - no selection
            if (hoveredOption !== null) {
              runOnJS(setHoveredOption)(null);
            }
          }
        } else {
          // Too close to center - clear selection
          if (hoveredOption !== null) {
            runOnJS(setHoveredOption)(null);
          }
        }
      }
    })
    .onEnd(() => {
      if (menuOpen && hoveredOption !== null) {
        const option = LOG_OPTIONS[hoveredOption];
        runOnJS(navigateToOption)(option);
      } else if (menuOpen) {
        runOnJS(closeMenu)();
      } else {
        fabScale.value = withSpring(1);
      }
    });

  // Gesture: Tap
  const tapGesture = Gesture.Tap().onEnd(() => {
    if (menuOpen) {
      runOnJS(closeMenu)();
    } else {
      // Tap on FAB - navigate to last selected
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
    bottom: (Platform.OS === "ios" ? 30 : 20) + FAB_SIZE / 2, // Center at FAB level
    alignSelf: "center",
    zIndex: 997,
    width: MENU_RADIUS * 2 + 100, // Accommodate full semi-circle width plus labels
    height: MENU_RADIUS, // Height for semi-circle plus label space
    justifyContent: "center",
    alignItems: "center",
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
