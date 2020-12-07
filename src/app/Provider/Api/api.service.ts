import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  parseData: any;
  public walkthrough = new BehaviorSubject([]);
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private http: HttpClient
  ) {}

  doLogin(data) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithEmailAndPassword(data.email, data.password)
        .then((result: any) => {
          const responseData = [true, result];
          resolve(responseData);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  doRegister(data) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((res: any) => {
          data.password = '';
          this.addDocument('users', res.user.uid, data)
            .then(res1 => {
              resolve([true, res]);
              localStorage.setItem('userKey', res.user.uid);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  doForgotPassword(email) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .sendPasswordResetEmail(email)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  addDocument(collectionName, docName, data) {
    return this.afs
      .collection(collectionName)
      .doc(docName)
      .set(data);
  }
  getDocumnet(url) {
    return this.afs.doc(url).valueChanges();
  }
  updateDocument(url, data) {
    return this.afs.doc(url).update(data);
  }
  getCollection(collectionName) {
    return this.afs
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  addCollection(collectionName, data) {
    return this.afs.collection(collectionName).add(data);
  }

  getQueryCollection(collectionName, fieldName, operation, value) {
    return this.afs
      .collection(collectionName, ref => ref.where(fieldName, operation, value))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getUserId() {
    return new Promise((resolve, reject) => {
      this.afAuth.user.subscribe(
        (res: any) => {
          resolve(res.uid);
        },
        err => {
          reject(err);
        }
      );
    });
  }

  getCurrency() {
    return this.http.get('https://api.exchangerate-api.com/v4/latest/USD');
  }
}
