import React, { FC, useMemo } from 'react';
import {
  VictoryBar,
  VictoryAxis,
  VictoryChart,
  VictoryTooltip,
  VictoryGroup,
  VictoryVoronoiContainer
} from 'victory';
import Skeleton from 'react-loading-skeleton';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { commify } from 'ethers/lib/utils';

import { useVictoryTheme } from '../containers/ThemeProvider';
import { Colors } from '../containers/ThemeProvider';
import {
  TransactionType,
  useVolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQueryVariables
} from '../graphql';

import {
  abbreviateNumber,
  useDateFilterTickFormat,
  useDateFilterTickValues
} from 'utils';

import {
  DateRange,
  Metric,
  Metrics,
  useDateFilter,
  useMetrics
} from './Metrics';

interface Datum {
  x: number;
  y: number;
  date: Date;
  type: TransactionType;
}

type Data = Datum[];

interface Group {
  metric: Metric<TransactionType>;
  data: Data;
  loading: boolean;
}

const labels = {
  [TransactionType.StakingContractStaking]: 'Stake',
  [TransactionType.StakingContractUnstaking]: 'UnStake',
  [TransactionType.StakingContractWithDraw]: 'Withdraw',
  [TransactionType.StakingContractReinvest]: 'Reinvest',
  [TransactionType.StakingContractDistribute]: 'Distribute'
};

const colors = {
  [TransactionType.StakingContractStaking]: Colors.green,
  [TransactionType.StakingContractUnstaking]: Colors.red,
  [TransactionType.StakingContractWithDraw]: Colors.yellow,
  [TransactionType.StakingContractReinvest]: Colors.brand,
  [TransactionType.StakingContractDistribute]: Colors.fgMed
};

const colorName = {
  [TransactionType.StakingContractStaking]: 'lid.green',
  [TransactionType.StakingContractUnstaking]: 'lid.red',
  [TransactionType.StakingContractWithDraw]: 'lid.yellow',
  [TransactionType.StakingContractReinvest]: 'lid.brand',
  [TransactionType.StakingContractDistribute]: 'lid.fgMed'
};

const volumeMetrics = [
  {
    type: TransactionType.StakingContractStaking,
    enabled: true,
    label: labels[TransactionType.StakingContractStaking],
    color: colors[TransactionType.StakingContractStaking],
    colorName: colorName[TransactionType.StakingContractStaking]
  },
  {
    type: TransactionType.StakingContractUnstaking,
    label: labels[TransactionType.StakingContractUnstaking],
    color: colors[TransactionType.StakingContractUnstaking],
    colorName: colorName[TransactionType.StakingContractStaking]
  },
  {
    type: TransactionType.StakingContractWithDraw,
    label: labels[TransactionType.StakingContractWithDraw],
    color: colors[TransactionType.StakingContractWithDraw],
    colorName: colorName[TransactionType.StakingContractWithDraw]
  },
  {
    type: TransactionType.StakingContractReinvest,
    enabled: true,
    label: labels[TransactionType.StakingContractReinvest],
    color: colors[TransactionType.StakingContractReinvest],
    colorName: colorName[TransactionType.StakingContractReinvest]
  },
  {
    type: TransactionType.StakingContractDistribute,
    label: labels[TransactionType.StakingContractDistribute],
    color: colors[TransactionType.StakingContractDistribute],
    colorName: colorName[TransactionType.StakingContractDistribute]
  }
];

const useGroup = (
  metric: Metric<TransactionType>,
  variables: Omit<VolumeMetricsOfTypeQueryVariables, 'type'>
): Group => {
  const query = useVolumeMetricsOfTypeQuery({
    variables: { ...variables, type: metric?.type },
    skip: !metric?.enabled,
    fetchPolicy: 'cache-and-network'
  });

  return useMemo(
    () => ({
      loading: query.loading,
      metric,
      data: ((query.data?.volumeMetrics ||
        []) as VolumeMetricsOfTypeQuery['volumeMetrics']).map<Datum>(
        ({ timestamp, value }) => {
          const date = fromUnixTime(timestamp);
          return {
            x: date.getTime(),
            y: parseFloat(parseFloat(value).toFixed(2)),
            date,
            type: metric.type
          };
        }
      )
    }),
    [query.loading, query.data, metric]
  );
};

const useGroups = (): Group[] => {
  const metrics = useMetrics<TransactionType>();
  const dateFilter = useDateFilter();

  const vars = useMemo<Omit<VolumeMetricsOfTypeQueryVariables, 'type'>>(
    () => ({
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end)
    }),
    [dateFilter]
  );

  const stake = useGroup(metrics[TransactionType.StakingContractStaking], vars);
  const unStake = useGroup(
    metrics[TransactionType.StakingContractUnstaking],
    vars
  );
  const withdraw = useGroup(
    metrics[TransactionType.StakingContractWithDraw],
    vars
  );
  const reInvest = useGroup(
    metrics[TransactionType.StakingContractReinvest],
    vars
  );
  const distribute = useGroup(
    metrics[TransactionType.StakingContractDistribute],
    vars
  );

  return useMemo<Group[]>(
    () =>
      [stake, unStake, withdraw, reInvest, distribute].filter(
        (g) => g.metric.enabled
      ),
    [stake, unStake, withdraw, reInvest, distribute]
  );
};

const Chart: FC<{}> = () => {
  const groups = useGroups();
  const loading = groups.some((g) => g.loading);
  const dateFilter = useDateFilter();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const barWidth = dateFilter.dateRange === DateRange.Week ? 8 : 2;
  const victoryTheme = useVictoryTheme();

  return (
    <div>
      {loading ? (
        <Skeleton height={300} />
      ) : (
        <VictoryChart
          theme={victoryTheme}
          height={250}
          padding={{ left: 45, top: 10, right: 20, bottom: 40 }}
          scale="linear"
          domainPadding={{ x: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }: { datum: Datum }) =>
                `${labels[datum.type]}: ${commify(datum.y)} LID`
              }
              labelComponent={
                <VictoryTooltip
                  constrainToVisibleArea
                  cornerRadius={1}
                  flyoutPadding={{ top: 2, bottom: 2, left: 4, right: 4 }}
                  flyoutStyle={{
                    fill: Colors.labelBg
                  }}
                  style={
                    {
                      fill: ({ datum }: { datum: Datum }) => colors[datum.type]
                    } as {}
                  }
                />
              }
            />
          }
        >
          <VictoryAxis
            dependentAxis
            tickFormat={abbreviateNumber}
            style={{
              ticks: { stroke: 'none' }
            }}
          />
          <VictoryAxis
            scale="time"
            tickValues={tickValues}
            tickFormat={tickFormat}
            fixLabelOverlap
            style={{
              grid: { stroke: 'none' },
              tickLabels: { padding: 6 }
            }}
          />
          <VictoryGroup offset={barWidth}>
            {groups.map(({ data, metric }: Group) => (
              <VictoryBar
                alignment="start"
                key={metric.type}
                data={data}
                barWidth={barWidth}
                style={{
                  data: {
                    fill: metric.color,
                    opacity: ({ active }: { active: boolean }) =>
                      active ? '1' : '0.6'
                  }
                }}
              />
            ))}
          </VictoryGroup>
        </VictoryChart>
      )}
    </div>
  );
};

export const VolumeChart: FC<{}> = () => (
  <Metrics metrics={volumeMetrics}>
    <Chart />
  </Metrics>
);
