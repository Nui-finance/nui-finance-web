import { IconProps } from '@chakra-ui/react';
import { Buck, Scallop, Sui } from './icons';
import { PoolTypeEnum } from 'sui-api-final-v2';

const ProtocolIcon = ({ type, ...restProps }: { type: string } & IconProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case PoolTypeEnum.BUCKET_PROTOCOL:
        return <Buck {...restProps} />;
      case PoolTypeEnum.SCALLOP_PROTOCOL:
        return <Scallop {...restProps} />;
      case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
        return <Sui {...restProps} />;
      default:
        return null;
    }
  };

  return getIcon(type);
};

export default ProtocolIcon;
