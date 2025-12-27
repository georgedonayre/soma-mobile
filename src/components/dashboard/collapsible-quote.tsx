// components/dashboard/CollapsibleQuote.tsx
import { Quote } from "@/src/config/quotes";
import { getQuoteOfTheDay, getRandomQuote } from "@/src/utils/quoteUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleQuoteProps {
  theme: any;
  mode?: "daily" | "random"; // daily = same quote all day, random = new on each render
}

export default function CollapsibleQuote({
  theme,
  mode = "daily",
}: CollapsibleQuoteProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Load quote based on mode
    const currentQuote =
      mode === "random" ? getQuoteOfTheDay() : getRandomQuote();
    setQuote(currentQuote);
  }, [mode]);

  const handleRefresh = () => {
    // Optional: Allow users to manually refresh quote
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQuote(getRandomQuote());
  };

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  if (!quote) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggle}
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.tint + "30",
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.tint + "15" },
              ]}
            >
              <Ionicons name="sparkles" size={16} color={theme.tint} />
            </View>
            <Text style={[styles.headerText, { color: theme.text }]}>
              {isExpanded ? "Daily Inspiration" : "Tap for inspiration"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* Optional: Refresh button */}
            {isExpanded && mode === "random" && (
              <TouchableOpacity
                onPress={handleRefresh}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="refresh"
                  size={18}
                  color={theme.icon}
                  style={{ marginRight: 8 }}
                />
              </TouchableOpacity>
            )}
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.icon}
            />
          </View>
        </View>

        {isExpanded && (
          <View style={styles.content}>
            <Text style={[styles.quoteText, { color: theme.text }]}>
              &quot;{quote.text}&quot;
            </Text>
            <View style={styles.footer}>
              <Text style={[styles.quoteAuthor, { color: theme.text }]}>
                — {quote.author}
              </Text>
              {quote.category && (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: theme.tint + "15" },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: theme.tint }]}>
                    {quote.category}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: "500",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
