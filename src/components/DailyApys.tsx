import React, { FC, useMemo } from 'react';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import { endOfHour, fromUnixTime, subDays, getUnixTime } from 'date-fns';

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
  TimeMetricPeriod,
  useVolumeMetricsOfTypeQuery
} from '../graphql';

const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  label: '7 day',
  from: subDays(new Date(), 6),
  end: endOfHour(new Date())
};

const useDailyApysForPastWeek = () => {
  const queryStake = useVolumeMetricsOfTypeQuery({
    variables: {
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
      type: TransactionType.StakingContractStaking
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
          : queryStake.data.volumeMetrics.map(
              ({ timestamp, value: stakeVal }, index) => {
                const date = fromUnixTime(timestamp);
                const distributeVal =
                  queryDistribute.data?.volumeMetrics[index].value;
                const percentage =
                  parseFloat(stakeVal) === 0
                    ? 0
                    : parseFloat(
                        (
                          (parseFloat(distributeVal!) / parseFloat(stakeVal)) *
                          100
                        ).toFixed(2)
                      );
                return {
                  x: date.getTime(),
                  y: percentage,
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

  return (
    <>
      {dailyApys.data.length ? (
        <VictoryChart
          theme={victoryTheme}
          height={200}
          domainPadding={25}
          padding={{ left: 45, top: 0, right: 20, bottom: 40 }}
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
            tickValues={tickValues}
            tickFormat={tickFormat}
            style={{
              grid: { stroke: 'none' }
            }}
          />
          <VictoryLine
            data={dailyApys.data as any}
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
