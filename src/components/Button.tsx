import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  Animated, ViewStyle, TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: string[];
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, style, textStyle, gradient, fullWidth = true,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const heights: Record<ButtonSize, number> = { sm: 40, md: 52, lg: 58 };
  const fontSizes: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16 };
  const gradients: Record<ButtonVariant, string[] | null> = {
    primary: gradient ?? Colors.gradientPrimary,
    secondary: Colors.gradientPurple,
    outline: null, ghost: null,
    danger: Colors.gradientExpense,
  };

  const useGradient = gradients[variant] !== null;

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <>{icon}<Text style={[styles.label, { fontSize: fontSizes[size] }, variant === 'outline' && styles.labelOutline, variant === 'ghost' && styles.labelGhost, textStyle]}>{label}</Text></>
      )}
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && { width: '100%' }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {useGradient ? (
          <LinearGradient colors={(gradients[variant] as string[])} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.base, { height: heights[size] }, disabled && styles.disabled]}>
            {content}
          </LinearGradient>
        ) : (
          <Animated.View style={[styles.base, { height: heights[size] }, variant === 'outline' && styles.outline, variant === 'ghost' && styles.ghost, disabled && styles.disabled]}>
            {content}
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Spacing.radiusFull, gap: 8, paddingHorizontal: Spacing.xl },
  label: { color: Colors.white, fontFamily: Typography.fontSemiBold, letterSpacing: 0.2 },
  labelOutline: { color: Colors.primary },
  labelGhost: { color: Colors.textSecondary },
  outline: { borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  ghost: { backgroundColor: Colors.transparent },
  disabled: { opacity: 0.45 },
});
