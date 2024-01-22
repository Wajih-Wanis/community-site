import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { error } from "console";

// AUTH

export async function createUserAccount(user: INewUser) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(user.name);
  
      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      });
  
      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
  }) {
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        user,
      );
  
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
  

export async function signInAccount(user: { email: string; password: string }) {
    try {
      const session = await account.createEmailSession(user.email, user.password);
      return session;
    } catch (error) {
      console.log(error);
    }
  }
  
export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();

      if (!currentAccount) throw Error;
      
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );
      if (!currentUser) throw Error;
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export async function signOutAccount(){
  try{
    const session = await account.deleteSession("current");
    return session
  }

  catch(error){
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    //const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        title: post.title,
        article: post.article,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        topic: post.topic,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}


export async function getRecentPosts()  {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )
  if(!posts) throw Error;

  return posts
}

export async function approvePost(postId: string, approveArray: string[]){
  try{
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        approves: approveArray
      }
    )
    if (!updatedPost) throw error

    return updatedPost  
  }catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string){
  try{
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savedCollectionId,
      ID.unique(),
      {
        user : userId,
        post: postId,
      }
    )
    if (!updatedPost) throw error

    return updatedPost  
  }catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string){
  try{
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savedCollectionId,
      savedRecordId,
    )
    if (!statusCode) throw error

    return {status: 'Ok'}
  }catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return post
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    } 

    if (hasFileToUpdate){
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error; 
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
    }
    
   
   
    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        article: post.article,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    if (!updatePost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}


export async function deletePost(postId: string, imageId: string){
  if (!postId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
  } catch (error) {
    
  }
}

export async function getInfinitePost({pageParam} : {pageParam: number}) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    )
    if (!posts) throw Error;
    return posts    
  } catch (error) {
    console.log(error)
  }
}