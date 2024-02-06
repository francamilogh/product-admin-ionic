import { Injectable, inject } from '@angular/core';

import{AngularFireAuth} from '@angular/fire/compat/auth';
import{getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService { // Se crea la clase  FirebaseService, para hacerl el proceso de validación 

auth = inject(AngularFireAuth); // Inyectamos AngularFireAuth

// ===================== Autenticación =========================


// ========== Acceder =============

signIn(user: User){ // función para poder accedes al servicio, se asigna a la variable user nuestra interface User
return signInWithEmailAndPassword(getAuth(), user.email, user.password)

}

}
