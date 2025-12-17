import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBlock: 24,
  },
  stepContent: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5C5C5C",
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    marginTop: 4,
  },
  optionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  optionColumn: {
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  optionCardSelected: {
    backgroundColor: "rgba(43, 138, 62, 0.05)",
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#5C5C5C",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "rgba(43, 138, 62, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  summaryItem: {
    width: "45%",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#5C5C5C",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  targetsCard: {
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
  },
  targetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  targetLabel: {
    fontSize: 16,
    color: "#5C5C5C",
  },
  targetValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  targetDivider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 16,
  },
  targetNote: {
    fontSize: 14,
    color: "#5C5C5C",
    marginBottom: 4,
  },
});
