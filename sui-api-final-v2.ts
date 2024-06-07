import {
  TransactionBlock,
  TransactionArgument,
} from '@mysten/sui.js/transactions';
import { SuiClient, SuiObjectDataFilter } from '@mysten/sui.js/client';
import {
  fetchBeaconByTime,
  HttpChainClient,
  HttpCachingChain,
} from 'drand-client';
import { bcs } from '@mysten/sui.js/bcs';
import { bls12_381 as bls } from '@noble/curves/bls12-381';
import { BucketClient } from 'bucket-protocol-sdk';
import { Scallop } from '@scallop-io/sui-scallop-sdk';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, child, remove } from 'firebase/database';

// Instantiate BucketClient
const bucket = new BucketClient();
const scallopSDK = new Scallop({
  networkType: 'mainnet',
});

const scallopQuery = await scallopSDK.createScallopQuery();

export enum PoolTypeEnum {
  BUCKET_PROTOCOL = 'BUCKET_PROTOCOL',
  SCALLOP_PROTOCOL = 'SCALLOP_PROTOCOL',
  SCALLOP_PROTOCOL_SUI = 'SCALLOP_PROTOCOL_SUI',
}

export enum BucketCoinTypeEnum {
  BUCK = 'BUCK',
  USDT = 'USDT',
  USDC = 'USDC',
}

const FIREBASE_ENV: string = `${process.env.NEXT_PUBLIC_FIREBASE_ENV}`;
const FIREBASE_CONFIG: string = `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}`;

const FIREBASE_APP = initializeApp(JSON.parse(FIREBASE_CONFIG));
const FIREBASE_DB = getDatabase(FIREBASE_APP);
const DB_REF = ref(FIREBASE_DB);
const DB_ROOT_PATH = `/demo/${FIREBASE_ENV}`;
const DB_CHILD_REWARD_INFO = `rewardInfo`;
const DB_CHILD_STAKE_INFO = `stakeInfo`;

const DB_CHILD_GET_POOL_INFO = `getPoolInfo`;

const SUI_VISION_DOMAIN = `${process.env.NEXT_PUBLIC_SUI_VISION_DOMAIN}`;

// 智能合約地址
const PACKAGE_ID: string = `${process.env.NEXT_PUBLIC_PACKAGE_ID}`;

// 智能合約 升級後的舊合約地址
const UPGRADE_PACKAGE_IDS: [] = JSON.parse(
  `${process.env.NEXT_PUBLIC_UPGRADE_PACKAGE_IDS}`,
);

// 全域設定 Share Object 地址
const GLOBAL_CONFIG_ID: string = `${process.env.NEXT_PUBLIC_GLOBAL_CONFIG_ID}`;
// OwnerShip 證明 Object 地址
const ADMIN_CAP_ID: string = `${process.env.NEXT_PUBLIC_ADMIN_CAP_ID}`;

const SCALLOP_PROTOCOL_POOL_TYPE = `${PACKAGE_ID}::pool::${PoolTypeEnum.SCALLOP_PROTOCOL}`;
const SCALLOP_PROTOCOL_SUI_POOL_TYPE = `${PACKAGE_ID}::pool::${PoolTypeEnum.SCALLOP_PROTOCOL_SUI}`;

// 質押池 module 名稱
const MODULE_POOL: string = 'pool';
// 方法名稱 : 新增質押池
const FUN_NEW_POOL: string = 'new_pool';

// 質押紀錄 module 名稱
const MODULE_STAKED_SHARE: string = 'staked_share';
// 方法名稱 : 新增並Share
const FUN_NEW_SHARE_NUMBER_POOL: string =
  'new_and_share_number_pool_and_share_supply';

// 驗證適配器 module 名稱
const MODULE_BUCKET_ADAPTER: string = 'bucket_adapter';
const MODULE_SCALLOP_ADAPTER: string = 'scallop_adapter';
// 方法名稱 : 質押
const FUN_STAKE: string = 'stake';
// 方法名稱 : 提取
const FUN_WITHDRAW: string = 'withdraw';
// 方法名稱 : 分配獎勵
const FUN_ALLOCATE_REWARDS: string = 'allocate_reward';
// 方法名稱 : 領取獎勵
const FUN_CLAIM_REWARD: string = 'claim_reward';
// 方法名稱 : 切割 share
const FUN_SPLIT_SHARE: string = 'split';

const bucketConfig: any = JSON.parse(
  `${process.env.NEXT_PUBLIC_BUCKET_CONFIG}`,
);
const scallopConfig: any = JSON.parse(
  `${process.env.NEXT_PUBLIC_SCALLOP_CONFIG}`,
);
const scallopSuiConfig: any = JSON.parse(
  `${process.env.NEXT_PUBLIC_SCALLOP_SUI_CONFIG}`,
);

const poolTypeConfigMap: any = new Map<any, any>();
poolTypeConfigMap.set(bucketConfig.poolType, bucketConfig);
poolTypeConfigMap.set(scallopConfig.poolType, scallopConfig);
poolTypeConfigMap.set(scallopSuiConfig.poolType, scallopSuiConfig);

const poolAddressConfigMap: any = new Map<any, any>();
poolAddressConfigMap.set(bucketConfig.pool, bucketConfig);
poolAddressConfigMap.set(scallopConfig.pool, scallopConfig);
poolAddressConfigMap.set(scallopSuiConfig.pool, scallopSuiConfig);

// SUI 時間 Share Object 地址
const SUI_CLOCK_ID: string = '0x6';

const SUI_COIN_TYPE: string = '0x2::sui::SUI';
const BUCK_COIN_TYPE: string = `${process.env.NEXT_PUBLIC_BUCK_COIN_TYPE}`;
const SCA_COIN_TYPE: string = `${process.env.NEXT_PUBLIC_SCA_COIN_TYPE}`;
const USDT_COIN_TYPE: string = `${process.env.NEXT_PUBLIC_USDT_COIN_TYPE}`;
const USDC_COIN_TYPE: string = `${process.env.NEXT_PUBLIC_USDC_COIN_TYPE}`;

// Bucket 所需要的參數
const BUCKET_FLASK: string = `${process.env.NEXT_PUBLIC_BUCKET_FLASK}`;
const BUCKET_FOUTAIN: string = `${process.env.NEXT_PUBLIC_BUCKET_FOUTAIN}`;
const BUCKET_LOCK_TIME: number = Number(
  `${process.env.NEXT_PUBLIC_BUCKET_LOCK_TIME}`,
);

// Scallop 所需的參數
const SCALLOP_VERSION: string = `${process.env.NEXT_PUBLIC_SCALLOP_VERSION}`;
const SCALLOP_MARKET: string = `${process.env.NEXT_PUBLIC_SCALLOP_MARKET}`;

const STAKE_POOL_SHARE_TYPE: string = 'StakedPoolShare';
// SUI Coin Decimal
const SUI_COIN_DECIMAL = 1_000_000_000;
const BUCK_COIN_DECIMAL = 1_000_000_000;
const SCA_COIN_DECIMAL = 1_000_000_000;
const USDC_COIN_DECIMAL = 1_000_000;
const USDT_COIN_DECIMAL = 1_000_000;

