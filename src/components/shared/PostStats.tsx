import { useApprovePost, useDeleteSavedPost, useGetCurrentUser, useSavePost } from '@/lib/react-query/queries';
import { checkIsApproved} from '@/lib/utils';
import { Models } from 'appwrite';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type PostStatsProps = {
    post?: Models.Document;
    userId: String;
}

const PostStats = ({post, userId}: PostStatsProps) => {
  const approvesList = post.approves.map((user: Models.Document) => user.$id)
  
  useState [approves, setApproves] = useState<string[]>(approvesList)
  useState [isSaved, setIsSaved] = useState(false)

  const handleApprovePost = (e:React.MouseEvent) => {
    e.stopPropagation();

    let newApproves = [...approves];
    const hasApproved = newApproves.includes(userId)

    if(hasApproved){
      newApproves = newApproves.filter((id) => id !== userId)
    }else{
      newApproves.push(userId);
    }

    setApproves(newApproves);
    approvePost({postId: post?.$id,approvesArray: newApproves})
  }

  const handleSavePost = (e:React.MouseEvent) => {
    e.stopPropagation();

    if(savedPostRecord){
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    }
    else{
      savePost({postId: post?.$id || '', userId})
      setIsSaved(true);
    }
  }


  const {mutate: approvePost} = useApprovePost();
  const {mutate: savePost, isPending: isSavingPost } = useSavePost();
  const {mutate: deleteSavedPost, isPending: isDeletingSaved} = useDeleteSavedPost();

  const {data: currentUser} = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img src={checkIsApproved(approves, userId) ? "/assets/icons/likes.svg" : "/assets/icons/like.svg"}  
        alt='approve' width={20} height={20} 
        onClick={handleApprovePost} className='cursor-pointer' />
        <p className='small-medium lg:base-medium'>{approves.length}</p>
      </div>
      <div className='flex gap-2 mr-5'>
      {isSavingPost || isDeletingSaved ? <Loader /> : <img src={isSaved ? 'assets/icons/saved.svg' : '/assets/icons/save.svg'}   alt='save' 
        width={20} height={20} onClick={handleSavePost} className='cursor-pointer' /> }
      </div>
    </div>
  )
}

export default PostStats
