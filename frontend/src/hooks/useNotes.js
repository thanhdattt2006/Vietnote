import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import noteApi from '../api/noteApi';

export const useNotes = (page = 1, limit = 20, search = '') => {
  return useQuery({
    queryKey: ['notes', { page, limit, search }],
    queryFn: async () => {
      if (search) {
        const response = await noteApi.search(search);
        // Handle both paginated and unpaginated search responses
        if (response.data) {
          return response;
        }
        return { data: response, current_page: 1, total: response.length || 0 };
      }
      return noteApi.getAll({ page, limit });
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => noteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => noteApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noteApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useTogglePinNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noteApi.togglePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useTrashNotes = () => {
  return useQuery({
    queryKey: ['trashNotes'],
    queryFn: () => noteApi.getTrash(),
  });
};

export const useRestoreNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noteApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trashNotes'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useForceDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => noteApi.forceDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trashNotes'] });
    },
  });
};
