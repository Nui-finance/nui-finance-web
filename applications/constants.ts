export const poolCoin = {
  SCALLOP_PROTOCOL_SUI: { name: 'SUI' },
  BUCKET_PROTOCOL: {
    name: 'BUCK',
  },
  SCALLOP_PROTOCOL: {
    name: 'SCA',
  },
};

export const poolCoinType = {
  SUI: '0x2::sui::SUI',
  BUCK: process.env.NEXT_PUBLIC_BUCK_COIN_TYPE,
  SCA: process.env.NEXT_PUBLIC_SCA_COIN_TYPE,
  USDT: process.env.NEXT_PUBLIC_USDT_COIN_TYPE,
  USDC: process.env.NEXT_PUBLIC_USDC_COIN_TYPE,
};

export const poolCoinDecimal = {
  SUI: 1_000_000_000,
  BUCK: 1_000_000_000,
  SCA: 1_000_000_000,
  USDT: 1_000_000,
  USDC: 1_000_000,
};

export const poolTypeByCoinName = {
  SUI: 'SCALLOP_PROTOCOL_SUI',
  BUCK: 'BUCKET_PROTOCOL',
  SCA: 'SCALLOP_PROTOCOL',
};

export const poolSource = {
  SCALLOP_PROTOCOL_SUI: 'scallop protocol',
  BUCKET_PROTOCOL: 'bucket protocol',
  SCALLOP_PROTOCOL: 'scallop protocol',
};

export const poolSwapUrl = {
  SCALLOP_PROTOCOL_SUI: 'https://scallop.exchange/swap',
  BUCKET_PROTOCOL:
    'https://app.cetus.zone/swap?from=0x2::sui::SUI&to=0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK',
  SCALLOP_PROTOCOL:
    'https://app.cetus.zone/swap?from=0x2::sui::SUI&to=0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
};

export const poolPageName = {
  SCALLOP_PROTOCOL_SUI: 'sui-raffle',
  BUCKET_PROTOCOL: 'buck-raffle',
  SCALLOP_PROTOCOL: 'scallop-raffle',
};
