import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onPress?: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, category, onPress }: TransactionItemProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  };

  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? Colors.income : Colors.expense;
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => onPress?.(transaction)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.container}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: (category?.color ?? Colors.primary) + '22' }]}>
          <Text style={styles.emoji}>{category?.icon ?? '💰'}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
          <Text style={styles.meta}>{category?.name ?? 'Outros'} · {formatDate(transaction.date)}</Text>
        </View>

        {/* Right side */}
        <View style={styles.right}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}{formatCurrency(transaction.amount)}
          </Text>
          {transaction.receiptImage && (
            <Image source={{ uri: transaction.receiptImage }} style={styles.thumbnail} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: Spacing.radiusMd, marginBottom: Spacing.xs },
  iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  info: { flex: 1, gap: 2 },
  description: { color: Colors.textPrimary, fontFamily: Typography.fontMedium, fontSize: 14 },
  meta: { color: Colors.textMuted, fontFamily: Typography.fontRegular, fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: { fontFamily: Typography.fontSemiBold, fontSize: 14 },
  thumbnail: { width: 28, height: 28, borderRadius: 6 },
});
