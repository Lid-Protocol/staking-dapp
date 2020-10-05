import gql from 'graphql-tag';
import * as ApolloReact from '@apollo/client';

export type Maybe<T> = T | null;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Bytes: string;
  BigDecimal: string;
  BigInt: string;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export type AggregateMetric = TimeMetric & {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
  type: AggregateMetricType;
};

export type AggregateMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
  type?: Maybe<AggregateMetricType>;
  type_not?: Maybe<AggregateMetricType>;
};

export enum AggregateMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period',
  Type = 'type'
}

export enum AggregateMetricType {
  TotalSupply = 'TOTAL_SUPPLY',
  TotalStaked = 'TOTAL_STAKED'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  volumeMetric?: Maybe<VolumeMetric>;
  volumeMetrics: Array<VolumeMetric>;
  aggregateMetric?: Maybe<AggregateMetric>;
  aggregateMetrics: Array<AggregateMetric>;
  timeMetric?: Maybe<TimeMetric>;
  timeMetrics: Array<TimeMetric>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};

export type QueryVolumeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryVolumeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<VolumeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<VolumeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAggregateMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAggregateMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AggregateMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AggregateMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryTimeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTimeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TimeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TimeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;

  volumeMetric?: Maybe<VolumeMetric>;
  volumeMetrics: Array<VolumeMetric>;
  aggregateMetric?: Maybe<AggregateMetric>;
  aggregateMetrics: Array<AggregateMetric>;

  timeMetric?: Maybe<TimeMetric>;
  timeMetrics: Array<TimeMetric>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};

export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionVolumeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionVolumeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<VolumeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<VolumeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAggregateMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAggregateMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AggregateMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AggregateMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionTimeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTimeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TimeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TimeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type TimeMetric = {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
};

export type TimeMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
};

export enum TimeMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period'
}

export enum TimeMetricPeriod {
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Year = 'YEAR'
}

/** An ERC20-compatible token */
export type Token = {
  id: Scalars['ID'];
  /** Token address */
  address: Scalars['Bytes'];
  /** Token decimals */
  decimals: Scalars['Int'];
  /** Token name */
  name: Scalars['String'];
  /** Token symbol */
  symbol: Scalars['String'];
  /** Total supply of the token */
  totalSupply: Scalars['BigDecimal'];
  /** Quantity of the token that has been minted */
  totalMinted: Scalars['BigDecimal'];
  /** Quantity of the token that has been burned */
  totalBurned: Scalars['BigDecimal'];
};

/** A common transaction type */
export type Transaction = {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  timestamp: Scalars['Int'];
  sender: Scalars['Bytes'];
};

export type Transaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Transaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Timestamp = 'timestamp',
  Sender = 'sender'
}

export enum TransactionType {
  StakingContractStaking = 'STAKING_CONTRACT_STAKE',
  StakingContractUnstaking = 'STAKING_CONTRACT_UNSTAKE',
  StakingContractWithDraw = 'STAKING_CONTRACT_WITHDRAW',
  StakingContractReinvest = 'STAKING_CONTRACT_REINVEST',
  StakingContractDistribute = 'STAKING_CONTRACT_DISTRIBUTE'
}

export type VolumeMetric = TimeMetric & {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
  type: TransactionType;
};

export type VolumeMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
};

export enum VolumeMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period',
  Type = 'type'
}

