const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const models=require('./models');
const multer = require('multer');
const path = require('path');


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
    console.log(response)
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
    cb(null, 'Images');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
}).single('photo')

app.post('/getAvatar/:user', async (req,res)=>{
    let response =await user.findAll({
        attributes: ['profilePicture'],
        where: {id: req.params.user}
    });
    console.log(response);
    if(response === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(response);
    }
});

app.post('/uploadPicture/:userId',upload, async (req,res)=>{
    let userid = req.params.userId
    let response = req.file
    console.log(response)
    /*let updatepicture = await user.update({ profilePicture: response },{
        where: {
            id: userid
        }
    });
    console.log(updatepicture)
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