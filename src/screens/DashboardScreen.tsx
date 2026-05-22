// ============================================================
// DASHBOARD — Tela principal premium fintech
// ============================================================

import React, { useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { TransactionItem } from '../components/TransactionItem';
import { MiniChart } from '../components/MiniChart';
import { FloatingButton } from '../components/FloatingButton';
import { formatCurrency } from '../utils/formatters';
import { BALANCE_CHART_DATA } from '../data/mockData';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.screenPadding * 2;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DashboardScreen() {
  const { transactions, balance, totalIncome, totalExpense, user, balanceVisible, toggleBalanceVisible } = useApp();
  const navigation = useNavigation<NavProp>();

  const recent = transactions.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const maskedBalance = '•••••';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{user.name.split(' ')[0]} 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search-outline" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <View style={styles.notifDot} />
              <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BALANCE CARD ── */}
        <LinearGradient
          colors={['#1A1F35', '#0D1321']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          {/* Decorative glow */}
          <View style={styles.cardGlow} />
          <View style={styles.cardGlow2} />

          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo Total</Text>
            <TouchableOpacity onPress={toggleBalanceVisible} style={styles.eyeBtn}>
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>
            {balanceVisible ? formatCurrency(balance) : maskedBalance}
          </Text>

          {/* Indicador de variação */}
          <View style={styles.balanceChange}>
            <Ionicons name="trending-up" size={14} color={Colors.income} />
            <Text style={styles.balanceChangeText}>+12.4% este mês</Text>
          </View>

          {/* Gráfico de linha */}
          <View style={styles.chartWrap}>
            <MiniChart
              data={BALANCE_CHART_DATA}
              width={CHART_WIDTH - Spacing.cardPadding * 2}
              height={72}
              color={Colors.primary}
              showDots={true}
              showLabels={true}
            />
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <LinearGradient colors={Colors.gradientIncome} style={styles.statIconGrad}>
                  <Ionicons name="arrow-down" size={12} color={Colors.white} />
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.statLabel}>Receitas</Text>
                <Text style={[styles.statValue, { color: Colors.income }]}>
                  {balanceVisible ? formatCurrency(totalIncome) : '•••••'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <LinearGradient colors={Colors.gradientExpense} style={styles.statIconGrad}>
                  <Ionicons name="arrow-up" size={12} color={Colors.white} />
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.statLabel}>Despesas</Text>
                <Text style={[styles.statValue, { color: Colors.expense }]}>
                  {balanceVisible ? formatCurrency(totalExpense) : '•••••'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── AÇÕES RÁPIDAS ── */}
        <View style={styles.quickActions}>
          {[
            { icon: 'send', label: 'Transferir', color: Colors.primary },
            { icon: 'add-circle', label: 'Receita', color: Colors.income },
            { icon: 'remove-circle', label: 'Despesa', color: Colors.expense },
            { icon: 'stats-chart', label: 'Relatório', color: Colors.warning },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickAction}
              onPress={() => {
                if (action.label === 'Receita') navigation.navigate('TransactionForm', { type: 'income' });
                else if (action.label === 'Despesa') navigation.navigate('TransactionForm', { type: 'expense' });
              }}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TRANSAÇÕES RECENTES ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas transações</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recent.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <View style={styles.fab}>
        <FloatingButton onPress={() => navigation.navigate('TransactionForm')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: Typography.fontRegular,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: Typography.xl,
    fontFamily: Typography.fontBold,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.expense,
    zIndex: 1,
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  balanceCard: {
    borderRadius: Spacing.radius2xl,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.06,
    top: -60,
    right: -40,
  },
  cardGlow2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.income,
    opacity: 0.05,
    bottom: -30,
    left: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: Typography.fontMedium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eyeBtn: {
    padding: 4,
  },
  balanceAmount: {
    color: Colors.textPrimary,
    fontSize: Typography['3xl'],
    fontFamily: Typography.fontBold,
    letterSpacing: Typography.letterSpacingTight,
    marginBottom: 6,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.base,
  },
  balanceChangeText: {
    color: Colors.income,
    fontSize: Typography.xs,
    fontFamily: Typography.fontMedium,
  },
  chartWrap: {
    marginBottom: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statIconGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: Typography.fontRegular,
  },
  statValue: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontSemiBold,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sectionGap,
  },
  quickAction: {
    alignItems: 'center',
    gap: 6,
  },
  quickIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontFamily: Typography.fontMedium,
  },
  section: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontFamily: Typography.fontSemiBold,
  },
  sectionLink: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontFamily: Typography.fontMedium,
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: 90,
  },
});