export type VolumeMetricsOfTypeQueryVariables = {
  period: TimeMetricPeriod;
  type: TransactionType;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type VolumeMetricsOfTypeQuery = {
  volumeMetrics: Array<Pick<VolumeMetric, 'timestamp' | 'value'>>;
};

export type VolumeMetricsQueryVariables = {
  period: TimeMetricPeriod;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type VolumeMetricsQuery = {
  volumeMetrics: Array<Pick<VolumeMetric, 'type' | 'timestamp' | 'value'>>;
};

export type AggregateMetricsOfTypeQueryVariables = {
  period: TimeMetricPeriod;
  type: AggregateMetricType;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type AggregateMetricsOfTypeQuery = {
  aggregateMetrics: Array<Pick<AggregateMetric, 'timestamp' | 'value'>>;
};

export type AggregateMetricsQueryVariables = {
  period: TimeMetricPeriod;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type AggregateMetricsQuery = {
  aggregateMetrics: Array<
    Pick<AggregateMetric, 'type' | 'timestamp' | 'value'>
  >;
};

export const VolumeMetricsOfTypeDocument = gql`
  query VolumeMetricsOfType(
    $period: TimeMetricPeriod!
    $type: TransactionType!
    $from: Int!
    $to: Int!
  ) {
    volumeMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: {
        period: $period
        type: $type
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      timestamp
      value
    }
  }
`;

/**
 * __useVolumeMetricsOfTypeQuery__
 *
 * To run a query within a React component, call `useVolumeMetricsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolumeMetricsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolumeMetricsOfTypeQuery({
 *   variables: {
 *      period: // value for 'period'
 *      type: // value for 'type'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useVolumeMetricsOfTypeQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >
) {
  return ApolloReact.useQuery<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >(VolumeMetricsOfTypeDocument, baseOptions);
}
export function useVolumeMetricsOfTypeLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >(VolumeMetricsOfTypeDocument, baseOptions);
}
export type VolumeMetricsOfTypeQueryHookResult = ReturnType<
  typeof useVolumeMetricsOfTypeQuery
>;
export type VolumeMetricsOfTypeLazyQueryHookResult = ReturnType<
  typeof useVolumeMetricsOfTypeLazyQuery
>;
export type VolumeMetricsOfTypeQueryResult = ApolloReact.QueryResult<
  VolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQueryVariables
>;
export const VolumeMetricsDocument = gql`
  query VolumeMetrics($period: TimeMetricPeriod!, $from: Int!, $to: Int!) {
    volumeMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: { period: $period, timestamp_gte: $from, timestamp_lte: $to }
    ) {
      type
      timestamp
      value
    }
  }
`;

/**
 * __useVolumeMetricsQuery__
 *
 * To run a query within a React component, call `useVolumeMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolumeMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolumeMetricsQuery({
 *   variables: {
 *      period: // value for 'period'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useVolumeMetricsQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >
) {
  return ApolloReact.useQuery<VolumeMetricsQuery, VolumeMetricsQueryVariables>(
    VolumeMetricsDocument,
    baseOptions
  );
}
export function useVolumeMetricsLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >(VolumeMetricsDocument, baseOptions);
}
export type VolumeMetricsQueryHookResult = ReturnType<
  typeof useVolumeMetricsQuery
>;
export type VolumeMetricsLazyQueryHookResult = ReturnType<
  typeof useVolumeMetricsLazyQuery
>;
export type VolumeMetricsQueryResult = ApolloReact.QueryResult<
  VolumeMetricsQuery,
  VolumeMetricsQueryVariables
>;
export const AggregateMetricsOfTypeDocument = gql`
  query AggregateMetricsOfType(
    $period: TimeMetricPeriod!
    $type: AggregateMetricType!
    $from: Int!
    $to: Int!
  ) {
    aggregateMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: {
        period: $period
        type: $type
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      timestamp
      value
    }
  }
`;

/**
 * __useAggregateMetricsOfTypeQuery__
 *
 * To run a query within a React component, call `useAggregateMetricsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAggregateMetricsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAggregateMetricsOfTypeQuery({
 *   variables: {
 *      period: // value for 'period'
 *      type: // value for 'type'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAggregateMetricsOfTypeQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >
) {
  return ApolloReact.useQuery<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >(AggregateMetricsOfTypeDocument, baseOptions);
}
export function useAggregateMetricsOfTypeLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >(AggregateMetricsOfTypeDocument, baseOptions);
}
export type AggregateMetricsOfTypeQueryHookResult = ReturnType<
  typeof useAggregateMetricsOfTypeQuery
>;
export type AggregateMetricsOfTypeLazyQueryHookResult = ReturnType<
  typeof useAggregateMetricsOfTypeLazyQuery
>;
export type AggregateMetricsOfTypeQueryResult = ApolloReact.QueryResult<
  AggregateMetricsOfTypeQuery,
  AggregateMetricsOfTypeQueryVariables
>;
export const AggregateMetricsDocument = gql`
  query AggregateMetrics($period: TimeMetricPeriod!, $from: Int!, $to: Int!) {
    aggregateMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: { period: $period, timestamp_gte: $from, timestamp_lte: $to }
    ) {
      type
      timestamp
      value
    }
  }
`;

/**
 * __useAggregateMetricsQuery__
 *
 * To run a query within a React component, call `useAggregateMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAggregateMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAggregateMetricsQuery({
 *   variables: {
 *      period: // value for 'period'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAggregateMetricsQuery(
  baseOptions?: ApolloReact.QueryHookOptions<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >
) {
  return ApolloReact.useQuery<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >(AggregateMetricsDocument, baseOptions);
}
export function useAggregateMetricsLazyQuery(
  baseOptions?: ApolloReact.LazyQueryHookOptions<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >
) {
  return ApolloReact.useLazyQuery<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >(AggregateMetricsDocument, baseOptions);
}
export type AggregateMetricsQueryHookResult = ReturnType<
  typeof useAggregateMetricsQuery
>;
export type AggregateMetricsLazyQueryHookResult = ReturnType<
  typeof useAggregateMetricsLazyQuery
>;
export type AggregateMetricsQueryResult = ApolloReact.QueryResult<
  AggregateMetricsQuery,
  AggregateMetricsQueryVariables
>;
