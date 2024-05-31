export const poolCoin = {
  SCALLOP_PROTOCOL_SUI: { name: 'SUI', type: '0x2::sui::SUI' },
  BUCKET_PROTOCOL: {
    name: 'BUCK',
    type: '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK',
  },
  SCALLOP_PROTOCOL: {
    name: 'SCA',
    type: '0x7016aae72cfc67f2fadf55769c0a7dd54291a583b63051a5ed71081cce836ac6::sca::SCA',
  },
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
