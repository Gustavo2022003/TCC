const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const models=require('./models');
const multer = require('multer');
const path = require('path')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
let user=models.User;
let recipe=models.Recipe;

app.post('/login',async (req,res)=>{
    let response = await user.findOne({
        where:{username: req.body.name, password: req.body.password}
    });
    if(response === null){
        res.send(JSON.stringify('error'));
    }else{
        res.send(response);
    }
});

app.post('/feed', async (req,res)=>{
    let response = await recipe.findAll();
    if(response === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(response);
    }

});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(file)
    cb(null, 'Images');
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
}).single("avatar")

app.post('/getProfilePicture'), async (req,res)=>{
    let response = user.findOne({
        attributes: ['profilePicture'],
        where: {id: req.body.userId}
    });
    console.log(response);
    if(response === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(response);
    }
}

app.post('/uploadProfilePicture',upload, async (req,res)=>{
    let response = req.file
    console.log(response)
    /*let updatepicture = await user.update({ profilePicture: response.filename },{
        where: {
          username: req.body.name
        }
      });*/
      /*console.log(updatepicture)
      if(updatepicture === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(updatepicture);
    }*/
});





let port=process.env.PORT || 3000;
app.listen(port,(req,res)=>{
    console.log('Servidor Rodando')
})








// Upload Image via Multer