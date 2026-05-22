// ============================================================
// BADGE — Etiqueta visual para categorias e status
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ label, color = Colors.primary, size = 'md', dot = false }: BadgeProps) {
  const bg = color + '22';
  return (
    <View style={[styles.container, { backgroundColor: bg }, size === 'sm' && styles.containerSm]}>
      {dot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text style={[styles.label, { color }, size === 'sm' && styles.labelSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Spacing.radiusFull,
    gap: 4,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontMedium,
  },
  labelSm: {
    fontSize: 10,
  },
});
