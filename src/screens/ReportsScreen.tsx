// ============================================================
// REPORTS — Tela de analytics e relatórios
// ============================================================

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { BarChart, DonutChart } from '../components/MiniChart';
import { formatCurrency } from '../utils/formatters';
import { MONTHLY_DATA } from '../data/mockData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.screenPadding * 2;

type Period = '7d' | '30d' | '3m' | '12m';

export function ReportsScreen() {
  const { transactions } = useApp();
  const [period, setPeriod] = useState<Period>('30d');

  const periods: { key: Period; label: string }[] = [
    { key: '7d', label: '7 dias' },
    { key: '30d', label: '30 dias' },
    { key: '3m', label: '3 meses' },
    { key: '12m', label: '12 meses' },
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    return { income, expense, savings, savingsRate };
  }, [transactions]);

  // Category breakdown for expenses
  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const map = new Map<string, { total: number; icon: string; color: string; count: number }>();
    expenses.forEach(t => {
      const existing = map.get(t.category) ?? { total: 0, icon: t.categoryIcon, color: t.categoryColor, count: 0 };
      map.set(t.category, { ...existing, total: existing.total + t.amount, count: existing.count + 1 });
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        ...data,
        percentage: totalExpense > 0 ? (data.total / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [transactions]);

  const donutSegments = categoryBreakdown.map(c => ({
    value: c.total,
    color: c.color,
    label: c.name,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatórios</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="download-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── PERIOD SELECTOR ── */}
        <View style={styles.periodRow}>
          {periods.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[styles.periodChip, period === p.key && styles.periodChipActive]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── OVERVIEW CARDS ── */}
        <View style={styles.overviewGrid}>
          <LinearGradient colors={Colors.gradientIncome} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.overviewCard, { flex: 1 }]}>
            <View style={styles.overviewIcon}>
              <Ionicons name="arrow-down" size={16} color={Colors.white} />
            </View>
            <Text style={styles.overviewLabel}>Receitas</Text>
            <Text style={styles.overviewValue}>{formatCurrency(stats.income)}</Text>
          </LinearGradient>

          <LinearGradient colors={Colors.gradientExpense} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.overviewCard, { flex: 1 }]}>
            <View style={styles.overviewIcon}>
              <Ionicons name="arrow-up" size={16} color={Colors.white} />
            </View>
            <Text style={styles.overviewLabel}>Despesas</Text>
            <Text style={styles.overviewValue}>{formatCurrency(stats.expense)}</Text>
          </LinearGradient>
        </View>

        {/* ── SAVINGS CARD ── */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsLeft}>
            <Text style={styles.savingsLabel}>Economia do período</Text>
            <Text style={[styles.savingsValue, { color: stats.savings >= 0 ? Colors.income : Colors.expense }]}>
              {stats.savings >= 0 ? '+' : ''}{formatCurrency(stats.savings)}
            </Text>
          </View>
          <View style={styles.savingsRate}>
            <Text style={styles.savingsRateNum}>{stats.savingsRate.toFixed(0)}%</Text>
            <Text style={styles.savingsRateLabel}>taxa de poupança</Text>
          </View>
        </View>

        {/* ── BAR CHART ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Receitas vs Despesas</Text>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.income }]} />
                <Text style={styles.legendText}>Receita</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.expense }]} />
                <Text style={styles.legendText}>Despesa</Text>
              </View>
            </View>
          </View>
          <BarChart data={MONTHLY_DATA} width={CHART_WIDTH - Spacing.cardPadding * 2} height={130} />
        </View>

        {/* ── CATEGORY BREAKDOWN ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Gastos por categoria</Text>

          <View style={styles.donutRow}>
            <DonutChart segments={donutSegments} size={130} strokeWidth={20} />

            <View style={styles.donutLabels}>
              {categoryBreakdown.slice(0, 4).map((cat, i) => (
                <View key={i} style={styles.donutLabelItem}>
                  <View style={styles.donutLabelLeft}>
                    <View style={[styles.donutLabelDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.donutLabelName} numberOfLines={1}>{cat.name}</Text>
                  </View>
                  <Text style={styles.donutLabelPct}>{cat.percentage.toFixed(0)}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── TOP EXPENSES ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Maiores gastos</Text>
          <View style={styles.topList}>
            {categoryBreakdown.slice(0, 5).map((cat, i) => (
              <View key={i} style={styles.topItem}>
                <View style={styles.topRank}>
                  <Text style={styles.topRankNum}>#{i + 1}</Text>
                </View>
                <View style={[styles.topIcon, { backgroundColor: cat.color + '22' }]}>
                  <Ionicons name={cat.icon as any} size={16} color={cat.color} />
                </View>
                <View style={styles.topInfo}>
                  <Text style={styles.topName}>{cat.name}</Text>
                  <View style={styles.topBar}>
                    <View style={[styles.topBarFill, {
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }]} />
                  </View>
                </View>
                <View style={styles.topRight}>
                  <Text style={styles.topValue}>{formatCurrency(cat.total)}</Text>
                  <Text style={styles.topPct}>{cat.percentage.toFixed(0)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── FINANCIAL HEALTH SCORE ── */}
        <View style={styles.healthCard}>
          <LinearGradient
            colors={['#1A1F35', '#0D1321']}
            style={styles.healthGrad}
          >
            <View style={styles.healthHeader}>
              <View>
                <Text style={styles.healthTitle}>Score Financeiro</Text>
                <Text style={styles.healthSub}>Baseado nos seus últimos 3 meses</Text>
              </View>
              <View style={styles.healthScore}>
                <Text style={styles.healthScoreNum}>84</Text>
                <Text style={styles.healthScoreLabel}>/ 100</Text>
              </View>
            </View>
            <View style={styles.healthBarBg}>
              <LinearGradient
                colors={Colors.gradientIncome}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.healthBarFill, { width: '84%' }]}
              />
            </View>
            <View style={styles.healthItems}>
              {[
                { label: 'Taxa de poupança', score: 'Ótima', color: Colors.income },
                { label: 'Controle de gastos', score: 'Boa', color: Colors.income },
                { label: 'Diversificação', score: 'Regular', color: Colors.warning },
              ].map((item, i) => (
                <View key={i} style={styles.healthItem}>
                  <Text style={styles.healthItemLabel}>{item.label}</Text>
                  <Text style={[styles.healthItemScore, { color: item.color }]}>{item.score}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.screenPadding },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography['2xl'],
    fontFamily: Typography.fontBold,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  periodChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Spacing.radiusMd,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  periodChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  periodText: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontFamily: Typography.fontMedium,
  },
  periodTextActive: {
    color: Colors.primary,
  },

  overviewGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  overviewCard: {
    borderRadius: Spacing.radiusLg,
    padding: Spacing.base,
    gap: 4,
  },
  overviewIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  overviewLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.xs,
    fontFamily: Typography.fontMedium,
  },
  overviewValue: {
    color: Colors.white,
    fontSize: Typography.md,
    fontFamily: Typography.fontBold,
  },

  savingsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  savingsLeft: { gap: 2 },
  savingsLabel: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
    fontFamily: Typography.fontRegular,
  },
  savingsValue: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontBold,
  },
  savingsRate: { alignItems: 'center' },
  savingsRateNum: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontFamily: Typography.fontBold,
  },
  savingsRateLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: Typography.fontRegular,
  },

  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  chartCardTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontFamily: Typography.fontSemiBold,
    marginBottom: Spacing.base,
  },
  chartLegend: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textMuted, fontSize: Typography.xs, fontFamily: Typography.fontRegular },

  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  donutLabels: { flex: 1, gap: 10 },
  donutLabelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donutLabelLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  donutLabelDot: { width: 8, height: 8, borderRadius: 4 },
  donutLabelName: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    fontFamily: Typography.fontRegular,
    flex: 1,
  },
  donutLabelPct: {
    color: Colors.textPrimary,
    fontSize: Typography.xs,
    fontFamily: Typography.fontSemiBold,
  },

  topList: { gap: Spacing.md },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topRank: { width: 20, alignItems: 'center' },
  topRankNum: { color: Colors.textMuted, fontSize: Typography.xs, fontFamily: Typography.fontMedium },
  topIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topInfo: { flex: 1, gap: 4 },
  topName: { color: Colors.textSecondary, fontSize: Typography.sm, fontFamily: Typography.fontMedium },
  topBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  topBarFill: { height: 4, borderRadius: 2 },
  topRight: { alignItems: 'flex-end', gap: 1 },
  topValue: { color: Colors.textPrimary, fontSize: Typography.sm, fontFamily: Typography.fontSemiBold },
  topPct: { color: Colors.textMuted, fontSize: 10, fontFamily: Typography.fontRegular },

  healthCard: {
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  healthGrad: { padding: Spacing.cardPadding, gap: Spacing.md },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  healthTitle: { color: Colors.textPrimary, fontSize: Typography.base, fontFamily: Typography.fontSemiBold },
  healthSub: { color: Colors.textMuted, fontSize: Typography.xs, fontFamily: Typography.fontRegular, marginTop: 2 },
  healthScore: { alignItems: 'flex-end' },
  healthScoreNum: { color: Colors.income, fontSize: Typography['2xl'], fontFamily: Typography.fontBold },
  healthScoreLabel: { color: Colors.textMuted, fontSize: Typography.xs, fontFamily: Typography.fontRegular },
  healthBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  healthBarFill: { height: 6, borderRadius: 3 },
  healthItems: { gap: 6 },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthItemLabel: { color: Colors.textSecondary, fontSize: Typography.sm, fontFamily: Typography.fontRegular },
  healthItemScore: { fontSize: Typography.sm, fontFamily: Typography.fontSemiBold },
});
