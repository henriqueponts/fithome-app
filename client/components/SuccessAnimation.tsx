import React, { useEffect } from "react";
import { StyleSheet, View, Modal, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";

interface SuccessAnimationProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  onClose: () => void;
}

export function SuccessAnimation({
  visible,
  message,
  subMessage,
  onClose,
}: SuccessAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      checkScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        )
      );

      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, containerStyle]}>
          <Animated.View style={[styles.checkContainer, checkStyle]}>
            <Feather name="check" size={48} color="#FFFFFF" />
          </Animated.View>
          <ThemedText style={styles.message}>{message}</ThemedText>
          {subMessage ? (
            <ThemedText style={styles.subMessage}>{subMessage}</ThemedText>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: AppColors.white,
    padding: Spacing["3xl"],
    borderRadius: BorderRadius["2xl"],
    alignItems: "center",
    minWidth: 200,
  },
  checkContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subMessage: {
    fontSize: 14,
    color: AppColors.gray600,
    textAlign: "center",
  },
});
