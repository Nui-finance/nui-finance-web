import { useMutation, useQueryClient } from '@tanstack/react-query';

const useInvalidateAllInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['pool-info'],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['user-stake-info'],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['user-balance-info'],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['user-winner-info'],
        refetchType: 'all',
      });
    },
  });
};

export default useInvalidateAllInfo;
