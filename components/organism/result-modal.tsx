import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Text,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { poolCoin } from 'applications/constants';
import { useIntl } from 'utils';
import { Pool } from 'applications/type';
import {
  ResponsiveModal,
  ResponsiveModalBody,
  ResponsiveModalFooter,
} from 'components/molecule/responsive-modal';
import { Link, Image } from 'components/molecule';

import RewardImage from 'assets/reward.png';
import DepositImage from 'assets/deposit.png';
import WithdrawImage from 'assets/withdraw.png';
import PendingImage from 'assets/pending.png';
import SuccessImage from 'assets/success.png';
import ErrorImage from 'assets/error.png';
import UnselectedImage from 'assets/unselected.png';

type ResultModalProps = {
  type:
    | 'REWARD'
    | 'DEPOSIT'
    | 'WITHDRAW'
    | 'PENDING'
    | 'SUCCESS'
    | 'ERROR'
    | 'UNSELECTED';
  result?: any;
  pool?: Pool;
  amount?: number | string;
  isOpen: boolean;
  onClose: () => void;
} & UseDisclosureProps;

const mappedModalType = (type) => {
  switch (type) {
    case 'REWARD':
      return {
        title: 'Reward Received',
        imageUrl: RewardImage.src,
      };
    case 'DEPOSIT':
      return {
        title: 'Deposit Successfully',
        imageUrl: DepositImage.src,
      };
    case 'WITHDRAW':
      return {
        title: 'Fund Withdrawn',
        imageUrl: WithdrawImage.src,
      };
    case 'PENDING':
      return {
        title: 'Pending Withdrawal',
        imageUrl: PendingImage.src,
      };
    case 'SUCCESS':
      return {
        title: 'Claim Successfully',
        imageUrl: SuccessImage.src,
      };
    case 'ERROR':
      return {
        title: 'Something Went Wrong',
        imageUrl: ErrorImage.src,
      };
    case 'UNSELECTED':
      return {
        title: 'Didn’t Get Chosen',
        imageUrl: UnselectedImage.src,
      };
    default:
      return {
        title: 'UNKNOWN',
        imageUrl: '',
      };
  }
};

const ResultModal = ({
  type,
  result,
  pool,
  amount,
  isOpen,
  onClose,
}: ResultModalProps) => {
  const { poolType } = pool ?? {};
  // const { formatBalance } = useIntl();

  const explorerUrl = `https://suiscan.xyz/${process.env.NEXT_PUBLIC_SUI_NETWORK_NAME}/tx/${result?.digest}`;

  const { title, imageUrl } = mappedModalType(type);

  return (
    <ResponsiveModal size="sm" isOpen={isOpen} onClose={onClose}>
      <ResponsiveModalBody>
        <Flex flexDirection="column" gap="4" alignItems="center" w="full">
          <AspectRatio w="12.75rem" ratio={1}>
            <Image src={imageUrl} alt="fund withdrawn" fill />
          </AspectRatio>
          <Heading as="h2" fontSize="2rem" textAlign="center">
            {title}
          </Heading>
          {!!amount && (
            <Flex flexDirection="column" w="full">
              <Flex justifyContent="space-between" w="full">
                <Text fontSize="sm">Amount</Text>
                <Text color="primary.400" fontSize="sm">
                  {amount} {pool?.rewardCoinName}
                </Text>
              </Flex>
            </Flex>
          )}
          {!!result?.digest && (
            <Link
              href={explorerUrl}
              target="_blank"
              textDecorationLine="underline"
              color="neutral.400"
              fontSize="sm"
            >
              View Transaction
            </Link>
          )}
        </Flex>
      </ResponsiveModalBody>
      <ResponsiveModalFooter justifyContent="stretch">
        <Button type="submit" onClick={onClose} colorScheme="primary" flex="1">
          Got it
        </Button>
      </ResponsiveModalFooter>
    </ResponsiveModal>
  );
};

export default ResultModal;
