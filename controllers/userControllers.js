const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const {validationResult} = require("express-validator");

let usuariosJson = fs.readFileSync(path.resolve(__dirname, '../database/usuarios.json'), 'utf-8');
let dbDirectory = path.resolve(__dirname, '../database/usuarios.json')

usuariosJson == "" ?
    fs.writeFileSync(dbDirectory, JSON.stringify(usuariosJson = [])) :
    usuariosJson = JSON.parse(fs.readFileSync(dbDirectory), 'utf-8');

let userController = {
    perfil : (req, res, next) => {
        let idUrl = req.params.id

        let usuarioBuscado = usuariosJson.find( usuario => usuario.id == idUrl );

        res.render('users/perfil', { user : usuarioBuscado, userLogged : req.session.usuarioLogueado });
    },
    create : (req, res, next) =>{
      res.render("users/register");
    },
    store : (req, res, next) =>{
      // Enviar errores express-validator
      let errores = validationResult(req);
      if (!errores.isEmpty()){
        return res.render("users/register", {errors : errores.errors})
      }

      // ID maximo para reemplazar
      let idMax = 0;

      //For para buscar el ID mas alto, y reemplazar idMax por el ID mas alto
      for(let i = 0 ; i < usuariosJson.length ; i++){
        if(usuariosJson[i].id > idMax){
          idMax = usuariosJson[i].id;
        }
      }
    

      //Sumarle 1 al ID mas alto, para crear un producto nuevo
      idMax = idMax + 1;

      //Hacer objeto completo, con el ID primero para mas comodidad
      let usuarioNuevo = {
        id : idMax,
        nombre : req.body.nombre,
        apellido: req.body.apellido,
        email : req.body.email,
        contrasenia : bcrypt.hashSync(req.body.contrasenia,10),
<<<<<<< HEAD
        admin: false,
        profesor: false
=======
        redes : {
          linkedin : "linkedin",
          twitter : "twitter",
          instagram : "instagram",
          facebook : "facebook"
        },
        admin: false,
>>>>>>> c400a3a23160e628e8ea794213f7d039ddb18b34
      }

      //Sumar el usuario al array
      usuariosJson.push(usuarioNuevo);
      
      //Sobreescribe el archivo
      fs.writeFileSync(dbDirectory, JSON.stringify(usuariosJson));

      //Te envia a la vista una vez el form fue completado
      res.redirect("/home");
    },
    loginRender : (req, res, next) => {
      res.render('users/login');
    },
    loginIniciar : (req, res, next) => {
      // Enviar errores express-validator
      let errores = validationResult(req);

      if (!errores.isEmpty()){
        return res.render("users/login", {errors : errores.errors})
      }

      let buscarUsuario = usuariosJson.find(usuario => usuario.email == req.body.email);

      req.session.usuarioLogueado = buscarUsuario;

      if(req.body.recordameLogin != undefined){
        res.cookie('recordame', buscarUsuario.email,{ maxAge: 1000*60*60*24*365*3 })
      }
      res.redirect("/home")
    } 
}

module.exports = userController;