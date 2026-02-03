import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Svg, { Line, Circle, Path, Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { WeightEntry } from "@/types";
import { format, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeightChartProps {
  entries: WeightEntry[];
  currentWeight: number;
}

export function WeightChart({ entries, currentWeight }: WeightChartProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width - Spacing.lg * 4;
  const chartHeight = 120;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 25;
  const chartWidth = screenWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    return format(date, "yyyy-MM-dd");
  });

  const entriesMap = new Map(entries.map(e => [e.date, e.weight]));
  const dataPoints = last14Days.map(date => entriesMap.get(date) || currentWeight);

  const minWeight = Math.min(...dataPoints) - 1;
  const maxWeight = Math.max(...dataPoints) + 1;
  const weightRange = maxWeight - minWeight || 1;

  const getX = (index: number) => paddingLeft + (index / (dataPoints.length - 1)) * chartWidth;
  const getY = (weight: number) => paddingTop + graphHeight - ((weight - minWeight) / weightRange) * graphHeight;

  const ctmValues = dataPoints.map((_, i) => {
    const start = Math.max(0, i - 6);
    const slice = dataPoints.slice(start, i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const ctmPath = ctmValues
    .map((val, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(val)}`)
    .join(" ");

  const weeklyChange = entries.length >= 7
    ? (currentWeight - (entries[entries.length - 7]?.weight || currentWeight)).toFixed(1)
    : "0.0";

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="trending-up" size={16} color={AppColors.teal} />
          <ThemedText style={styles.headerTitle}>Tendência de Peso</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <Feather name="trending-up" size={12} color={AppColors.teal} />
          <ThemedText type="small" style={{ color: AppColors.teal, marginLeft: 4 }}>
            {parseFloat(weeklyChange) >= 0 ? "+" : ""}{weeklyChange} kg/sem
          </ThemedText>
        </View>
      </View>

      <View style={styles.weightDisplay}>
        <ThemedText style={styles.weightValue}>{currentWeight}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>kg</ThemedText>
      </View>

      <Svg width={screenWidth} height={chartHeight}>
        {[minWeight, (minWeight + maxWeight) / 2, maxWeight].map((val, i) => (
          <React.Fragment key={i}>
            <Line
              x1={paddingLeft}
              y1={getY(val)}
              x2={screenWidth - paddingRight}
              y2={getY(val)}
              stroke={theme.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <SvgText
              x={paddingLeft - 5}
              y={getY(val) + 4}
              fill={theme.textSecondary}
              fontSize={10}
              textAnchor="end"
            >
              {Math.round(val)}
            </SvgText>
          </React.Fragment>
        ))}

        <Path
          d={ctmPath}
          stroke={AppColors.teal}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {ctmValues.map((val, i) => (
          <Circle
            key={i}
            cx={getX(i)}
            cy={getY(val)}
            r={3}
            fill={AppColors.teal}
          />
        ))}

        {[0, 6, 13].map((i) => (
          <SvgText
            key={i}
            x={getX(i)}
            y={chartHeight - 5}
            fill={theme.textSecondary}
            fontSize={9}
            textAnchor="middle"
          >
            {format(subDays(new Date(), 13 - i), "d/M", { locale: ptBR })}
          </SvgText>
        ))}
      </Svg>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.textSecondary }]} />
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Peso diário</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: AppColors.teal }]} />
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Média CTM (7 dias)</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
});
