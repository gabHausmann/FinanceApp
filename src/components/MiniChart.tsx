// ============================================================
// MINI CHART — Gráfico de linha SVG para o dashboard
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface DataPoint {
  day: string;
  value: number;
}

interface MiniChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  showLabels?: boolean;
}

export function MiniChart({
  data,
  width = 280,
  height = 80,
  color = Colors.primary,
  showDots = true,
  showLabels = true,
}: MiniChartProps) {
  if (!data || data.length < 2) return null;

  const paddingH = 8;
  const paddingV = 12;
  const chartW = width - paddingH * 2;
  const chartH = height - paddingV * 2;

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const toX = (i: number) => paddingH + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => paddingV + (1 - (v - min) / range) * chartH;

  // Smooth bezier curve
  let d = `M ${toX(0)} ${toY(data[0].value)}`;
  for (let i = 1; i < data.length; i++) {
    const x0 = toX(i - 1);
    const y0 = toY(data[i - 1].value);
    const x1 = toX(i);
    const y1 = toY(data[i].value);
    const cpx = (x0 + x1) / 2;
    d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
  }

  // Fill path (close to bottom)
  const lastX = toX(data.length - 1);
  const lastY = toY(data[data.length - 1].value);
  const fillD = `${d} L ${lastX} ${height} L ${toX(0)} ${height} Z`;

  const lastIdx = data.length - 1;

  return (
    <View style={{ width, height: height + (showLabels ? 22 : 0) }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </SvgGradient>
        </Defs>
        {/* Fill */}
        <Path d={fillD} fill="url(#lineGrad)" />
        {/* Line */}
        <Path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {showDots && data.map((point, i) => (
          <Circle
            key={i}
            cx={toX(i)}
            cy={toY(point.value)}
            r={i === lastIdx ? 5 : 3}
            fill={i === lastIdx ? color : Colors.surface}
            stroke={color}
            strokeWidth={i === lastIdx ? 0 : 1.5}
          />
        ))}
      </Svg>
      {showLabels && (
        <View style={styles.labels}>
          {data.map((point, i) => (
            <Text key={i} style={[
              styles.dayLabel,
              i === lastIdx && { color },
            ]}>
              {point.day}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// BAR CHART — Gráfico de barras para relatórios
// ============================================================

interface BarDataPoint {
  month: string;
  income: number;
  expense: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  width?: number;
  height?: number;
}

export function BarChart({ data, width = 300, height = 120 }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const barGroupWidth = (width - 40) / data.length;
  const barWidth = (barGroupWidth - 16) / 2;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]));
  const chartH = height - 30;
  const padLeft = 20;

  const toH = (v: number) => (v / maxVal) * chartH;

  return (
    <View style={{ width, height: height + 20 }}>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const groupX = padLeft + i * barGroupWidth;
          const incomeH = toH(d.income);
          const expenseH = toH(d.expense);

          return (
            <React.Fragment key={i}>
              {/* Income bar */}
              <Path
                d={`M ${groupX + 2} ${chartH - incomeH} 
                    L ${groupX + 2} ${chartH} 
                    L ${groupX + 2 + barWidth} ${chartH} 
                    L ${groupX + 2 + barWidth} ${chartH - incomeH} 
                    Q ${groupX + 2 + barWidth / 2} ${chartH - incomeH - 4} ${groupX + 2} ${chartH - incomeH} Z`}
                fill={Colors.income + 'BB'}
              />
              {/* Expense bar */}
              <Path
                d={`M ${groupX + barWidth + 6} ${chartH - expenseH} 
                    L ${groupX + barWidth + 6} ${chartH} 
                    L ${groupX + barWidth * 2 + 6} ${chartH} 
                    L ${groupX + barWidth * 2 + 6} ${chartH - expenseH} 
                    Q ${groupX + barWidth * 1.5 + 6} ${chartH - expenseH - 4} ${groupX + barWidth + 6} ${chartH - expenseH} Z`}
                fill={Colors.expense + 'BB'}
              />
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={[styles.barLabels, { paddingLeft: padLeft }]}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.barLabel, { width: barGroupWidth }]}>
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ============================================================
// DONUT CHART — Gráfico de rosca para categorias
// ============================================================

interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ segments, size = 140, strokeWidth = 22 }: DonutChartProps) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let cumulativePercent = 0;

  return (
    <Svg width={size} height={size}>
      {/* Background ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={Colors.border}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {segments.map((seg, i) => {
        const percent = seg.value / total;
        const offset = circumference * (1 - percent);
        const rotation = cumulativePercent * 360 - 90;
        cumulativePercent += percent;
        return (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            stroke={seg.color}
            strokeWidth={strokeWidth - 2}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${offset}`}
            strokeLinecap="round"
            rotation={rotation}
            origin={`${cx}, ${cy}`}
          />
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: Typography.fontRegular,
    textAlign: 'center',
  },
  barLabels: {
    flexDirection: 'row',
    marginTop: 4,
  },
  barLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: Typography.fontRegular,
    textAlign: 'center',
  },
});
