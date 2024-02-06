import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})


export class FirebaseService { // Se crea la clase  FirebaseService, para hacerl el proceso de validación 

  auth = inject(AngularFireAuth); // Inyectamos AngularFireAuth
  firestore = inject(AngularFirestore); // Inyectamos AngularFireStore

  // *********************************** Autenticación ***********************************

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






  // ========== Base de Datos =============

  setDocument(path: string, data: any) { // se conecta a los servicios base de datos para crear o actualizar datos 
    return setDoc(doc(getFirestore(), path), data);
  }


  // ========== Obtener un documento =============

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();

  }





}