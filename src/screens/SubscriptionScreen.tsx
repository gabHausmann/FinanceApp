// ============================================================
// SUBSCRIPTION — Tela de planos premium
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { SubscriptionPlan } from '../types';

interface Plan {
  id: SubscriptionPlan;
  name: string;
  price: string;
  priceNote: string;
  features: { icon: string; label: string; included: boolean }[];
  gradient: string[];
  highlight: boolean;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    priceNote: 'para sempre',
    gradient: [Colors.surface, Colors.card],
    highlight: false,
    features: [
      { icon: 'checkmark-circle', label: 'Até 50 transações/mês', included: true },
      { icon: 'checkmark-circle', label: 'Histórico básico', included: true },
      { icon: 'checkmark-circle', label: 'Dashboard simples', included: true },
      { icon: 'close-circle', label: 'Relatórios avançados', included: false },
      { icon: 'close-circle', label: 'Exportação PDF', included: false },
      { icon: 'close-circle', label: 'Sincronização cloud', included: false },
      { icon: 'close-circle', label: 'Múltiplas contas', included: false },
      { icon: 'close-circle', label: 'IA financeira', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 14,90',
    priceNote: 'por mês',
    gradient: Colors.gradientPrimary,
    highlight: true,
    badge: 'Mais popular',
    features: [
      { icon: 'checkmark-circle', label: 'Transações ilimitadas', included: true },
      { icon: 'checkmark-circle', label: 'Histórico completo', included: true },
      { icon: 'checkmark-circle', label: 'Dashboard avançado', included: true },
      { icon: 'checkmark-circle', label: 'Relatórios avançados', included: true },
      { icon: 'checkmark-circle', label: 'Exportação PDF', included: true },
      { icon: 'checkmark-circle', label: 'Sincronização cloud', included: true },
      { icon: 'checkmark-circle', label: 'Múltiplas contas', included: true },
      { icon: 'close-circle', label: 'IA financeira', included: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R$ 39,90',
    priceNote: 'por mês',
    gradient: Colors.gradientGold,
    highlight: false,
    badge: 'Melhor valor',
    features: [
      { icon: 'checkmark-circle', label: 'Tudo do Premium', included: true },
      { icon: 'checkmark-circle', label: 'IA financeira', included: true },
      { icon: 'checkmark-circle', label: 'Metas financeiras', included: true },
      { icon: 'checkmark-circle', label: 'Sem anúncios', included: true },
      { icon: 'checkmark-circle', label: 'Suporte prioritário', included: true },
      { icon: 'checkmark-circle', label: 'Relatórios empresariais', included: true },
      { icon: 'checkmark-circle', label: 'API de integração', included: true },
      { icon: 'checkmark-circle', label: 'Multi-usuário', included: true },
    ],
  },
];

function PlanCard({ plan, isActive, onSelect }: {
  plan: Plan;
  isActive: boolean;
  onSelect: () => void;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
    <TouchableOpacity
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.planCard, isActive && styles.planCardActive]}
    >
      {plan.highlight ? (
        <LinearGradient colors={plan.gradient} style={styles.planGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <PlanCardContent plan={plan} isActive={isActive} highlight />
        </LinearGradient>
      ) : (
        <View style={styles.planGrad}>
          <PlanCardContent plan={plan} isActive={isActive} highlight={false} />
        </View>
      )}
    </TouchableOpacity>
    </Animated.View>
  );
}

function PlanCardContent({ plan, isActive, highlight }: {
  plan: Plan;
  isActive: boolean;
  highlight: boolean;
}) {
  const textColor = highlight ? Colors.white : Colors.textPrimary;
  const subColor = highlight ? 'rgba(255,255,255,0.7)' : Colors.textSecondary;
  const checkColor = highlight ? Colors.white : Colors.income;
  const crossColor = highlight ? 'rgba(255,255,255,0.3)' : Colors.textMuted;

  return (
    <>
      {plan.badge && (
        <View style={[styles.badge, { backgroundColor: highlight ? 'rgba(255,255,255,0.2)' : Colors.goldMuted }]}>
          <Text style={[styles.badgeText, { color: highlight ? Colors.white : Colors.gold }]}>
            {plan.badge}
          </Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <Text style={[styles.planName, { color: textColor }]}>{plan.name}</Text>
        {isActive && (
          <View style={[styles.activeBadge, { backgroundColor: highlight ? 'rgba(255,255,255,0.2)' : Colors.primaryMuted }]}>
            <Ionicons name="checkmark" size={12} color={highlight ? Colors.white : Colors.primary} />
            <Text style={[styles.activeBadgeText, { color: highlight ? Colors.white : Colors.primary }]}>Ativo</Text>
          </View>
        )}
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: textColor }]}>{plan.price}</Text>
        <Text style={[styles.priceNote, { color: subColor }]}>/{plan.priceNote}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.featuresList}>
        {plan.features.map((f, i) => (
          <View key={i} style={styles.featureItem}>
            <Ionicons
              name={f.included ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={f.included ? checkColor : crossColor}
            />
            <Text style={[
              styles.featureText,
              { color: f.included ? (highlight ? Colors.white : Colors.textSecondary) : crossColor },
              !f.included && styles.featureTextDisabled,
            ]}>
              {f.label}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

export function SubscriptionScreen() {
  const { activePlan, setActivePlan } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === activePlan) return;
    setPendingPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingPlan) {
      setActivePlan(pendingPlan.id);
    }
    setShowConfirm(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── HEADER ── */}
        <View style={styles.topSection}>
          <LinearGradient
            colors={[Colors.primaryGlow, Colors.transparent]}
            style={styles.glowBg}
          />
          <Text style={styles.subtitle}>Escolha seu plano</Text>
          <Text style={styles.title}>Desbloqueie o controle{'\n'}financeiro completo</Text>
          <Text style={styles.desc}>
            Gerencie seu dinheiro com ferramentas profissionais e relatórios inteligentes.
          </Text>
        </View>

        {/* ── PLANOS ── */}
        <View style={styles.plans}>
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={activePlan === plan.id}
              onSelect={() => handleSelectPlan(plan)}
            />
          ))}
        </View>

        {/* ── BENEFÍCIOS ── */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Por que fazer upgrade?</Text>
          {[
            { icon: 'shield-checkmark', title: 'Segurança avançada', desc: 'Criptografia de ponta a ponta para seus dados financeiros.', color: Colors.primary },
            { icon: 'sparkles', title: 'IA Financeira', desc: 'Insights inteligentes sobre seus hábitos de consumo.', color: Colors.gold },
            { icon: 'cloud-upload', title: 'Sync na nuvem', desc: 'Acesse seus dados de qualquer dispositivo, sempre atualizado.', color: Colors.income },
            { icon: 'document-text', title: 'Exportação PDF', desc: 'Gere relatórios profissionais em segundos.', color: Colors.expense },
          ].map((b, i) => (
            <View key={i} style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: b.color + '18' }]}>
                <Ionicons name={b.icon as any} size={22} color={b.color} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.legal}>
          Cancele a qualquer momento. Cobrança recorrente mensal. Ao assinar você concorda com os Termos de Uso.
        </Text>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── CONFIRM MODAL ── */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <LinearGradient colors={Colors.gradientPrimary} style={styles.modalIconGrad}>
                <Ionicons name="star" size={28} color={Colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.modalTitle}>
              Ativar plano {pendingPlan?.name}?
            </Text>
            <Text style={styles.modalDesc}>
              Você será cobrado {pendingPlan?.price} {pendingPlan?.priceNote}. Cancele quando quiser.
            </Text>
            <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleConfirm}>
              <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalConfirmGrad}>
                <Text style={styles.modalConfirmText}>Confirmar assinatura</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowConfirm(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.screenPadding },

  topSection: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glowBg: {
    position: 'absolute',
    top: 0,
    width: 300,
    height: 200,
    borderRadius: 150,
    opacity: 0.5,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontFamily: Typography.fontSemiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography['2xl'],
    fontFamily: Typography.fontBold,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontFamily: Typography.fontRegular,
    textAlign: 'center',
    lineHeight: 22,
  },

  plans: { gap: Spacing.md, marginBottom: Spacing.xl },
  planCard: {
    borderRadius: Spacing.radiusXl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  planCardActive: {
    borderColor: Colors.primary,
  },
  planGrad: {
    padding: Spacing.cardPadding,
    gap: 4,
    backgroundColor: Colors.surface,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Spacing.radiusFull,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontSemiBold,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  planName: {
    fontSize: Typography.lg,
    fontFamily: Typography.fontBold,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Spacing.radiusFull,
  },
  activeBadgeText: {
    fontSize: Typography.xs,
    fontFamily: Typography.fontSemiBold,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: Spacing.base,
  },
  price: { fontSize: Typography['2xl'], fontFamily: Typography.fontBold },
  priceNote: { fontSize: Typography.sm, fontFamily: Typography.fontRegular },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: Spacing.base },
  featuresList: { gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: {
    fontSize: Typography.sm,
    fontFamily: Typography.fontRegular,
  },
  featureTextDisabled: {
    textDecorationLine: 'line-through',
  },

  benefitsSection: { gap: Spacing.base, marginBottom: Spacing.xl },
  benefitsTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontFamily: Typography.fontSemiBold,
    marginBottom: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusMd,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: Spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { flex: 1, gap: 3 },
  benefitTitle: { color: Colors.textPrimary, fontSize: Typography.base, fontFamily: Typography.fontSemiBold },
  benefitDesc: { color: Colors.textSecondary, fontSize: Typography.sm, fontFamily: Typography.fontRegular, lineHeight: 18 },

  legal: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Typography.fontRegular,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: Spacing.base,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radius2xl,
    padding: Spacing.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  modalIcon: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden' },
  modalIconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontFamily: Typography.fontBold,
    textAlign: 'center',
  },
  modalDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontFamily: Typography.fontRegular,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalConfirmBtn: { width: '100%', borderRadius: Spacing.radiusFull, overflow: 'hidden' },
  modalConfirmGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmText: { color: Colors.white, fontSize: Typography.base, fontFamily: Typography.fontSemiBold },
  modalCancelBtn: { paddingVertical: 8 },
  modalCancelText: { color: Colors.textMuted, fontSize: Typography.base, fontFamily: Typography.fontRegular },
});