const poolTypeCommonTypeMap: any = new Map();
let filterMap: Map<any, any> = new Map();
let filters: any[] = [];
Array.from(poolTypeConfigMap.keys()).map((poolType: any) => {
  let nativeType: string = `${SUI_COIN_TYPE}`;
  let rewardType: string = `${SUI_COIN_TYPE}`;
  let nativeDecimal: number = SUI_COIN_DECIMAL;
  let rewardDecimal: number = SUI_COIN_DECIMAL;
  let nativeCoinType: string = SUI_COIN_TYPE;
  let rewardCoinType: string = SUI_COIN_TYPE;
  let nativeCoinName: string = 'SUI';
  let rewardCoinName: string = 'SUI';
  switch (poolType) {
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      break;
    case PoolTypeEnum.BUCKET_PROTOCOL:
      nativeType = `${BUCK_COIN_TYPE}`;
      nativeDecimal = BUCK_COIN_DECIMAL;
      nativeCoinType = BUCK_COIN_TYPE;
      nativeCoinName = 'BUCK';
      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL:
      nativeType = `${SCA_COIN_TYPE}`;
      rewardType = `${SCA_COIN_TYPE}`;
      nativeDecimal = SCA_COIN_DECIMAL;
      rewardDecimal = SCA_COIN_DECIMAL;
      nativeCoinType = SCA_COIN_TYPE;
      rewardCoinType = SCA_COIN_TYPE;
      nativeCoinName = 'SCA';
      rewardCoinName = 'SCA';
      break;
  }
  let allFilters: any[] = [];
  let structType = `${PACKAGE_ID}::${MODULE_STAKED_SHARE}::${STAKE_POOL_SHARE_TYPE}
    <${PACKAGE_ID}::${MODULE_POOL}::${poolType},${nativeType}, ${rewardType}>`;
  let filter: SuiObjectDataFilter = {
    StructType: structType,
  };

  allFilters.push(filter);
  filters.push(filter);

  if (UPGRADE_PACKAGE_IDS.length > 0) {
    for (let packageId of UPGRADE_PACKAGE_IDS) {
      if (packageId !== '') {
        let upgradeStructType = `${packageId}::${MODULE_STAKED_SHARE}::${STAKE_POOL_SHARE_TYPE}
        <${packageId}::${MODULE_POOL}::${poolType},${nativeType}, ${rewardType}>`;
        let upgradeFilter: SuiObjectDataFilter = {
          StructType: upgradeStructType,
        };
        allFilters.push(upgradeFilter);
        filters.push(upgradeFilter);
      }
    }
  }

  filterMap.set(poolType, allFilters);

  poolTypeCommonTypeMap.set(poolType, {
    nativeType: nativeType,
    rewardType: rewardType,
    nativeDecimal: nativeDecimal,
    rewardDecimal: rewardDecimal,
    nativeCoinType: nativeCoinType,
    rewardCoinType: rewardCoinType,
    nativeCoinName: nativeCoinName,
    rewardCoinName: rewardCoinName,
  });
});

const suiClient = new SuiClient({
  url: `${process.env.NEXT_PUBLIC_SUI_NETWORK_URL}`,
});

// drand 隨機數 config
const chainUrl: string = `${process.env.NEXT_PUBLIC_DRAND_CHAIN_URL}`;
const chainHash: string = `${process.env.NEXT_PUBLIC_DRAND_CHAIN_HASH}`;
const publicKey: string = `${process.env.NEXT_PUBLIC_DRAND_PUBLIC_KEY}`;

const options = {
  disableBeaconVerification: false, // `true` disables checking of signatures on beacons - faster but insecure!!!
  noCache: false, // `true` disables caching when retrieving beacons for some providers
  chainVerificationParams: { chainHash, publicKey }, // these are optional, but recommended! They are compared for parity against the `/info` output of a given node
};

const chain = new HttpCachingChain(`${chainUrl}${chainHash}`, options);
const drandClient = new HttpChainClient(chain, options);

// 取得 Pool 類型陣列
export function getPoolTypeList() {
  return Array.from(poolTypeConfigMap.keys());
}

// 取得 Bucket Stake Coin 類型
export async function getBucketCoinTypeAndPriceRateMap() {
  let bucketCoinTypeAndPriceRateMap: Map<any, any> = new Map();
  let prices = await bucket.getPrices();
  Object.keys(BucketCoinTypeEnum).forEach((coinType) => {
    bucketCoinTypeAndPriceRateMap.set(coinType, prices[coinType]);
  });
  return bucketCoinTypeAndPriceRateMap;
}

