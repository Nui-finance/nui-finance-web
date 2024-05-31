import { HStack, Text } from '@chakra-ui/react';
import { getProtocolLabel } from 'utils';
import ProtocolIcon from './protocol-icon';

const ProtocolCell = ({ type }: { type: string }) => {
  return (
    <HStack>
      <ProtocolIcon type={type} />
      <Text fontSize="sm">{getProtocolLabel(type)}</Text>
    </HStack>
  );
};

export default ProtocolCell;
