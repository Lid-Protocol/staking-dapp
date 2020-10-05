import { useMemo } from 'react';
import Web3 from 'web3';
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  lightFormat
} from 'date-fns';
import { infuraIds } from 'config';
import { TimeMetricPeriod } from '../graphql';
import { DateFilter } from 'components/Metrics';

export const toBN = Web3.utils.toBN;
export const toWei = Web3.utils.toWei;
export const fromWei = Web3.utils.fromWei;

export const getRandomInfuraId = () => {
  return infuraIds[Math.floor(Math.random() * 1000) % infuraIds.length];
};

export function removeDecimal(decimalString: string) {
  if (!decimalString.includes('.')) {
    return decimalString;
  }
  return decimalString.substring(0, decimalString.indexOf('.'));
}

export function shortEther(wei: string) {
  if (wei === '') {
    return '';
  }

  const etherString = removeDecimal(fromWei(wei));

  if (toBN(etherString).lt(toBN('1'))) {
    return Number(Number(fromWei(wei)).toPrecision(4)).toString();
  }

  if (toBN(etherString).lt(toBN('1000'))) {
    return Number(fromWei(wei)).toPrecision(4).toString();
  }

  const etherBN = toBN(etherString);
  let resultInteger = '';
  let resultSuffix = '';
  let resultDecimal = 0;
  let resultDecimalStr = '';

  if (etherBN.div(toBN('1000000')).gt(toBN('0'))) {
    resultSuffix = 'M';
    resultInteger = etherBN.div(toBN('1000000')).toString();
    if (resultInteger.length < 3) {
      resultDecimal =
        etherBN.sub(toBN(resultInteger).mul(toBN('1000000'))).toNumber() /
        1000000;
    }
  } else if (etherBN.div(toBN('1000')).gt(toBN('0'))) {
    resultSuffix = 'K';
    resultInteger = etherBN.div(toBN('1000')).toString();
    if (resultInteger.length < 3) {
      resultDecimal =
        etherBN.sub(toBN(resultInteger).mul(toBN('1000'))).toNumber() / 1000;
    }
  } else {
    resultInteger = etherString;
  }

  if (resultDecimal === 0) {
    if (resultInteger.length === 1) {
      resultDecimalStr = '.00';
    } else if (resultInteger.length === 2) {
      resultDecimalStr = '.0';
    }
  } else if (resultDecimal) {
    if (resultInteger.length === 1) {
      resultDecimalStr = resultDecimal.toPrecision(2).substr(1);
    } else {
      resultDecimalStr = resultDecimal.toPrecision(1).substr(1);
    }
  }

  return resultInteger + resultDecimalStr + resultSuffix;
}

export const importAll = (r: __WebpackModuleApi.RequireContext) => {
  let images: any = {};
  r.keys().map((item) => (images[item.replace('./', '')] = r(item)));
  return images;
};

export const formatAssetUrl = (project: string, link: string) => {
  if (project) {
    return `${
      process.env.REACT_APP_FLEEK_BUCKET
    }${project.toLowerCase()}/${link}`;
  }
  return `lid/${link}`;
};

type TickFormatFn = (timestamp: number) => string;

const periodIntervalMapping: Record<
  TimeMetricPeriod,
  (interval: Interval) => Date[]
> = {
  [TimeMetricPeriod.Hour]: eachHourOfInterval,
  [TimeMetricPeriod.Day]: eachDayOfInterval,
  [TimeMetricPeriod.Week]: eachWeekOfInterval,
  [TimeMetricPeriod.Month]: eachMonthOfInterval,
  [TimeMetricPeriod.Quarter]: eachQuarterOfInterval,
  [TimeMetricPeriod.Year]: eachYearOfInterval
};

const periodFormatMapping: Record<TimeMetricPeriod, string> = {
  [TimeMetricPeriod.Hour]: 'HH',
  [TimeMetricPeriod.Day]: 'dd-MM',
  [TimeMetricPeriod.Week]: 'W',
  [TimeMetricPeriod.Month]: 'MM',
  [TimeMetricPeriod.Quarter]: 'Q',
  [TimeMetricPeriod.Year]: 'YYYY'
};

export const abbreviateNumber = (value: number): string => {
  if (value >= 1e3 && value < 1e6) {
    return `${(value / 1e3).toFixed(0)}k`;
  }

  if (value >= 1e6 && value < 1e9) {
    return `${(value / 1e6).toFixed(2)}m`;
  }

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}b`;
  }

  return value.toFixed(0);
};

export const percentageFormat = (value: number): string =>
  `${value.toFixed(2)}%`;

const timestampTickFormat = (period: TimeMetricPeriod): TickFormatFn => (
  timestamp
) => (timestamp > 1 ? lightFormat(timestamp, periodFormatMapping[period]) : '');

export const useDateFilterTickFormat = ({ period }: DateFilter): TickFormatFn =>
  useMemo(() => timestampTickFormat(period), [period]);

export const useDateFilterTickValues = (dateFilter: DateFilter): number[] =>
  useMemo(() => {
    const { from, end, period } = dateFilter;
    const interval: Interval = { start: from, end };
    return periodIntervalMapping[period](interval).map((date) =>
      date.getTime()
    );
  }, [dateFilter]);