// 構建 新建Pool 交易區塊
export async function packNewPoolTxb(
  poolType: string,
  prepareDuration: number,
  lockStateDuration: number,
  rewardDuration: number,
  expireDuration: number,
  platformRatio: number,
  rewardRatio: number,
  allocateGasPayerRatio: number,
) {
  let txb: TransactionBlock = new TransactionBlock();

  let nativeType: string = poolTypeCommonTypeMap.get(poolType).nativeType;
  let rewardType: string = poolTypeCommonTypeMap.get(poolType).rewardType;

  let typeArgs = [
    `${PACKAGE_ID}::${MODULE_POOL}::${poolType}`,
    nativeType,
    rewardType,
  ];

  let newPoolArgs: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(ADMIN_CAP_ID),
    txb.object(SUI_CLOCK_ID),
    txb.pure(prepareDuration * 1000),
    txb.pure(lockStateDuration * 1000),
    txb.pure(rewardDuration * 1000),
    txb.pure(expireDuration * 1000),
    txb.pure(platformRatio * 100),
    txb.pure(rewardRatio * 100),
    txb.pure(allocateGasPayerRatio * 100),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${MODULE_POOL}::${FUN_NEW_POOL}`,
    typeArguments: typeArgs,
    arguments: newPoolArgs,
  });

  return txb;
}

// 構建 Number pool 交易區塊
export async function packNewNumberPoolTxb(poolType: string) {
  let txb: TransactionBlock = new TransactionBlock();

  let nativeType: string = poolTypeCommonTypeMap.get(poolType).nativeType;
  let rewardType: string = poolTypeCommonTypeMap.get(poolType).rewardType;

  let typeArgs = [
    `${PACKAGE_ID}::${MODULE_POOL}::${poolType}`,
    nativeType,
    rewardType,
  ];

  let newPoolArgs: TransactionArgument[] = [
    txb.object(GLOBAL_CONFIG_ID),
    txb.object(ADMIN_CAP_ID),
  ];

  txb.moveCall({
    target: `${PACKAGE_ID}::${MODULE_STAKED_SHARE}::${FUN_NEW_SHARE_NUMBER_POOL}`,
    typeArguments: typeArgs,
    arguments: newPoolArgs,
  });

  return txb;
}

// 取得 pool 資訊
export async function getPoolInfo(poolType: any) {
  let poolInfo: any = new Object();

  let poolList: Object[] = new Array<Object>();
  poolInfo.poolList = poolList;

  let getPackageIdDbPath = `${DB_ROOT_PATH}/PackageId`;
  let getPackageIdSnapshot = await get(child(DB_REF, getPackageIdDbPath));
  let needRefresh = true;

  if (getPackageIdSnapshot.exists()) {
    let packageId = getPackageIdSnapshot.val();
    if (packageId === PACKAGE_ID) {
      needRefresh = false;
    }
  }

  if (poolAddressConfigMap.size > 0) {
    for (let poolConfig of poolAddressConfigMap.values()) {
      if (poolConfig.pool === '') {
        continue;
      }
      if (poolType && poolConfig.poolType !== poolType) {
        continue;
      }

      let getPoolInfoDbPath = `${DB_ROOT_PATH}/${poolConfig.poolType}/${DB_CHILD_GET_POOL_INFO}`;

      if (!needRefresh) {
        let getPoolInfoSnapshot = await get(child(DB_REF, getPoolInfoDbPath));
        if (getPoolInfoSnapshot.exists()) {
          poolList.push(getPoolInfoSnapshot.val());
          continue;
        }
      }

      let poolObjectResp = await suiClient.getObject({
        id: poolConfig.pool,
        options: {
          showContent: true,
        },
      });
      if (poolObjectResp.data?.content) {
        let poolObject: any = new Object();

        let poolData: any = poolObjectResp.data.content;

        poolObject.poolId = poolData.fields.id.id;
        poolObject.poolType = poolAddressConfigMap.get(
          poolObject.poolId,
        ).poolType;
        poolObject.stakeCoinName = poolTypeCommonTypeMap.get(
          poolObject.poolType,
        ).nativeCoinName;
        poolObject.rewardCoinName = poolTypeCommonTypeMap.get(
          poolObject.poolType,
        ).rewardCoinName;
        poolObject.stakeCoinUsdRate = (
          await getUsdRateByPoolType(poolObject.poolType)
        ).stakeCoinUsdRate;
        poolObject.currentRound = poolData.fields.current_round;

        let currentTimeInfo: any = await getRoundExpireTimeInfo(
          poolObject.poolId,
          [poolObject.currentRound],
        );
        poolObject.currentRoundExpireTime =
          currentTimeInfo.roundExpireTimeMap.get(poolObject.currentRound);

        poolObject.validatorStatus = {};

        let stakeDecimal = poolTypeCommonTypeMap.get(
          poolObject.poolType,
        )?.nativeDecimal;
        let rewardDecimal = poolTypeCommonTypeMap.get(
          poolObject.poolType,
        )?.rewardDecimal;

        // 質押數量
        let statistics: any = new Object();
        if (poolData.fields.statistics) {
          statistics.totalDeposit =
            poolData.fields.statistics.fields.total_amount / stakeDecimal;
          statistics.totalAttendance =
            poolData.fields.statistics.fields.user_set.fields.contents.length;
        }
        poolObject.statistics = statistics;

        // 獎勵分配 %數設定
        let rewardAllocate: any = new Object();
        rewardAllocate.allocateGasPayerRatio = (
          parseFloat(
            poolData.fields.reward_allocate.fields.allocate_gas_payer_ratio,
          ) / 100
        ).toFixed(2);
        rewardAllocate.platformRatio = (
          parseFloat(poolData.fields.reward_allocate.fields.platform_ratio) /
          100
        ).toFixed(2);
        rewardAllocate.rewardRatio = (
          parseFloat(poolData.fields.reward_allocate.fields.reward_ratio) / 100
        ).toFixed(2);
        poolObject.rewardAllocate = rewardAllocate;

        // 時間設定
        let timeInfo: any = new Object();
        timeInfo.rewardDuration =
          poolData.fields.time_info.fields.reward_duration / 1000;
        timeInfo.startTime = poolData.fields.time_info.fields.start_time;
        timeInfo.expireDuration =
          poolData.fields.time_info.fields.expire_duration / 1000;
        timeInfo.lockStakeDuration =
          poolData.fields.time_info.fields.lock_stake_duration / 1000;

        let startDate = new Date();
        startDate.setTime(timeInfo.startTime);
        let rewardDate = new Date();
        rewardDate.setTime(
          Number(timeInfo.startTime) + Number(timeInfo.rewardDuration),
        );

        poolObject.canAllocateReward =
          new Date().getTime() > rewardDate.getTime();
        poolObject.canStake = new Date().getTime() > startDate.getTime();
        poolObject.needNewNumberPool = poolConfig.numberPool === '';

        poolObject.timeInfo = timeInfo;
        if (poolConfig.shareSupply !== '') {
          poolObject.shareSupplyInfo = await getShareSupply(
            poolConfig.shareSupply,
            stakeDecimal,
          );
        }

        // 已領取獎勵的資訊 ID
        poolObject.claimedRewardInfoId = poolData.fields.claimed.fields.id.id;

        // 上個 Round 的獎勵數量
        let claimableMapResp = await getTableData(
          poolData.fields.claimable.fields.id.id,
        );
        let lastRewardBalance: number = 0;

        for (let [key, value] of claimableMapResp) {
          lastRewardBalance = Number(lastRewardBalance) + Number(value);
        }
        // 上個 Round 的獎勵數量
        poolObject.lastRewardBalance = lastRewardBalance / rewardDecimal;

        let dbPath = `${DB_ROOT_PATH}/${poolObject.poolType}/${DB_CHILD_STAKE_INFO}`;
        let dbTotalStakeAmount = 0;

        let snapshot = await get(child(DB_REF, dbPath));
        if (snapshot.exists()) {
          dbTotalStakeAmount = snapshot.val().totalStakeAmount;
        }

        if (dbTotalStakeAmount !== statistics.totalDeposit) {
          set(ref(FIREBASE_DB, dbPath), {
            totalStakeAmount: statistics.totalDeposit,
          });
        }

        set(ref(FIREBASE_DB, getPoolInfoDbPath), poolObject);

        poolList.push(poolObject);
      }
    }
  }

  set(ref(FIREBASE_DB, getPackageIdDbPath), PACKAGE_ID);

  return poolInfo;
}

function diffDay(lastDate: string, earlyDate: string) {
  return Date.parse(lastDate) - Date.parse(earlyDate);
}

function getNowDateFormatStr() {
  let newTime = new Date();
  let year = newTime.getFullYear();
  let mon =
    newTime.getMonth() + 1 < 10
      ? '0' + (newTime.getMonth() + 1)
      : newTime.getMonth() + 1;
  let date =
    newTime.getDate() < 10 ? '0' + newTime.getDate() : newTime.getDate();
  let str = `${year}-${mon}-${date}`;
  return str;
}

// 取得 Pool 獎勵數量 資訊
export async function getPoolRewardInfo(poolType: string) {
  let rewardDbPath = `${DB_ROOT_PATH}/${poolType}/${DB_CHILD_REWARD_INFO}`;
  let stakeDbPath = `${DB_ROOT_PATH}/${poolType}/${DB_CHILD_STAKE_INFO}`;

  let rewardAmount: string = '0';
  let oldRewardAmount: number = 0;
  let oldTime: string = '';
  let newRewardAmount: number = 0;
  let newTime: string = '';
  let totalDeposit: number = 0;

  let nowDateFormatStr = getNowDateFormatStr();
  let rewardSnapshot = await get(child(DB_REF, rewardDbPath));

  if (rewardSnapshot.exists()) {
    oldRewardAmount = rewardSnapshot.val().old;
    if (isNaN(oldRewardAmount)) {
      oldRewardAmount = 0;
    }
    oldTime = rewardSnapshot.val().oldTime;
    newRewardAmount = rewardSnapshot.val().new;
    if (isNaN(newRewardAmount)) {
      newRewardAmount = 0;
    }
    newTime = rewardSnapshot.val().newTime;
  }

  let stakeSnapshot = await get(child(DB_REF, stakeDbPath));

  if (stakeSnapshot.exists()) {
    totalDeposit = stakeSnapshot.val().totalStakeAmount;
  }

  let diffDayTime = diffDay(nowDateFormatStr, oldTime);

  if (oldTime === '') {
    oldTime = nowDateFormatStr;
    diffDayTime = 1;
  } else if (diffDayTime > 1) {
    oldRewardAmount = newRewardAmount;
    oldTime = newTime;
  } else {
    diffDayTime = 1;
  }

  switch (poolType) {
    case PoolTypeEnum.BUCKET_PROTOCOL:
      let bucketStakeInfo: any = await getBucketStakeInfo();
      let bucketStakeAmount: number = Number(bucketStakeInfo.depositAmount);
      let bucketApy: number = Number(bucketStakeInfo.apy);
      let bucketRewardAmount: number =
        ((bucketStakeAmount * bucketApy) / 365) * diffDayTime;

      rewardAmount = Number(
        (Number(bucketRewardAmount) * Number(totalDeposit)) /
          Number(bucketStakeAmount) +
          Number(oldRewardAmount),
      ).toFixed(15);
      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL:
      let marketData = await scallopQuery.queryMarket();
      if (marketData.pools.sca) {
        let scallopSupplyApy = marketData.pools.sca.supplyApy;
        let scallopCoinPrice = marketData.pools.sca.coinPrice;
        let scallopSupplyAmount = marketData.pools.sca.supplyCoin;
        let scallopRewardAmount =
          ((scallopSupplyAmount * scallopCoinPrice * scallopSupplyApy) / 365) *
          diffDayTime;

        rewardAmount = Number(
          (Number(scallopRewardAmount) * Number(totalDeposit)) /
            Number(scallopSupplyAmount) +
            Number(oldRewardAmount),
        ).toFixed(15);
      }
      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      let suiMarketData = await scallopQuery.queryMarket();
      if (suiMarketData.pools.sui) {
        let scallopSuiSupplyApy = suiMarketData.pools.sui.supplyApy;
        let scallopSuiCoinPrice = suiMarketData.pools.sui.coinPrice;
        let scallopSuiSupplyAmount = suiMarketData.pools.sui.supplyCoin;
        let scallopSuiRewardAmount =
          ((scallopSuiSupplyAmount *
            scallopSuiCoinPrice *
            scallopSuiSupplyApy) /
            365) *
          diffDayTime;

        rewardAmount = Number(
          (Number(scallopSuiRewardAmount) * Number(totalDeposit)) /
            Number(scallopSuiSupplyAmount) +
            Number(oldRewardAmount),
        ).toFixed(15);
      }
      break;
  }

  set(ref(FIREBASE_DB, rewardDbPath), {
    old: oldRewardAmount,
    oldTime: oldTime,
    new: rewardAmount,
    newTime: nowDateFormatStr,
  });

  return {
    rewardAmount: rewardAmount,
  };
}

// Bucket 計算 APY
async function calculateBucketApy(fountain: any) {
  const lpPrice = 1;
  let prices: any = await bucket.getPrices();
  let rewardsPrice = prices.SUI;
  let bucketTotalRewardAmount = getBucketRewardTotalAmount(fountain);
  let apr =
    ((bucketTotalRewardAmount * 365) /
      ((fountain.totalWeight / 10 ** 9) * lpPrice)) *
    rewardsPrice;
  let apy = Math.pow(1 + apr / 365, 365) - 1;
  return apy;
}

async function getBucketStakeInfo() {
  let fountain = await bucket.getFountain(BUCKET_FOUTAIN);
  let depositAmount = fountain.flowAmount;
  let apy = await calculateBucketApy(fountain);
  let rewardAmount = getBucketRewardTotalAmount(fountain);

  return {
    depositAmount: depositAmount,
    apy: apy,
    rewardAmount: rewardAmount,
  };
}

// 取得 Bucket Reward Total Amount
function getBucketRewardTotalAmount(fountain: any) {
  let flowAmount = fountain.flowAmount;
  let flowInterval = fountain.flowInterval;
  return (flowAmount / 10 ** 9 / flowInterval) * 86400000;
}

// 取得 Stake Coin 對應的美元匯率
export async function getUsdRateByPoolType(poolType: string) {
  let usdtRateInfo: any = new Object();
  let stakeCoinType = poolTypeCommonTypeMap.get(poolType).nativeCoinType;
  let stakeCoinName = poolTypeCommonTypeMap.get(poolType).nativeCoinName;
  const encodeCoinType = encodeURI(stakeCoinType);

  let apiUrl = `https://api.geckoterminal.com/api/v2/networks/sui-network/tokens/${encodeCoinType}`;

  let apiResponse = await fetch(apiUrl);
  const data = await apiResponse.json();

  usdtRateInfo.stakeCoinUsdRate = data.data.attributes.price_usd;
  usdtRateInfo.stakeCoinName = stakeCoinName;

  return usdtRateInfo;
}

