import React, { FC, useMemo } from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import { addDays, fromUnixTime, getUnixTime } from 'date-fns';
import { commify } from 'ethers/lib/utils';
import Skeleton from 'react-loading-skeleton';
import { useVictoryTheme } from '../containers/ThemeProvider';

import {
  AggregateMetricsOfTypeQuery,
  AggregateMetricsOfTypeQueryVariables,
  AggregateMetricType,
  useAggregateMetricsOfTypeQuery
} from '../graphql';

import {
  abbreviateNumber,
  useDateFilterTickFormat,
  useDateFilterTickValues
} from 'utils';

import { Colors } from '../containers/ThemeProvider';
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
  type: AggregateMetricType;
}

type Data = Datum[];

interface Group {
  data: Data;
  loading: boolean;
  metric: Metric<AggregateMetricType>;
}

const colors = {
  [AggregateMetricType.TotalSupply]: Colors.brand,
  [AggregateMetricType.TotalStaked]: Colors.green
};

const colorName = {
  [AggregateMetricType.TotalSupply]: 'lid.brand',
  [AggregateMetricType.TotalStaked]: 'lid.green'
};

const labels = {
  [AggregateMetricType.TotalSupply]: 'Total Supply',
  [AggregateMetricType.TotalStaked]: 'Total Staked'
};

const aggregateMetrics = [
  {
    type: AggregateMetricType.TotalSupply,
    enabled: true,
    label: 'Total Supply',
    color: colors[AggregateMetricType.TotalSupply],
    colorName: colorName[AggregateMetricType.TotalSupply]
  },
  {
    type: AggregateMetricType.TotalStaked,
    enabled: true,
    label: 'Total Staked',
    color: colors[AggregateMetricType.TotalStaked],
    colorName: colorName[AggregateMetricType.TotalStaked]
  }
];

const useGroup = (
  metric: Metric<AggregateMetricType>,
  variables: Omit<AggregateMetricsOfTypeQueryVariables, 'type'>
): Group => {
  const query = useAggregateMetricsOfTypeQuery({
    variables: { ...variables, type: metric?.type },
    skip: !metric?.enabled,
    fetchPolicy: 'cache-and-network'
  });

  return useMemo(
    () => ({
      metric,
      loading: query.loading,
      data: ((query.data?.aggregateMetrics ||
        []) as AggregateMetricsOfTypeQuery['aggregateMetrics']).map<Datum>(
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
    [query.data, query.loading, metric]
  );
};

const TOMORROW = addDays(new Date(), 1);

const Chart: FC<{}> = () => {
  const metrics = useMetrics<AggregateMetricType>();
  const dateFilter = useDateFilter();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();

  const vars = useMemo<Omit<AggregateMetricsOfTypeQueryVariables, 'type'>>(
    () => ({
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(new Date())
    }),
    [dateFilter]
  );

  const totalSupply = useGroup(metrics[AggregateMetricType.TotalSupply], vars);
  const totalSavings = useGroup(metrics[AggregateMetricType.TotalStaked], vars);

  const groups = useMemo<Group[]>(
    () => [totalSupply, totalSavings].filter((g) => g.metric.enabled),
    [totalSupply, totalSavings]
  );

  const loading = groups.some((g) => g.loading);

  return (
    <div>
      {loading ? (
        <Skeleton height={300} />
      ) : (
        <VictoryChart
          theme={victoryTheme}
          scale="linear"
          height={250}
          padding={{ left: 45, top: 10, right: 20, bottom: 40 }}
          domainPadding={{ y: 20 }}
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
            fixLabelOverlap
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
          {groups.map(({ metric: { type, color }, data }) => (
            <VictoryLine
              key={type}
              data={data}
              style={{
                data: {
                  stroke: color
                }
              }}
            />
          ))}
        </VictoryChart>
      )}
    </div>
  );
};

export const AggregateChart: FC<{}> = () => (
  <Metrics metrics={aggregateMetrics} defaultDateRange={DateRange.Month}>
    <Chart />
  </Metrics>
);
