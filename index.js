"user strict"

const express = require('express');
const app = express();
const path = require('path');

const bodyParse = require('body-parser');
const admin = require('firebase-admin');
const permission = require("./secret.json");
const { response } = require('express');
app.set('port', process.env.port || 8080) 

admin.initializeApp({

    credential: admin.credential.cert(permission)
})

const firestore = admin.firestore();
const auth = admin.auth();

app.use(bodyParse.json());


app.get('/', (req, res, next) =>{

})
app.get('/user', (req, res, next) =>{
    res.send(users)
})

// getting users frome your database
 app.get('/user/:id', (req, res, next) =>{
    const id = req.params.id;
    if(!id){
      res.status(500).send("user is not defined" )
    }else{
      firestore.collection('newUsers').doc(id).get().then(user =>{
        res.status(200).send({
          id: user.id,
          ...user.data()
        })
      })
    }
  })


//Edit the Object that already exist in your database

app.put('/user/:id', (req, res, next) =>{
    const id = req.params.id;
    if(!id && !user){
      res.status(500).send("user is not defined")
    }else{
      firestore.collection('newUsers').doc(id).update(users).then(response =>{
        res.status(200).send('user has been updated')
      })
    }
  })


  //posting new users into your database//
app.post("/register", (req, res, next) => {
  const user = req.body;
  auth.createUser(user).then((userdata) => {
    firestore
      .collection("newUsers")
      .doc("" + userdata.uid)
      .set({
        name: user.name,
        displayName: user.username,
        email: user.email,
        surname: user.surname,
        age: user.age,
        gender: user.gender,
        password: user.password,
      })
      .then(() => {
        res.status(200).send(user);
      })
      .catch((error) => res.status(500).send(error.message));
  });
});

  //delete user from authentication and firebase

  app.delete('/delete/:id', (req,res, next) =>{
    id = req.params.id;
    auth.deleteUser(id).then((userdata) => {
      firestore.collection("newUsers").doc(id).delete().then(response =>{
        res.status(200).send('user has been deleted');
      }).catch(error => {
          res.status(500).send(error.message);
        })
    })
  })


app.listen(app.get('port'), server =>{
    console.info(`Server listen on port ${app.get('port')}`);
})