// 取得 已領取獎勵 資訊 Map <round, userAddress>
export async function getClaimedRewardInfo(
  claimedRewardInfoId: string,
  roundArray: any[],
  currentRound: number,
  poolType: string,
) {
  let claimedRewardMap: Map<any, any> = new Map();

  let rewardDecimal = poolTypeCommonTypeMap.get(poolType).rewardDecimal;

  if (roundArray && roundArray.length > 0) {
    for (let round of roundArray) {
      let claimedRewardObjectResp = await suiClient.getDynamicFieldObject({
        parentId: claimedRewardInfoId,
        name: {
          type: 'u64',
          value: `${round}`,
        },
      });
      if (claimedRewardObjectResp.data) {
        let content: any = claimedRewardObjectResp.data.content;
        claimedRewardMap.set(content.fields.name, {
          rewardAmount: (
            Number(content.fields.value.fields.reward_amount) /
            Number(rewardDecimal)
          ).toFixed(10),
          winner: content.fields.value.fields.winner,
        });
      }
    }
  } else {
    for (let roundNum = 1; roundNum < currentRound; roundNum++) {
      claimedRewardMap.set(roundNum.toString(), {});
    }

    let claimedRewardDynamicFieldsResp = await suiClient.getDynamicFields({
      parentId: claimedRewardInfoId,
    });

    if (claimedRewardDynamicFieldsResp.data) {
      for (let claimedRewardDynamicObject of claimedRewardDynamicFieldsResp.data) {
        let claimedRewardObjectResp = await suiClient.getDynamicFieldObject({
          parentId: claimedRewardInfoId,
          name: {
            type: claimedRewardDynamicObject.name.type,
            value: claimedRewardDynamicObject.name.value,
          },
        });
        if (claimedRewardObjectResp.data) {
          let content: any = claimedRewardObjectResp.data.content;
          claimedRewardMap.set(content.fields.name, {
            rewardAmount: (
              Number(content.fields.value.fields.reward_amount) /
              Number(rewardDecimal)
            ).toFixed(10),
            winner: content.fields.value.fields.winner,
          });
        }
      }
    }
  }

  return {
    claimedRewardMap: claimedRewardMap,
  };
}

