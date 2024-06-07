import { IconProps } from '@chakra-ui/react';
import { Buck, Scallop, Sui } from './icons';
import { PoolTypeEnum } from 'sui-api-final-v2';
import Usdt from './icons/usdt';
import Usdc from './icons/usdc';

const ProtocolIcon = ({ type, ...restProps }: { type: string } & IconProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case PoolTypeEnum.BUCKET_PROTOCOL:
        return <Buck {...restProps} />;
      case PoolTypeEnum.SCALLOP_PROTOCOL:
        return <Scallop {...restProps} />;
      case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
        return <Sui {...restProps} />;
      case 'USDT':
        return <Usdt {...restProps} />;
      case 'USDC':
        return <Usdc {...restProps} />;
      default:
        return null;
    }
  };

  return getIcon(type);
};

export default ProtocolIcon;
