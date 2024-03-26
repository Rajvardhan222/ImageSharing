const conf = {
    URL: String(import.meta.env.VITE_APPWRITE_URL),
    PRODUCT_ID: String(import.meta.env.VITE_APPWRITE_PRODUCT_ID),
    DATABASE_ID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    SAVES : String(import.meta.env.VITE_APPWRITE_SAVES_COLLECTION),
    POSTS : String(import.meta.env.VITE_APPWRITE_POSTS_COLLECTION),
    USER :  String(import.meta.env.VITE_APPWRITE_USER_COLLECTION),
    BUCKET_ID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
   
}
export default conf