// 取得 Round 中獎號碼 資訊 Map
export async function getRoundInfo(poolId: string, roundArray: any[]) {
  let roundInfo: any = new Object();
  let roundInfoMap: Map<any, any> = new Map();
  roundInfo.roundInfoMap = roundInfoMap;

  if (roundArray && roundArray.length > 0) {
    for (let round of roundArray) {
      let dynamicFieldsResp = await suiClient.getDynamicFieldObject({
        parentId: poolId,
        name: {
          type: 'u64',
          value: `${round}`,
        },
      });
      if (dynamicFieldsResp.data) {
        let content: any = dynamicFieldsResp.data.content;
        roundInfoMap.set(content.fields.name, content.fields.value);
      }
    }
  } else {
    let dynamicFieldsResp = await suiClient.getDynamicFields({
      parentId: poolId,
    });

    if (dynamicFieldsResp.data) {
      let array = dynamicFieldsResp.data;
      for (let dynamicFields of array) {
        if (dynamicFields.objectType === 'u64') {
          // 得獎 round - 幸運號碼
          let winnerObjResp = await suiClient.getObject({
            id: dynamicFields.objectId,
            options: {
              showContent: true,
            },
          });
          if (winnerObjResp.data?.content) {
            let dataContent: any = winnerObjResp.data.content;
            let round = dataContent.fields.name;
            roundInfoMap.set(round, dataContent.fields.value);
          }
        }
      }
    }
  }
  return roundInfo;
}

// 取得 Round 的過期時間 資訊 Map
export async function getRoundExpireTimeInfo(
  poolId: string,
  roundArray: any[],
) {
  let roundExpireTimeInfo: any = new Object();
  let roundExpireTimeMap: Map<any, any> = new Map();
  roundExpireTimeInfo.roundExpireTimeMap = roundExpireTimeMap;

  let dynamicDataResp = await suiClient.getDynamicFields({
    parentId: poolId,
  });

  if (dynamicDataResp.data) {
    for (let data of dynamicDataResp.data) {
      if (!data.name.type.includes('pool::ClaimExpiredTime')) {
        continue;
      }
      let dynamicFieldsResp = await suiClient.getDynamicFieldObject({
        parentId: poolId,
        name: {
          type: data.name.type,
          value: data.name.value,
        },
      });

      if (dynamicFieldsResp.data) {
        let content: any = dynamicFieldsResp.data.content;
        if (roundArray && roundArray.length > 0) {
          for (let round of roundArray) {
            // 取得到期時間
            let expireDynamicFieldObjectResp =
              await suiClient.getDynamicFieldObject({
                parentId: content.fields.id.id,
                name: {
                  type: 'u64',
                  value: `${round}`,
                },
              });
            if (expireDynamicFieldObjectResp.data) {
              let content: any = expireDynamicFieldObjectResp.data.content;
              roundExpireTimeMap.set(content.fields.name, content.fields.value);
            }
          }
        } else {
          // 取得到期時間
          let expireDynamicFieldsResp = await suiClient.getDynamicFields({
            parentId: content.fields.id.id,
          });
          if (expireDynamicFieldsResp.data) {
            let expireDynamicFieldDataArray = expireDynamicFieldsResp.data;
            for (let expireDynamicFieldData of expireDynamicFieldDataArray) {
              let expireData = await suiClient.getObject({
                id: expireDynamicFieldData.objectId,
                options: {
                  showContent: true,
                },
              });
              if (expireData.data?.content) {
                let expireDataContent: any = expireData.data.content;
                roundExpireTimeMap.set(
                  expireDataContent.fields.name,
                  expireDataContent.fields.value,
                );
              }
            }
          }
        }
      }
    }
  }
  return roundExpireTimeInfo;
}

// 取得 供應 資訊
async function getShareSupply(shareSupplyId: string, decimal: number) {
  let objectResponse = await suiClient.getObject({
    id: shareSupplyId,
    options: {
      showContent: true,
    },
  });
  let obj: any = new Object();
  if (objectResponse.data?.content) {
    let data: any = objectResponse.data.content;
    obj.totalSupply = data.fields.total_supply / decimal;
    obj.activeSupply = data.fields.active_supply / decimal;
  }
  return obj;
}

// 取得 用戶餘額 資訊 Map
export async function getUserBalanceInfo(address: any, poolType: any) {
  let userBalanceMap: Map<any, any> = new Map();

  for (let poolConfig of poolAddressConfigMap.values()) {
    if (poolConfig.pool === '') {
      continue;
    }
    if (poolType && poolConfig.poolType !== poolType) {
      continue;
    }

    let stakeCoinType = poolTypeCommonTypeMap.get(
      poolConfig.poolType,
    ).nativeCoinType;
    let stakeCoinName = poolTypeCommonTypeMap.get(
      poolConfig.poolType,
    ).nativeCoinName;
    let stakeCoinDecimal = poolTypeCommonTypeMap.get(
      poolConfig.poolType,
    ).nativeDecimal;

    let walletBalance = await suiClient.getBalance({
      owner: address,
      coinType: stakeCoinType,
    });

    userBalanceMap.set(poolConfig.poolType, {
      stakeCoinName: stakeCoinName,
      totalBalance:
        Number(walletBalance.totalBalance) / Number(stakeCoinDecimal),
    });
  }

  return {
    userBalanceMap: userBalanceMap,
  };
}

// 取得用戶質押資訊
export async function getUserStakeInfo(
  address: string,
  poolType: any,
  totalDeposit: number,
) {
  let userStakeInfo: any = new Object();

  let userTicketList: any[] = [];
  userStakeInfo.userTicketList = userTicketList;

  let userStakeTotalAmount = 0;

  let poolTypeCommonType = poolTypeCommonTypeMap.get(poolType);
  userStakeInfo.stakeCoinName = poolTypeCommonType.nativeCoinName;

  if (address) {
    let filterStractList = filterMap.get(poolType);
    let objectResponse: any = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      filter: {
        MatchAny: filterStractList,
      },
    });

    if (objectResponse.data) {
      for (let resp of objectResponse.data) {
        let stakeShareId = resp.data.content.fields.id.id;
        let startNum = resp.data.content.fields.start_num;
        let endNum = resp.data.content.fields.end_num;

        let dynamicData = await getTableData(stakeShareId);

        let stakeAmount = dynamicData.get(stakeShareId);
        let realAmount = stakeAmount / poolTypeCommonType.nativeDecimal;
        userStakeTotalAmount =
          Number(userStakeTotalAmount) + Number(realAmount);

        userTicketList.push({
          stakeShareId: stakeShareId,
          startNum: startNum,
          endNum: endNum,
        });
      }
    }
  }

  let luckRate: number =
    userStakeTotalAmount == 0
      ? 0
      : (Number(userStakeTotalAmount) / Number(totalDeposit)) * 100;

  userStakeInfo.userStakeTotalAmount = userStakeTotalAmount;
  userStakeInfo.luckRate = luckRate;

  return userStakeInfo;
}

// 取得可領獎的 Round 資訊
export async function getCanClaimRewardInfo(
  poolId: any,
  currentRound: any,
  claimedRewardInfoId: string,
) {
  let canClaimRewardMap: Map<any, any> = new Map();
  let poolType = poolAddressConfigMap.get(poolId).poolType;

  let roundArray: any[] = [];
  // 已領獎資訊
  let claimedRewardInfo = await getClaimedRewardInfo(
    claimedRewardInfoId,
    [],
    currentRound,
    poolType,
  );
  let claimedRewardMap = claimedRewardInfo.claimedRewardMap;

  for (let roundNum = 1; roundNum < currentRound; roundNum++) {
    let claimObject = claimedRewardMap.get(roundNum.toString());
    if (Object.keys(claimObject).length === 0) {
      roundArray.push(roundNum);
    }
  }

  if (roundArray.length > 0) {
    let roundInfo = await getRoundInfo(poolId, roundArray);
    let roundInfoMap = roundInfo.roundInfoMap;

    let roundExpireTimeInfo = await getRoundExpireTimeInfo(poolId, roundArray);
    let roundExpireTimeMap = roundExpireTimeInfo.roundExpireTimeMap;

    let nowTime = new Date();

    for (let [round, luckNum] of roundInfoMap) {
      let expireTime = roundExpireTimeMap.get(round);
      if (expireTime) {
        if (nowTime > new Date(Number(expireTime))) {
          console.error(
            `round ${round} is expired : ${new Date(Number(expireTime)).toLocaleString()}`,
          );
          continue;
        } else {
          canClaimRewardMap.set(round, {
            round: round,
            luckNum: luckNum,
            expireTime: expireTime,
          });
        }
      } else {
        canClaimRewardMap.set(round, {
          round: round,
          luckNum: luckNum,
          expireTime: expireTime,
        });
      }
    }
  }

  return {
    canClaimRewardMap: canClaimRewardMap,
  };
}

