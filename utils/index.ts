import { useIntl as useOriginalIntl } from 'react-intl';
import { PoolTypeEnum } from 'sui-api-final-v2';

export const formatAddress = (address = '', n = 6, p = 4): string => {
  const re = new RegExp(`^(\\w{${n}})\\w+(\\w{${p}})$`);

  return (address && address.replace(re, '$1...$2')) || '';
};

export const useIntl = () => {
  const originalIntl = useOriginalIntl();
  const formatPrice = (
    price: number,
    { compact = true, maximumFractionDigits = 3 } = {},
  ) => {
    price = Number(price);
    if (compact && price !== 0 && price < Math.pow(10, -3)) {
      return '< 0.001';
    }

    if (!compact && price !== 0 && price < Math.pow(10, -6)) {
      return '< 0.000001';
    }

    if (compact) {
      // use native intl to enforce en-US compact notation
      // to avoid notation like '1億' in zh-TW
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits,
      }).format(price);
    }

    return originalIntl.formatNumber(price, {
      notation: 'standard',
      maximumFractionDigits: 6,
    });
  };

  const formatBalance = (balance: number | bigint) => {
    return originalIntl.formatNumber(balance, {
      roundingMode: 'floor',
      trailingZeroDisplay: 'stripIfInteger',
      maximumFractionDigits: 5,
      roundingPriority: 'auto',
    });
  };

  const formatUSD = (value: number | bigint) => {
    return originalIntl.formatNumber(value, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    });
  };

  return { ...originalIntl, formatPrice, formatBalance, formatUSD };
};

export const roundNumber = (number: number, scale: number): number => {
  return Math.floor(number * 10 ** scale) / 10 ** scale;
};

export const getProtocolLabel = (type: string) => {
  switch (type) {
    case PoolTypeEnum.SCALLOP_PROTOCOL_SUI:
      return 'SUI-Raffle';
    case PoolTypeEnum.BUCKET_PROTOCOL:
      return 'BUCK-Raffle';
    case PoolTypeEnum.SCALLOP_PROTOCOL:
      return 'SCA-Raffle';
    default:
      return 'unknown protocol';
  }
};

export function roundTo(num: number, decimal: number) {
  return (
    Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) /
    Math.pow(10, decimal)
  );
}

export const convertScientificToDecimal = (number: number) => {
  if (!number?.toString()?.includes('e')) return number;
  const numberArr = number?.toString()?.split('e');
  const decimal = Math.abs(Number(numberArr?.[1]));
  return number?.toFixed(Number(decimal));
};
