import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      } as User);
    });
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}; 