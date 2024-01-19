import{
    useQuery,
    useMutation,
    useMutationState,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { approvePost, createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getPostById, getRecentPosts, savePost, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import SigninForm from '@/_auth/forms/SigninForm'
import { QUERY_KEYS } from './queryKeys';


export const useCreateUserAccount = () => {
    return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user),
    });
  };
  
export const useSignInAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string }) =>
        signInAccount(user),
    });
  };

export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount
    });
  };

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post : INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [QUERY_KEYS.GET_RECENT_POSTS]}
      )
    }
  })
}
  
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}


export const useApprovePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, approvesArray }: {postId: string, approvesArray: string[] }
      ) => approvePost(postId, approvesArray), 
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS, data?.$id] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER, data?.$id] 
        })
      }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: {postId: string, userId: string }
      ) => savePost(postId, userId), 
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER] 
        })
      }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId), 
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS] 
        })
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER] 
        })
      }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey : [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn : () => getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, imageId} : {postId: string, imageId: string}) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}