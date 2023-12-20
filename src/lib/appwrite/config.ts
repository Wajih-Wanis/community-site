import { Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PORJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    savedCollectionId: import.meta.env.VITE_APPWRITE_SAVED_COLLECTION_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
}

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);