
import { db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Collection Names
const HOSTELS = 'hostels';
const ROOMS = 'rooms';
const BOOKINGS = 'bookings';
const STUDENTS = 'students';
const ADMINS = 'admins';
const OWNERS = 'owners';
const BANLIST = 'banlist';

// Ban Logic
export const checkIfBanned = async (email) => {
    const q = query(collection(db, BANLIST), where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

export const banStudent = async (studentId, email) => {
    // Add to banlist
    await addDoc(collection(db, BANLIST), {
        email,
        bannedAt: serverTimestamp()
    });
    // Delete student record
    const docRef = doc(db, STUDENTS, studentId);
    return await deleteDoc(docRef);
};

// Common functions
export const getAllDocuments = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addDocument = async (collectionName, data) => {
    return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
    });
};

export const updateDocument = async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    return await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
};

// Specific functions
export const getHostels = () => getAllDocuments(HOSTELS);
export const getRooms = () => getAllDocuments(ROOMS);
export const getBookings = () => getAllDocuments(BOOKINGS);
export const getStudents = () => getAllDocuments(STUDENTS);
export const getOwners = () => getAllDocuments(OWNERS);

export const getHostelsByOwner = async (ownerId) => {
    const q = query(collection(db, HOSTELS), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRoomsByOwner = async (ownerId) => {
    const hostels = await getHostelsByOwner(ownerId);
    const hostelIds = hostels.map(h => h.id);
    if (hostelIds.length === 0) return [];

    const q = query(collection(db, ROOMS), where("hostelId", "in", hostelIds));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBookingsByOwner = async (ownerId) => {
    const q = query(collection(db, BOOKINGS), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRoomsByHostel = async (hostelId) => {
    const q = query(collection(db, ROOMS), where("hostelId", "==", hostelId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteBookingRecord = async (bookingId) => {
    const bookingRef = doc(db, BOOKINGS, bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data();

        if (bookingData.roomId) {
            const roomRef = doc(db, ROOMS, bookingData.roomId);
            const roomSnap = await getDoc(roomRef);

            if (roomSnap.exists()) {
                const roomData = roomSnap.data();
                const capacity = parseInt(roomData.capacity || 1);
                const currentOcc = parseInt(roomData.currentOccupancy || 0);

                let nextOcc = currentOcc - 1;
                let nextAvailable = roomData.available;

                if (nextOcc < 0) {
                    // We were at 0 current occupancy, meaning we need to pull back from the 'filled' rooms
                    nextAvailable = (roomData.available || 0) + 1;
                    nextOcc = capacity - 1;
                }

                await updateDoc(roomRef, {
                    available: nextAvailable,
                    currentOccupancy: nextOcc
                });
            }
        }
    }

    return await deleteDoc(bookingRef);
};

export const addBooking = async (bookingData) => {
    // 1. Get current room data
    const roomRef = doc(db, ROOMS, bookingData.roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error("Room configuration not found");
    }

    const roomData = roomSnap.data();
    const capacity = parseInt(roomData.capacity || 1);
    const currentOcc = parseInt(roomData.currentOccupancy || 0);

    // 2. Check if we have any rooms to fill
    if (roomData.available <= 0) {
        throw new Error("Sorry, this room type is completely full!");
    }

    // 3. Update occupancy logic
    let nextOcc = currentOcc + 1;
    let nextAvailable = roomData.available;

    if (nextOcc >= capacity) {
        // Room is now full! Decrement available rooms and reset occupancy counter
        nextAvailable = roomData.available - 1;
        nextOcc = 0;
    }

    await updateDoc(roomRef, {
        available: nextAvailable,
        currentOccupancy: nextOcc
    });

    // 4. Create the booking document
    return addDocument(BOOKINGS, bookingData);
};
export const addHostel = (hostelData) => addDocument(HOSTELS, hostelData);
export const addRoom = (roomData) => addDocument(ROOMS, roomData);

export const studentSignup = async (studentData) => {
    // Check if banned
    const isBanned = await checkIfBanned(studentData.email);
    if (isBanned) {
        throw new Error("This account has been suspended by the administrator.");
    }
    // Check if email exists
    const q = query(collection(db, STUDENTS), where("email", "==", studentData.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("Email already exists");
    }
    const docRef = await addDoc(collection(db, STUDENTS), studentData);
    return { id: docRef.id, ...studentData };
};

export const studentLogin = async (email, password) => {
    const isBanned = await checkIfBanned(email);
    if (isBanned) {
        throw new Error("Your access has been revoked by the administrator.");
    }
    const q = query(collection(db, STUDENTS), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
};

export const adminLogin = async (email, password) => {
    const q = query(collection(db, ADMINS), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data(), role: 'admin' };
};

export const ownerSignup = async (ownerData) => {
    const q = query(collection(db, OWNERS), where("email", "==", ownerData.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("Email already exists");
    }
    const docRef = await addDoc(collection(db, OWNERS), ownerData);
    return { id: docRef.id, ...ownerData, role: 'owner' };
};

export const ownerLogin = async (email, password) => {
    const q = query(collection(db, OWNERS), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data(), role: 'owner' };
};

export const getStudentBookings = async (studentId) => {
    const q = query(collection(db, BOOKINGS), where("studentId", "==", studentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ratings Logic
export const submitRating = async (hostelId, ratingData) => {
    const ratingsRef = collection(db, 'ratings');
    const q = query(ratingsRef, where("hostelId", "==", hostelId), where("studentId", "==", ratingData.studentId));
    const existing = await getDocs(q);

    if (!existing.empty) {
        const docRef = doc(db, 'ratings', existing.docs[0].id);
        await updateDoc(docRef, ratingData);
    } else {
        await addDoc(ratingsRef, { ...ratingData, hostelId, createdAt: serverTimestamp() });
    }

    // Update Hostel Average
    const allRatingsQ = query(ratingsRef, where("hostelId", "==", hostelId));
    const allRatings = await getDocs(allRatingsQ);
    const ratings = allRatings.docs.map(d => d.data().rating);
    const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

    const hostelRef = doc(db, HOSTELS, hostelId);
    await updateDoc(hostelRef, {
        rating: parseFloat(avg),
        ratingCount: ratings.length
    });

    return avg;
};

export const getHostelRatings = async (hostelId) => {
    const q = query(collection(db, 'ratings'), where("hostelId", "==", hostelId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const initFirebase = async () => {
    // Seed admin if not exists
    const q = query(collection(db, ADMINS), where("email", "==", "tharunsasupalli@gmail.com"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        await addDoc(collection(db, ADMINS), {
            email: "tharunsasupalli@gmail.com",
            password: "123456",
            role: "admin",
            name: "Admin"
        });
        console.log("Admin account seeded in Firebase");
    }
};

export const googleLogin = async (role = 'student') => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (role !== 'admin') {
            const isBanned = await checkIfBanned(user.email);
            if (isBanned) {
                throw new Error("Access Denied: This account has been suspended.");
            }
        }

        // Check if user exists in our Firestore collection
        const collectionName = role === 'admin' ? ADMINS : STUDENTS;
        const q = query(collection(db, collectionName), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            if (role === 'admin') {
                throw new Error("You do not have administrative access.");
            } else {
                // For students, create profile if doesn't exist
                const newStudent = {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp()
                };
                const docRef = await addDoc(collection(db, STUDENTS), newStudent);
                return { id: docRef.id, ...newStudent };
            }
        }

        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data(), role: role };
    } catch (error) {
        console.error("Google Login Error:", error);
        throw error;
    }
};
