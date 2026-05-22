import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  style?: ViewStyle;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export function Input({
  value, onChangeText, placeholder, label, error, hint,
  leftIcon, rightIcon, multiline, numberOfLines, keyboardType = 'default',
  style, secureTextEntry, editable = true,
}: InputProps) {
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(borderColor, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    Animated.timing(borderColor, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const animatedBorder = {
    borderColor: borderColor.interpolate({
      inputRange: [0, 1],
      outputRange: [error ? Colors.expense : Colors.border, error ? Colors.expense : Colors.primary],
    }),
    borderWidth: borderColor.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }),
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.container, animatedBorder]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          style={[styles.input, leftIcon && styles.inputLeft, rightIcon && styles.inputRight, multiline && styles.inputMultiline]}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { color: Colors.textSecondary, fontSize: 13, fontFamily: Typography.fontMedium },
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Spacing.radiusMd, minHeight: 52 },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: Typography.fontRegular, fontSize: 15, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  inputLeft: { paddingLeft: 0 },
  inputRight: { paddingRight: 0 },
  inputMultiline: { textAlignVertical: 'top', paddingTop: Spacing.sm },
  iconLeft: { paddingLeft: Spacing.md },
  iconRight: { paddingRight: Spacing.md },
  error: { color: Colors.expense, fontSize: 12, fontFamily: Typography.fontRegular },
  hint: { color: Colors.textMuted, fontSize: 12, fontFamily: Typography.fontRegular },
});