// 取得 用戶中獎資訊
export async function getUserWinnerInfo(
  poolId: any,
  currentRound: any,
  claimedRewardInfoId: string,
  userTicketList: any[],
) {
  let winnerInfoList: any[] = [];

  let canClaimRewardMapInfo = await getCanClaimRewardInfo(
    poolId,
    currentRound,
    claimedRewardInfoId,
  );
  let canClaimRewardMap = canClaimRewardMapInfo.canClaimRewardMap;

  for (let [round, luckInfo] of canClaimRewardMap) {
    for (let userTicket of userTicketList) {
      let stakeShareId = userTicket.stakeShareId;
      let startNum = userTicket.startNum;
      let endNum = userTicket.endNum;
      let luckNum = luckInfo.luckNum;
      if (
        Number(luckNum) >= Number(startNum) &&
        Number(luckNum) <= Number(endNum)
      ) {
        winnerInfoList.push({
          poolId: poolId,
          round: round,
          luckNum: luckNum,
          stakeShareId: stakeShareId,
          expireTime: luckInfo.expireTime,
        });
      }
    }
  }

  return {
    winnerInfoList: winnerInfoList,
  };
}

// 取得 Table 內的資料
async function getTableData(fieldId: string) {
  let tableDataResp = await suiClient.getDynamicFields({
    parentId: fieldId,
  });
  let tableMap = new Map();
  if (tableDataResp.data) {
    for (let i = 0; i < tableDataResp.data.length; i += 1) {
      let obj = tableDataResp.data[i];
      let type = obj.name.type;
      let value = obj.name.value;

      await getTableRawData(fieldId, type, value).then((rep) => {
        for (let [key, value] of rep) {
          tableMap.set(key, value);
        }
      });
    }
  }
  return tableMap;
}

// 取得 Table 內的原始資料
async function getTableRawData(fieldId: string, type: string, value: unknown) {
  let response = await suiClient.getDynamicFieldObject({
    parentId: fieldId,
    name: {
      type: type,
      value: value,
    },
  });

  const tableMap = new Map();
  if (response.data) {
    let content: any = response.data.content;
    let map_key = content.fields.name;
    let map_value = content.fields.value;
    tableMap.set(map_key, map_value);
  }

  return tableMap;
}

