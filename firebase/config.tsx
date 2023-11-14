// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6Cz9LRVSkEfU8SEWiuqqXp-zKoS5XlIM",
  authDomain: "univalle-files.firebaseapp.com",
  projectId: "univalle-files",
  storageBucket: "univalle-files.appspot.com",
  messagingSenderId: "979529637918",
  appId: "1:979529637918:web:ebc148530e7f8b9ace4e0f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file: any, route: string) {
  const storageRef = ref(storage, route + v4());
  await uploadBytes(storageRef, file);
  const url = getDownloadURL(storageRef);
  return url;
}
