// ============================================================
// PROFILE — Tela de perfil e configurações
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

import { useApp } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: Colors.textMuted },
  premium: { label: 'Premium', color: Colors.primary },
  business: { label: 'Business', color: Colors.gold },
};

export function ProfileScreen() {
  const { user, updateUser } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const plan = PLAN_LABELS[user.plan];

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Habilite o acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const settingsSections = [
    {
      title: 'Conta',
      items: [
        { icon: 'person-outline', label: 'Editar perfil', onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento.') },
        { icon: 'mail-outline', label: user.email, onPress: () => {} },
        { icon: 'card-outline', label: `Plano ${plan.label}`, color: plan.color, onPress: () => Alert.alert('Plano', `Você está no plano ${plan.label}.`) },
      ],
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notificações',
          toggle: true,
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'finger-print-outline',
          label: 'Biometria',
          toggle: true,
          toggleValue: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          icon: 'language-outline',
          label: 'Idioma: Português (BR)',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Dados',
      items: [
        { icon: 'download-outline', label: 'Exportar dados', onPress: () => Alert.alert('Exportar', 'Seus dados serão enviados por e-mail.') },
        { icon: 'cloud-upload-outline', label: 'Backup na nuvem', onPress: () => Alert.alert('Backup', 'Backup realizado com sucesso!') },
        { icon: 'trash-outline', label: 'Apagar todas as transações', onPress: () => Alert.alert('Atenção', 'Esta ação é irreversível.'), danger: true },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: 'help-circle-outline', label: 'Central de ajuda', onPress: () => {} },
        { icon: 'chatbubble-outline', label: 'Fale conosco', onPress: () => {} },
        { icon: 'star-outline', label: 'Avaliar o app', onPress: () => {} },
        { icon: 'information-circle-outline', label: 'Versão 1.0.0', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── HEADER ── */}
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* ── AVATAR CARD ── */}
        <LinearGradient
          colors={['#1A1F35', '#0D1321']}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardGlow} />

          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={styles.avatarEdit}>
              <Ionicons name="camera" size={12} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={[styles.planTag, { backgroundColor: plan.color + '22', borderColor: plan.color + '44' }]}>
            <Ionicons name="star" size={12} color={plan.color} />
            <Text style={[styles.planTagText, { color: plan.color }]}>Plano {plan.label}</Text>
          </View>

          {/* Stats rápidos */}
          <View style={styles.statsRow}>
            {[
              { label: 'Transações', value: '17' },
              { label: 'Meses ativos', value: '3' },
              { label: 'Economia', value: '28%' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* ── SETTINGS ── */}
        {settingsSections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item: any, ii) => (
                <React.Fragment key={ii}>
                  {ii > 0 && <View style={styles.itemDivider} />}
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={item.toggle ? undefined : item.onPress}
                    activeOpacity={item.toggle ? 1 : 0.7}
                  >
                    <View style={[
                      styles.settingIcon,
                      { backgroundColor: (item.danger ? Colors.expense : item.color ?? Colors.primary) + '18' }
                    ]}>
                      <Ionicons
                        name={item.icon as any}
                        size={18}
                        color={item.danger ? Colors.expense : item.color ?? Colors.primary}
                      />
                    </View>
                    <Text style={[
                      styles.settingLabel,
                      item.danger && { color: Colors.expense },
                    ]}>
                      {item.label}
                    </Text>
                    {item.toggle ? (
                      <Switch
                        value={item.toggleValue}
                        onValueChange={item.onToggle}
                        trackColor={{ false: Colors.border, true: Colors.primaryMuted }}
                        thumbColor={item.toggleValue ? Colors.primary : Colors.textMuted}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* ── LOGOUT ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert('Sair', 'Deseja sair da sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => {} },
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.expense} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.screenPadding },

  screenTitle: {
    color: Colors.textPrimary,
    fontSize: Typography['2xl'],
    fontFamily: Typography.fontBold,
    paddingTop: Spacing.base,
    marginBottom: Spacing.xl,
  },

  profileCard: {
    borderRadius: Spacing.radius2xl,
    padding: Spacing.cardPadding,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.05,
    top: -60,
    right: -40,
  },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryLight,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.xl,
    fontFamily: Typography.fontBold,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontFamily: Typography.fontBold,
    marginTop: 4,
  },
  userEmail: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: Typography.fontRegular,
  },
  planTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Spacing.radiusFull,
    borderWidth: 1,
    marginTop: 2,
  },
  planTagText: { fontSize: Typography.sm, fontFamily: Typography.fontSemiBold },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { color: Colors.textPrimary, fontSize: Typography.lg, fontFamily: Typography.fontBold },
  statLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: Typography.fontRegular },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  section: { marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: Typography.xs,
    fontFamily: Typography.fontSemiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontFamily: Typography.fontRegular,
  },
  itemDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 64 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.expenseMuted,
    borderRadius: Spacing.radiusFull,
    borderWidth: 1,
    borderColor: Colors.expense + '44',
    marginBottom: Spacing.base,
  },
  logoutText: {
    color: Colors.expense,
    fontSize: Typography.base,
    fontFamily: Typography.fontSemiBold,
  },
});