// 建構 Stake 的交易區塊
export async function packStakeTxb(
  address: string,
  poolId: string,
  stakeAmount: number,
  bucketStakeCoinType: string | undefined | null,
) {
  let poolConfig = poolAddressConfigMap.get(poolId);
  let poolType = poolConfig.poolType;

  let txb: any = new TransactionBlock();

  let args: TransactionArgument[] = [];
  let typeArgs: any[] = [];
  let decimal = poolTypeCommonTypeMap.get(poolType).nativeDecimal;
  let stakeCoinType = poolTypeCommonTypeMap.get(poolType).nativeCoinType;
  let coinObjectId: string = '';
  let needSplit = false;

  let change2Buck = false;

  if (PoolTypeEnum.BUCKET_PROTOCOL === poolType) {
    if (
      bucketStakeCoinType != null &&
      bucketStakeCoinType != undefined &&
      bucketStakeCoinType.length > 0
    ) {
      switch (bucketStakeCoinType) {
        case BucketCoinTypeEnum.USDC:
          stakeCoinType = USDC_COIN_TYPE;
          decimal = USDC_COIN_DECIMAL;
          change2Buck = true;
          break;
        case BucketCoinTypeEnum.USDT:
          stakeCoinType = USDT_COIN_TYPE;
          decimal = USDT_COIN_DECIMAL;
          change2Buck = true;
          break;
      }
    }
  }

  let walletBalance: any = await suiClient.getBalance({
    owner: address,
    coinType: stakeCoinType,
  });

  let stakeCoinAmount: number = Number(stakeAmount * decimal);

  if (walletBalance.totalBalance < stakeCoinAmount) {
    alert('Not Enough Balance.');
    return null;
  } else if (walletBalance.totalBalance > stakeCoinAmount) {
    needSplit = true;
  }

  let walletCoinResp: any = await suiClient.getCoins({
    owner: address,
    coinType: stakeCoinType,
  });

  let coinsArray = [];

  let index = 0;

  for (let coinInfo of walletCoinResp.data) {
    if (index == 0) {
      coinObjectId = coinInfo.coinObjectId;
    } else {
      coinsArray.push(coinInfo.coinObjectId);
    }
    index++;
  }

  if (coinsArray.length > 0) {
    if (poolType !== PoolTypeEnum.SCALLOP_PROTOCOL_SUI) {
      txb.mergeCoins(coinObjectId, coinsArray);
    }
  }

  let [realCoin]: any = [];
  if (needSplit) {
    if (poolType === PoolTypeEnum.SCALLOP_PROTOCOL_SUI) {
      [realCoin] = txb.splitCoins(txb.gas, [txb.pure(stakeCoinAmount)]);
    } else {
      [realCoin] = txb.splitCoins(coinObjectId, [txb.pure(stakeCoinAmount)]);
    }
  }

  switch (poolType) {
    case PoolTypeEnum.BUCKET_PROTOCOL:
      let coinOut = null;

      if (change2Buck) {
        coinOut = bucket.psmSwapIn(
          txb,
          stakeCoinType, // e.g USDC coin type
          realCoin, // usdc coin object
          address, // referrer address
        );
      }

      typeArgs = [BUCK_COIN_TYPE, SUI_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolConfig.numberPool),
        txb.object(poolId),
        txb.object(BUCKET_FLASK),
        change2Buck ? coinOut : needSplit ? realCoin : txb.object(coinObjectId),
        txb.object(BUCKET_FOUTAIN),
        txb.pure.u64(BUCKET_LOCK_TIME),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_BUCKET_ADAPTER}::${FUN_STAKE}`,
        typeArguments: typeArgs,
        arguments: args,
      });
      break;

    case PoolTypeEnum.SCALLOP_PROTOCOL:
      typeArgs = [SCALLOP_PROTOCOL_POOL_TYPE, SCA_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolConfig.numberPool),
        txb.object(poolId),
        txb.object(SCALLOP_VERSION),
        txb.object(SCALLOP_MARKET),
        needSplit ? realCoin : txb.object(coinObjectId),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_STAKE}`,
        typeArguments: typeArgs,
        arguments: args,
      });

      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      typeArgs = [SCALLOP_PROTOCOL_SUI_POOL_TYPE, SUI_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolConfig.numberPool),
        txb.object(poolId),
        txb.object(SCALLOP_VERSION),
        txb.object(SCALLOP_MARKET),
        needSplit ? realCoin : txb.object(coinObjectId),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_STAKE}`,
        typeArguments: typeArgs,
        arguments: args,
      });

      break;
  }

  let getPoolInfoDbPath = `${DB_ROOT_PATH}/${poolConfig.poolType}/${DB_CHILD_GET_POOL_INFO}`;
  await remove(child(DB_REF, getPoolInfoDbPath));

  return txb;
}

// 建構 withdraw 的交易區塊
export async function packWithdrawTxb(
  address: string,
  poolType: string,
  withdrawAmount: number,
  bucketWithdrawCoinType: string | null | undefined,
) {
  if (address) {
    let txb: any = new TransactionBlock();

    let poolConfig = poolTypeConfigMap.get(poolType);
    let poolCommonType = poolTypeCommonTypeMap.get(poolType);
    let totalAmount: number = 0;
    let needBreak: boolean = false;

    let buckChange2OtherCoin = false;
    let changeCoinType = '';
    let changeCoinDecimal = SUI_COIN_DECIMAL;

    if (
      PoolTypeEnum.BUCKET_PROTOCOL === poolType &&
      bucketWithdrawCoinType != null &&
      bucketWithdrawCoinType != undefined &&
      bucketWithdrawCoinType.length > 0
    ) {
      switch (bucketWithdrawCoinType) {
        case BucketCoinTypeEnum.USDC:
          buckChange2OtherCoin = true;
          changeCoinType = USDC_COIN_TYPE;
          changeCoinDecimal = USDC_COIN_DECIMAL;
          break;
        case BucketCoinTypeEnum.USDT:
          buckChange2OtherCoin = true;
          changeCoinType = USDT_COIN_TYPE;
          changeCoinDecimal = USDT_COIN_DECIMAL;
          break;
      }
    }

    let objectResponse: any = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      filter: {
        MatchAny: filters,
      },
    });

    if (objectResponse.data) {
      for (let resp of objectResponse.data) {
        let args: TransactionArgument[] = [];
        let splitArgs: TransactionArgument[];
        let typeArgs: any[];
        let splitTypeArgs: any[];

        let [newShare]: any[] = [];

        let stakePoolShareId = resp.data.content.fields.id.id;
        let ticketPoolType = resp.data.content.type
          .split(',')[0]
          .split('::')[4];

        if (poolType !== ticketPoolType) {
          continue;
        }

        let decimal = poolCommonType.nativeDecimal;

        let dynamicDataResp = await suiClient.getDynamicFields({
          parentId: stakePoolShareId,
        });

        if (dynamicDataResp.data) {
          for (let dynamicData of dynamicDataResp.data) {
            if (dynamicData.objectType === 'u64') {
              let dynamicObjectMap = await getTableRawData(
                stakePoolShareId,
                dynamicData.name.type,
                dynamicData.name.value,
              );
              let startNum = resp.data.content.fields.start_num;
              let endNum = resp.data.content.fields.end_num;
              let stakeAmount = dynamicObjectMap.get(stakePoolShareId);
              let realAmount = stakeAmount / decimal;
              totalAmount = Number(totalAmount) + Number(realAmount);

              let rangeNum = endNum - startNum + 1;
              let numRate = rangeNum / stakeAmount;

              if (withdrawAmount < totalAmount) {
                let shareAmount =
                  Number(withdrawAmount) -
                  (Number(totalAmount) - Number(realAmount));
                shareAmount = parseInt(
                  (shareAmount * numRate * decimal).toString(),
                );
                if (shareAmount <= 0) {
                  needBreak = true;
                  break;
                }
                // 切割 share
                splitArgs = [
                  txb.object(stakePoolShareId),
                  txb.pure(shareAmount),
                ];

                splitTypeArgs = [
                  `${PACKAGE_ID}::pool::${poolType}`,
                  poolCommonType.nativeType,
                  poolCommonType.rewardType,
                ];

                newShare = txb.moveCall({
                  target: `${PACKAGE_ID}::${MODULE_STAKED_SHARE}::${FUN_SPLIT_SHARE}`,
                  arguments: splitArgs,
                  typeArguments: splitTypeArgs,
                });

                switch (poolType) {
                  case PoolTypeEnum.BUCKET_PROTOCOL:
                    typeArgs = [BUCK_COIN_TYPE, SUI_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      txb.object(SUI_CLOCK_ID),
                      txb.object(BUCKET_FLASK),
                      txb.object(BUCKET_FOUTAIN),
                      newShare,
                      txb.pure.u64(BUCKET_LOCK_TIME),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_BUCKET_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });

                    break;
                  case PoolTypeEnum.SCALLOP_PROTOCOL:
                    typeArgs = [SCALLOP_PROTOCOL_POOL_TYPE, SCA_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      newShare,
                      txb.object(SCALLOP_VERSION),
                      txb.object(SCALLOP_MARKET),
                      txb.object(SUI_CLOCK_ID),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });

                    break;
                  case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
                    typeArgs = [SCALLOP_PROTOCOL_SUI_POOL_TYPE, SUI_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      newShare,
                      txb.object(SCALLOP_VERSION),
                      txb.object(SCALLOP_MARKET),
                      txb.object(SUI_CLOCK_ID),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });

                    break;
                }
                needBreak = true;
                break;
              } else {
                switch (poolType) {
                  case PoolTypeEnum.BUCKET_PROTOCOL:
                    typeArgs = [BUCK_COIN_TYPE, SUI_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      txb.object(SUI_CLOCK_ID),
                      txb.object(BUCKET_FLASK),
                      txb.object(BUCKET_FOUTAIN),
                      txb.object(stakePoolShareId),
                      txb.pure.u64(BUCKET_LOCK_TIME),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_BUCKET_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });

                    break;
                  case PoolTypeEnum.SCALLOP_PROTOCOL:
                    typeArgs = [SCALLOP_PROTOCOL_POOL_TYPE, SCA_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      txb.object(stakePoolShareId),
                      txb.object(SCALLOP_VERSION),
                      txb.object(SCALLOP_MARKET),
                      txb.object(SUI_CLOCK_ID),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });
                    break;
                  case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
                    typeArgs = [SCALLOP_PROTOCOL_SUI_POOL_TYPE, SUI_COIN_TYPE];

                    args = [
                      txb.object(GLOBAL_CONFIG_ID),
                      txb.object(poolConfig.shareSupply),
                      txb.object(poolConfig.numberPool),
                      txb.object(poolConfig.pool),
                      txb.object(stakePoolShareId),
                      txb.object(SCALLOP_VERSION),
                      txb.object(SCALLOP_MARKET),
                      txb.object(SUI_CLOCK_ID),
                    ];

                    txb.moveCall({
                      target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_WITHDRAW}`,
                      arguments: args,
                      typeArguments: typeArgs,
                    });
                    break;
                }
              }
            }
          }
        }

        if (needBreak) {
          break;
        }
      }

      if (buckChange2OtherCoin) {
        await bucket.getPsmTx(
          txb,
          changeCoinType,
          withdrawAmount * BUCK_COIN_DECIMAL,
          true,
          address,
          address,
        );
      }
    }

    let getPoolInfoDbPath = `${DB_ROOT_PATH}/${poolConfig.poolType}/${DB_CHILD_GET_POOL_INFO}`;
    await remove(child(DB_REF, getPoolInfoDbPath));

    return txb;
  }

  return null;
}

function stringToHex(str: string) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += ('0' + str.charCodeAt(i).toString(16)).slice(-2);
  }
  return hex;
}

