import { PoolTypeEnum } from 'sui-api-final-v2';

export type ClaimRoundWinnerList = {
  poolId: string;
  poolType: PoolTypeEnum;
  round: string;
  luckNum: string;
}[];

export type Statistics = {
  totalStakeAmount: number;
  userStakeArray: string[];
  userStakeAmountMap: Map<string, number>;
};

export type StatisticsMap = Map<PoolTypeEnum, Statistics>;

export type WinnerInfo = {
  poolId: string;
  round: string;
  luckNum: string;
  poolType: PoolTypeEnum;
  expireTime: string;
};

export type Pool = {
  poolId: string;
  poolType: PoolTypeEnum;
  stakeCoinName: string;
  rewardCoinName: string;
  stakeCoinUsdRate: string;
  currentRound: string;
  currentRoundExpireTime: string;
  validatorStatus: {
    available: string;
    lastEpoch: string;
    pending: string;
  };
  statistics: {
    totalAttendance: number;
    totalDeposit: number;
  };
  rewardAllocate: {
    allocateGasPayerRatio: string;
    platformRatio: string;
    rewardRatio: string;
  };
  canAllocateReward: boolean;
  canStake: boolean;
  needNewNumberPool: boolean;
  timeInfo: {
    rewardDuration: string;
    startTime: string;
    expireDuration: string;
    lockStakeDuration: string;
  };
  shareSupplyInfo: {
    totalSupply: number;
    activeSupply: number;
  };
  claimedRewardInfoId: string;
  lastRewardBalance: number;
  rewardAmount: number;
};

export type UserStakeInfo = {
  stakeCoinName: string;
  userStakeTotalAmount: number;
  luckRate: number;
  userTicketList: {
    stakeShareId: string;
    startNum: string;
    endNum: string;
  }[];
};
