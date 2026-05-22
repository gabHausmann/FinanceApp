// ============================================================
// APP CONTEXT — Estado global da aplicação
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Transaction, User, SubscriptionPlan } from '../types';
import { MOCK_TRANSACTIONS, MOCK_USER } from '../data/mockData';
import { calcBalance } from '../utils/formatters';

interface AppContextValue {
  transactions: Transaction[];
  user: User;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateUser: (u: Partial<User>) => void;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  activePlan: SubscriptionPlan;
  setActivePlan: (plan: SubscriptionPlan) => void;
  balanceVisible: boolean;
  toggleBalanceVisible: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: `t${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateUser = useCallback((u: Partial<User>) => {
    setUser(prev => ({ ...prev, ...u }));
  }, []);

  const setActivePlan = useCallback((plan: SubscriptionPlan) => {
    setUser(prev => ({ ...prev, plan }));
  }, []);

  const toggleBalanceVisible = useCallback(() => {
    setBalanceVisible(prev => !prev);
  }, []);

  // Apenas transações do mês atual para o dashboard
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const balance = calcBalance(transactions);
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <AppContext.Provider value={{
      transactions,
      user,
      addTransaction,
      deleteTransaction,
      updateUser,
      balance,
      totalIncome,
      totalExpense,
      activePlan: user.plan,
      setActivePlan,
      balanceVisible,
      toggleBalanceVisible,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