// 建構 分配獎勵 的交易區塊
export async function packAllocateRewardsTxb(poolId: string) {
  let poolConfig = poolAddressConfigMap.get(poolId);
  let poolType = poolConfig.poolType;

  let txb: TransactionBlock = new TransactionBlock();

  let args: TransactionArgument[];
  let typeArgs: any[];

  const theLatestBeacon = await fetchBeaconByTime(drandClient, Date.now());

  const drand_round: number = theLatestBeacon.round;

  let privateKeyByte = bls.utils.randomPrivateKey();
  let publicKeyByte = bls.getPublicKey(privateKeyByte);

  let drandRoundHex = stringToHex(drand_round.toString());

  let messageSign = bls.sign(drandRoundHex, privateKeyByte);

  switch (poolType) {
    case PoolTypeEnum.BUCKET_PROTOCOL:
      typeArgs = [BUCK_COIN_TYPE, SUI_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolId),
        txb.object(BUCKET_FOUTAIN),
        txb.pure(bcs.vector(bcs.U8).serialize(messageSign)),
        txb.pure(bcs.vector(bcs.U8).serialize(publicKeyByte)),
        txb.pure(hex16String2Vector(drandRoundHex)),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_BUCKET_ADAPTER}::${FUN_ALLOCATE_REWARDS}`,
        arguments: args,
        typeArguments: typeArgs,
      });

      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL:
      typeArgs = [SCALLOP_PROTOCOL_POOL_TYPE, SCA_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolId),
        txb.object(SCALLOP_VERSION),
        txb.object(SCALLOP_MARKET),
        txb.pure(bcs.vector(bcs.U8).serialize(messageSign)),
        txb.pure(bcs.vector(bcs.U8).serialize(publicKeyByte)),
        txb.pure(hex16String2Vector(drandRoundHex)),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_ALLOCATE_REWARDS}`,
        arguments: args,
        typeArguments: typeArgs,
      });

      break;
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      typeArgs = [SCALLOP_PROTOCOL_SUI_POOL_TYPE, SUI_COIN_TYPE];

      args = [
        txb.object(GLOBAL_CONFIG_ID),
        txb.object(poolConfig.shareSupply),
        txb.object(poolId),
        txb.object(SCALLOP_VERSION),
        txb.object(SCALLOP_MARKET),
        txb.pure(bcs.vector(bcs.U8).serialize(messageSign)),
        txb.pure(bcs.vector(bcs.U8).serialize(publicKeyByte)),
        txb.pure(hex16String2Vector(drandRoundHex)),
        txb.object(SUI_CLOCK_ID),
      ];

      txb.moveCall({
        target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_ALLOCATE_REWARDS}`,
        arguments: args,
        typeArguments: typeArgs,
      });

      break;
  }

  let getPoolInfoDbPath = `${DB_ROOT_PATH}/${poolConfig.poolType}/${DB_CHILD_GET_POOL_INFO}`;
  await remove(child(DB_REF, getPoolInfoDbPath));

  return txb;
}

// 重設 Firebase 的 RealTime Database 資料
// 當 packAllocateRewardsTxb 執行成功後，要來呼叫這支 API
export async function resetRewardAmount(poolType: string) {
  let rewardDbPath = `${DB_ROOT_PATH}/${poolType}/${DB_CHILD_REWARD_INFO}`;
  let rewardSnapshot = await get(child(DB_REF, rewardDbPath));
  let newRewardAmount: number = 0;
  let newTime: string = '';

  if (rewardSnapshot.exists()) {
    newRewardAmount = rewardSnapshot.val().new;
    newTime = rewardSnapshot.val().newTime;
  }

  set(ref(FIREBASE_DB, rewardDbPath), {
    old: 0,
    oldTime: newTime,
    new: newRewardAmount,
    newTime: newTime,
  });
}

// 建構 領取獎勵 的交易區塊
export async function packClaimRewardTxb(
  poolType: string,
  winnerInfoList: any[],
) {
  if (winnerInfoList.length == 0) {
    return null;
  }

  let txb: TransactionBlock = new TransactionBlock();

  for (let winnerInfo of winnerInfoList) {
    let args: TransactionArgument[];
    let typeArgs: any[];

    let stakedShareId = winnerInfo.stakeShareId;

    switch (poolType) {
      case PoolTypeEnum.BUCKET_PROTOCOL:
        typeArgs = [BUCK_COIN_TYPE, SUI_COIN_TYPE];

        args = [
          txb.object(GLOBAL_CONFIG_ID),
          txb.object(winnerInfo.poolId),
          txb.pure(winnerInfo.round),
          txb.makeMoveVec({ objects: [stakedShareId] }),
          txb.object(SUI_CLOCK_ID),
        ];

        txb.moveCall({
          target: `${PACKAGE_ID}::${MODULE_BUCKET_ADAPTER}::${FUN_CLAIM_REWARD}`,
          arguments: args,
          typeArguments: typeArgs,
        });

        break;
      case PoolTypeEnum.SCALLOP_PROTOCOL:
        typeArgs = [SCALLOP_PROTOCOL_POOL_TYPE, SCA_COIN_TYPE];

        args = [
          txb.object(GLOBAL_CONFIG_ID),
          txb.object(winnerInfo.poolId),
          txb.pure(winnerInfo.round),
          txb.makeMoveVec({ objects: [stakedShareId] }),
          txb.object(SUI_CLOCK_ID),
        ];

        txb.moveCall({
          target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_CLAIM_REWARD}`,
          arguments: args,
          typeArguments: typeArgs,
        });

        break;
      case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
        typeArgs = [SCALLOP_PROTOCOL_SUI_POOL_TYPE, SUI_COIN_TYPE];

        args = [
          txb.object(GLOBAL_CONFIG_ID),
          txb.object(winnerInfo.poolId),
          txb.pure(winnerInfo.round),
          txb.makeMoveVec({ objects: [stakedShareId] }),
          txb.object(SUI_CLOCK_ID),
        ];

        txb.moveCall({
          target: `${PACKAGE_ID}::${MODULE_SCALLOP_ADAPTER}::${FUN_CLAIM_REWARD}`,
          arguments: args,
          typeArguments: typeArgs,
        });

        break;
    }
  }

  return txb;
}

// 存入 claim 成功後的 digest
export async function saveClaimDigest(
  poolType: string,
  address: string,
  successResult: any,
) {
  if (successResult) {
    let digest = successResult.digest;
    let digestInfo: any = await getClaimDigestList(poolType, address);
    let digestList = digestInfo.digestList;
    digestList.push(SUI_VISION_DOMAIN + digest);
    localStorage.setItem(
      PACKAGE_ID + address + poolType + 'digestList',
      JSON.stringify(digestList),
    );
  }
}

// 取得 claim 的 digest List
export async function getClaimDigestList(poolType: string, address: string) {
  let digestList: any[] = [];

  let digestListStr = localStorage.getItem(
    PACKAGE_ID + address + poolType + 'digestList',
  );
  if (digestListStr && digestListStr.length > 0) {
    digestList = JSON.parse(digestListStr);
  }

  return {
    digestList: digestList,
  };
}

function hex16String2Vector(str: string) {
  // 定義一個空數組來存儲結果
  let byteArray = [];

  // 將十六進制字符串每兩個字符分割並將其轉換為十進制數字，然後添加到數組中
  for (let i = 0; i < str.length; i += 2) {
    byteArray.push(parseInt(str.slice(i, i + 2), 16));
  }

  return byteArray;
}
