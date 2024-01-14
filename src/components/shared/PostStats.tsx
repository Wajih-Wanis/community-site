import { useUserContext } from '@/context/AuthContext';
import { useApprovePost, useDeleteSavedPost, useSavePost } from '@/lib/react-query/queries';
import { checkIsApproved} from '@/lib/utils';
import { Models } from 'appwrite';
import React, { useState } from 'react'

type PostStatsProps = {
    post: Models.Document;
    userId: String;
}

const PostStats = ({post, userId}: PostStatsProps) => {
  const approvesList = post.approves.map((user: Models.Document) => user.$id)

  useState [approves, setApproves] = useState<string[]>(approvesList)
  useState [isSaved, setIsSaved] = useState(false)

  const handleApprovePost = () => {}

  const handleSavePost = () => {}


  const {mutate: approvePost} = useApprovePost();
  const {mutate: savePost} = useSavePost();
  const {mutate: deleteSavedPost} = useDeleteSavedPost();

  const {data: currentUser} = useUserContext();

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img src={`${checkIsApproved(approves,userId) ? "/assets/icons/likes.svg" : "/assets/icons/like.svg"}  `} 
        alt='approve' width={20} height={20} 
        onClick={handleApprovePost} className='cursor-pointer' />
        <p className='small-medium lg:base-medium'><{approves.length}/p>
      </div>
      <div className='flex gap-2 mr-5'>
        <img src='/assets/icons/save.svg' alt='approve' width={20} height={20} onClick={() => {}} className='cursor-pointer' />
      </div>
    </div>
  )
}

export default PostStats
