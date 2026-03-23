import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '../services/post.service';
import type { CreatePostDTO } from '../types';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDTO) => PostService.createPost(data),
    onSuccess: (data) => {
      if (!data.error) {
        // Invalidate the feed query to trigger a refetch and show the new post
        queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      }
    },
  });
};
