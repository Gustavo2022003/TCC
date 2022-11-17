const http = require('http');
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

let port=process.env.PORT || 3000;

const host = '192.168.0.108';



const server = http.createServer(app);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


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

app.use("/Images",express.static("Images"), ()=>{
    console.log('Vou retornar a foto pera ae')
});

app.post('/uploadPicture/:userId',upload, async (req,res)=>{
    let userid = req.params.userId
    let response = JSON.stringify(req.file.filename)
    console.log(response)
    let updatepicture = await user.update({ profilePicture: response },{
        where: {
            id: userid
        }
    });
    console.log(updatepicture)
    if(updatepicture === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(updatepicture);
    }
});














// Upload Image via Multer