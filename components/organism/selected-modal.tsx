import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Text,
  UseDisclosureProps,
  useDisclosure,
} from '@chakra-ui/react';
import { poolCoin } from 'applications/constants';
import { convertScientificToDecimal } from 'utils';
import { Pool } from 'applications/type';
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalFooter,
} from 'components/molecule/responsive-modal';
import { Image } from 'components/molecule';

import RewardImage from 'assets/reward.png';

import { useClaim } from 'applications/mutation';
import useCountdown from 'utils/use-countdown';
import { useState } from 'react';
import { UserWinnerInfo } from 'applications/query/use-get-user-winner-info';
import { useModal } from './modals';

type SelectedModalProps = {
  result?: any;
  pool: Pool;
  winnerInfoList?: UserWinnerInfo['winnerInfoList'];
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

let claiming = false;

const SelectedModal = ({
  pool,
  winnerInfoList,
  isOpen,
  onClose,
}: SelectedModalProps) => {
  const { poolType } = pool ?? {};
  // const { formatBalance } = useIntl();
  const [result, setResult] = useState();
  const claimSuccessDisclosure = useDisclosure();

  const { mutate: claim, isPending: isClaiming } = useClaim({
    pool,
    winnerInfoList,
    onSuccess: (data: any) => {
      setResult(data);
      successOpen({
        pool,
        result: data,
        amount: convertScientificToDecimal(pool?.lastRewardBalance),
        onClose: () => {
          onClose();
        },
      });
      claimSuccessDisclosure.onOpen();
    },
    onError: () => {
      onClose();
    },
    onSettled: () => {
      claiming = false;
    },
  });
  const countdown = useCountdown(Number(winnerInfoList?.[0]?.expireTime));
  const { successOpen } = useModal();

  return (
    <>
      <ResponsiveModal size="sm" isOpen={isOpen} onClose={onClose}>
        <ResponsiveModalBody>
          <Flex flexDirection="column" gap="4" alignItems="center" w="full">
            <AspectRatio w="12.75rem" ratio={1}>
              <Image src={RewardImage} alt="fund withdrawn" fill />
            </AspectRatio>
            <Heading as="h2" fontSize="2rem" textAlign="center">
              You Got Chosen!
            </Heading>

            <Flex flexDirection="column" w="full">
              <Flex justifyContent="space-between" w="full">
                <Text fontSize="sm">
                  #week {Number(pool?.currentRound) - 1}
                </Text>
                <Text color="primary.400" fontSize="sm">
                  {countdown}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </ResponsiveModalBody>
        <ResponsiveModalFooter justifyContent="stretch">
          <Button
            type="submit"
            onClick={() => {
              if (claiming) return;
              claiming = true;
              claim();
            }}
            colorScheme="primary"
            flex="1"
            isLoading={isClaiming}
          >
            Claim {convertScientificToDecimal(pool?.lastRewardBalance)}{' '}
            {pool?.rewardCoinName}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModal>
    </>
  );
};

export default SelectedModal;
