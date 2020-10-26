import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react';
import styled from 'styled-components';
import {
  endOfDay,
  subDays,
  endOfHour,
  subHours,
  startOfDay,
  startOfHour
} from 'date-fns';
import { Text, Box, Flex, Button, Switch } from '@chakra-ui/core';
import { TimeMetricPeriod } from '../graphql';

export enum DateRange {
  Day,
  Week,
  Month
}

export interface Metric<T extends string> {
  type: T;
  label: string;
  enabled?: boolean;
  color?: string;
  colorName?: string;
}

export interface DateFilter {
  dateRange: DateRange;
  from: Date;
  end: Date;
  period: TimeMetricPeriod;
  label: string;
  enabled?: boolean;
}

export interface State<T extends string> {
  metrics: Metric<T>[];
  dates: DateFilter[];
}

enum Actions {
  SetDateRange,
  ToggleType
}

type Action<T extends string> =
  | {
      type: Actions.SetDateRange;
      payload: DateRange;
    }
  | {
      type: Actions.ToggleType;
      payload: T;
    };

interface Dispatch<T extends string> {
  setDateRange(dateRange: DateRange): void;
  toggleType(type: T): void;
}

const ChartContainer = styled.div`
  svg {
    overflow: visible;
  }
`;

const reducer: Reducer<State<any>, Action<any>> = (state, action) => {
  switch (action.type) {
    case Actions.SetDateRange: {
      const dateRange = action.payload;
      return {
        ...state,
        dates: state.dates.map((d) =>
          d.dateRange === dateRange
            ? { ...d, enabled: true }
            : { ...d, enabled: false }
        )
      };
    }

    case Actions.ToggleType: {
      const type = action.payload;
      return {
        ...state,
        metrics: state.metrics.map((t) =>
          t.type === type ? { ...t, enabled: !t.enabled } : t
        )
      };
    }

    default:
      return state;
  }
};

const END_OF_HOUR = endOfHour(new Date());
const END_OF_DAY = endOfDay(new Date());

const DATE_RANGES: State<never>['dates'] = [
  {
    dateRange: DateRange.Day,
    period: TimeMetricPeriod.Hour,
    label: '24h',
    from: startOfHour(subHours(new Date(), 23)),
    end: END_OF_HOUR
  },
  {
    dateRange: DateRange.Week,
    period: TimeMetricPeriod.Day,
    label: '7d',
    from: startOfDay(subDays(new Date(), 6)),
    end: END_OF_DAY
  },
  {
    dateRange: DateRange.Month,
    period: TimeMetricPeriod.Day,
    label: '1m',
    from: startOfDay(subDays(new Date(), 29)),
    end: END_OF_DAY
  }
];

interface Props<T extends string> {
  metrics: Metric<T>[];
  defaultDateRange?: DateRange;
}

const stateCtx = createContext<State<any>>({} as State<any>);

const dispatchCtx = createContext<Dispatch<any>>({} as Dispatch<any>);

const initializer = <T extends string>({
  metrics,
  defaultDateRange = DateRange.Week
}: {
  metrics: Metric<T>[];
  defaultDateRange?: DateRange;
}): State<T> => ({
  metrics,
  dates: DATE_RANGES.map((date) =>
    date.dateRange === defaultDateRange ? { ...date, enabled: true } : date
  )
});

export const Metrics = <T extends string>({
  metrics,
  defaultDateRange,
  children
}: PropsWithChildren<Props<T>>): ReactElement => {
  const [state, dispatch] = useReducer(
    reducer,
    { metrics, defaultDateRange },
    initializer
  );

  const toggleType = useCallback<Dispatch<T>['toggleType']>(
    (type) => {
      dispatch({ type: Actions.ToggleType, payload: type });
    },
    [dispatch]
  );

  const setDateRange = useCallback<Dispatch<never>['setDateRange']>(
    (dateRange) => {
      dispatch({ type: Actions.SetDateRange, payload: dateRange });
    },
    [dispatch]
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ toggleType, setDateRange }), [
          toggleType,
          setDateRange
        ])}
      >
        <>
          <Flex justifyContent="space-between">
            <Box>
              <Flex p={['8px']} alignItems="center" justifyContent="flex-start">
                {state.metrics.map(({ type, enabled, label, colorName }) => (
                  <Flex key={type} mr={['30px']}>
                    <Text
                      color="lid.textLight"
                      fontSize={['14px', '18px']}
                      mr={['5px', '10px']}
                      mt={['20px', '']}
                    >
                      {label}
                    </Text>
                    <Switch
                      // color="red"
                      isChecked={!!enabled}
                      onChange={() => toggleType(type)}
                      mt={['20px', '']}
                    />
                  </Flex>
                ))}
              </Flex>
            </Box>
            <Box>
              <Flex p="8px">
                {state.dates.map(({ label, enabled, dateRange }) => (
                  <Button
                    key={dateRange}
                    h={['25px']}
                    w={['45px']}
                    mr={['15px']}
                    fontSize={['16px']}
                    fontWeight="400"
                    variant={enabled ? 'solid' : 'outline'}
                    color={enabled ? 'lid.gray' : 'lid.darkBlue'}
                    borderColor="lid.darkBlue"
                    backgroundColor={enabled ? 'lid.darkBlue' : null}
                    onClick={() => setDateRange(dateRange)}
                  >
                    {label}
                  </Button>
                ))}
              </Flex>
            </Box>
          </Flex>
          <ChartContainer>{children}</ChartContainer>
        </>
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMetricsState = <T extends string>(): State<T> =>
  useContext(stateCtx);

export const useMetricsDispatch = <T extends string>(): Dispatch<T> =>
  useContext(dispatchCtx);

export const useDateFilter = (): DateFilter => {
  const { dates } = useMetricsState();
  return useMemo(
    () => dates.find((d) => d.enabled) as NonNullable<typeof dates[0]>,
    [dates]
  );
};

export const useMetrics = <T extends string>(): Record<T, Metric<T>> => {
  const { metrics } = useMetricsState<T>();
  return useMemo(
    () =>
      metrics.reduce(
        (_types, type) => ({ ..._types, [type.type]: type }),
        {} as Record<T, Metric<T>>
      ),
    [metrics]
  );
};
