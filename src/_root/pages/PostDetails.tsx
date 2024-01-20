import { useGetPostById } from '@/lib/react-query/queries'
import React from 'react'
import { useParams } from 'react-router-dom';

const PostDetails = () => {
  const {id} = useParams()
  const {data: post, isPending} = useGetPostById(id || '');
  return (
    <div>
      
    </div>
  )
}

export default PostDetails
