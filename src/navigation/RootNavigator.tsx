import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TransactionFormScreen } from '../screens/TransactionFormScreen';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ITEMS = [
  { name: 'Dashboard' as const, label: 'Início', icon: 'home', iconOutline: 'home-outline' },
  { name: 'History' as const, label: 'Histórico', icon: 'receipt', iconOutline: 'receipt-outline' },
  { name: 'Reports' as const, label: 'Relatórios', icon: 'stats-chart', iconOutline: 'stats-chart-outline' },
  { name: 'Subscriptions' as const, label: 'Planos', icon: 'star', iconOutline: 'star-outline' },
  { name: 'Profile' as const, label: 'Perfil', icon: 'person', iconOutline: 'person-outline' },
];

function TabItem({ item, isFocused, onPress }: { item: typeof TAB_ITEMS[0]; isFocused: boolean; onPress: () => void }) {
  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: isFocused ? 1 : 0, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  }, [isFocused]);

  const indicatorStyle = {
    opacity: anim,
    transform: [{ scaleX: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
  };
  const iconStyle = {
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem} activeOpacity={0.8}>
      <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
      <Animated.View style={iconStyle}>
        <Ionicons name={(isFocused ? item.icon : item.iconOutline) as any} size={22} color={isFocused ? Colors.primary : Colors.textMuted} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: isFocused ? Colors.primary : Colors.textMuted }]}>{item.label}</Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => (
        <TabItem
          key={route.key}
          item={TAB_ITEMS[index]}
          isFocused={state.index === index}
          onPress={() => { if (state.index !== index) navigation.navigate(route.name); }}
        />
      ))}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Subscriptions" component={SubscriptionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TransactionForm" component={TransactionFormScreen}
          options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8, shadowColor: Colors.black, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 16 },
  tabItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4, position: 'relative' },
  activeIndicator: { position: 'absolute', top: -8, width: 24, height: 3, borderRadius: 1.5, backgroundColor: Colors.primary },
  tabLabel: { fontSize: 10, fontFamily: Typography.fontMedium },
});
