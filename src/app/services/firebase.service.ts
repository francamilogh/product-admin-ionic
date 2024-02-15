import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";


@Injectable({
  providedIn: 'root'
})


export class FirebaseService { // Se crea la clase  FirebaseService, para hacer el proceso de validación 
  // Inyectamos AngularFireAuth, AngularFireStore, AngularFireStorage, UtilsService)
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);


  // :::::::::::::::::::::::::::::::::::: AUTENTICACIÓN ::::::::::::::::::::::::::::::::::::

  // ========== Proteción navegación =============
  getAuth() {
    return getAuth();

  }

  // ========== Acceder =============
  signIn(user: User) { // función para poder accedes al servicio, se asigna a la variable user nuestra interface User
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // ========== Crear Usuario =============
  signUp(user: User) { // función para poder accedes al servicio, y crear usuario con interface User
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // ========== Actualiza Usuario =============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // ========== Recuperar contraseña con envío al email =============
  sendRecoveryEmail(email: string) { // se obtiene email para ser enviado para recuperar contraseña
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ========== Cerrar sesión =============
  signOut() {
    getAuth().signOut(); // Cierra el getAuth
    localStorage.removeItem('user'); // remueve usuario

  }


  // :::::::::::::::::::::::::::::::::::: BASE DE DATOS ::::::::::::::::::::::::::::::::::::

  // ========== Obtener documentos de una colección =============

  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' }); // Trae el id del producto almacenado en la colleción
  }

  // ========== Setear un documento =============
  setDocument(path: string, data: any) { // se conecta a los servicios base de datos para crear datos
    return setDoc(doc(getFirestore(), path), data);
  }

  // ========== Actualiza un documento =============
  updateDocument(path: string, data: any) { // se conecta a los servicios base de datos para actualizar datos
    return updateDoc(doc(getFirestore(), path), data);
  }

  // ========== Eliminar un documento =============
  deleteDocument(path: string) { // se conecta a los servicios base de datos para eliminar datos
    return deleteDoc(doc(getFirestore(), path));
  }

  // ========== Obtener un documento =============
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // ========== Agregar un documento =============
  addDocument(path: string, data: any) { // se conecta a los servicios base de datos para crear o actualizar datos de la collección acá se asigna un id automático al documento
    return addDoc(collection(getFirestore(), path), data);
  }


  // :::::::::::::::::::::::::::::::::::: ALMACENAMIENTO ::::::::::::::::::::::::::::::::::::

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => { // se sube la imagen al storage
      return getDownloadURL(ref(getStorage(), path)) // se obtiene la url de la imagen para guardarla en la base de datos
    })
  }

  // ========== Obtener ruta de la imagen con la URL =============
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath

  }

   // ========== Eliminar archivo =============
   async deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path)); // se le pasa el path del producto a

  } 


}