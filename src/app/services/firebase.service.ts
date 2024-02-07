import { Injectable, inject } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService { // Se crea la clase  FirebaseService, para hacer el proceso de validación 

  // Inyectamos AngularFireAuth, AngularFireStore, UtilsService)
  auth = inject(AngularFireAuth); 
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService); 


  // *********************************** Autenticación ***********************************

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



  // ========== Base de Datos =============

  setDocument(path: string, data: any) { // se conecta a los servicios base de datos para crear o actualizar datos 
    return setDoc(doc(getFirestore(), path), data);
  }


  // ========== Obtener un documento =============

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();

  }





}