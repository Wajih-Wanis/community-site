import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import { PostValidation } from '@/lib/validation'

const PostForm = ({ post }) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: post ? post?.title : "Default Title",
      file: [],
      location: post ? post?.location : ''
    },

  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof PostValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="Title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Title</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea' placeholder="Write your post title..." {...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
            
          )}
          />
        <FormField
          control={form.control}
          name="Topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Choose the topic" {...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="article"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Article</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea' placeholder="Write your post content..." {...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
            
          )}
          />
          <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add image</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
            
          )}
          />
          <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add location</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message'/>
            </FormItem>
            
          )}
          />
          <div className='flex gap-4 items-center justify-end'>
          <Button type="button" className='shad-button_dark_4'>Cancel</Button>
          <Button type="submit" className='shad-button_primary whitespace-nowrap'>Submit</Button>
          </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default PostForm
