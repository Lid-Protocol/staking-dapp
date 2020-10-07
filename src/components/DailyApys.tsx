import React, { FC, useMemo } from 'react';
import { VictoryLabel, VictoryLine, VictoryChart, VictoryAxis } from 'victory';
import Skeleton from 'react-loading-skeleton';
import {
  endOfHour,
  fromUnixTime,
  subDays,
  getUnixTime,
  closestTo
} from 'date-fns';

import { useVictoryTheme } from '../containers/ThemeProvider';

import {
  abbreviateNumber,
  percentageFormat,
  useDateFilterTickValues,
  useDateFilterTickFormat
} from 'utils';
import { DateRange } from './Metrics';

import {
  TransactionType,
  AggregateMetricType,
  TimeMetricPeriod,
  useVolumeMetricsOfTypeQuery,
  useAggregateMetricsOfTypeQuery
} from '../graphql';

const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  label: '7 day',
  from: subDays(new Date(), 6),
  end: endOfHour(new Date())
};

const useDailyApysForPastWeek = () => {
  const queryStake = useAggregateMetricsOfTypeQuery({
    variables: {
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
      type: AggregateMetricType.TotalStaked
    },
    skip: false,
    fetchPolicy: 'cache-and-network'
  });

  const queryDistribute = useVolumeMetricsOfTypeQuery({
    variables: {
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
      type: TransactionType.StakingContractDistribute
    },
    skip: false,
    fetchPolicy: 'cache-and-network'
  });

  return useMemo(
    () => ({
      loading: queryStake.loading || queryDistribute.loading,
      data:
        !queryStake.data || !queryDistribute.data
          ? []
          : queryStake.data.aggregateMetrics.map(
              ({ timestamp, value: stakeVal }, index) => {
                const date = fromUnixTime(timestamp);
                const distributeVal =
                  queryDistribute.data?.volumeMetrics[index].value;
                const percentage =
                  parseFloat(stakeVal) === 0
                    ? 0
                    : parseFloat(
                        (
                          ((parseFloat(distributeVal!) * 365) /
                            parseFloat(stakeVal)) *
                          100
                        ).toFixed(2)
                      );
                return {
                  percentage,
                  date
                };
              }
            )
    }),
    [
      queryStake.loading,
      queryDistribute.loading,
      queryStake.data,
      queryDistribute.data
    ]
  );
};

export const DailyApys: FC<{}> = () => {
  const dailyApys = useDailyApysForPastWeek();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();

  const data = useMemo<{ x: Date; y: number }[]>(
    () =>
      dailyApys.data.map(({ date, percentage }) => {
        return {
          x: closestTo(date.getTime(), tickValues),
          y: percentage,
          percentage
        };
      }),

    [dailyApys, tickValues]
  );

  return (
    <>
      {data.length ? (
        <VictoryChart
          theme={victoryTheme}
          height={200}
          domainPadding={25}
          padding={{ left: 45, top: 0, right: 20, bottom: 40 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(num: number) => `${abbreviateNumber(num)}%`}
            fixLabelOverlap
            style={{
              ticks: { stroke: 'none' }
            }}
          />
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={tickFormat}
            style={{
              grid: { stroke: 'none' }
            }}
          />
          <VictoryLine
            data={data}
            labelComponent={<VictoryLabel />}
            labels={({
              datum: { percentage }
            }: {
              datum: { y: number; percentage: number };
            }) =>
              percentage > 100
                ? `${percentageFormat(percentage)} 🔥`
                : percentageFormat(percentage)
            }
            style={{
              data: {
                stroke: '#62BEE4',
                strokeWidth: 2
              }
            }}
          />
        </VictoryChart>
      ) : (
        <Skeleton height={270} />
      )}
    </>
  );
};
