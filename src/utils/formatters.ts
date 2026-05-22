// ============================================================
// FORMATTERS — Utilitários de formatação
// ============================================================

/**
 * Formata valor em BRL
 */
export function formatCurrency(value: number, showSign = false): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));
  if (showSign) return value >= 0 ? `+${formatted}` : `-${formatted}`;
  return formatted;
}

/**
 * Formata data em pt-BR
 */
export function formatDate(isoString: string, style: 'short' | 'medium' | 'long' = 'medium'): string {
  const date = new Date(isoString);
  if (style === 'short') {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  if (style === 'long') {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Retorna mês/ano no formato "Maio 2025"
 */
export function formatMonthYear(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/**
 * Retorna apenas o mês abreviado
 */
export function getMonthKey(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/**
 * Agrupa transações por mês
 */
export function groupByMonth<T extends { date: string }>(
  items: T[]
): { key: string; label: string; data: T[] }[] {
  const map = new Map<string, T[]>();
  items.forEach(item => {
    const key = getMonthKey(item.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  });
  return Array.from(map.entries())
    .sort((a, b) => {
      const da = new Date(a[1][0].date);
      const db = new Date(b[1][0].date);
      return db.getTime() - da.getTime();
    })
    .map(([key, data]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      data,
    }));
}

/**
 * Formata valor compacto (ex: 10.6k)
 */
export function formatCompact(value: number): string {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
}

/**
 * Calcula saldo total
 */
export function calcBalance(transactions: { type: string; amount: number }[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
}
