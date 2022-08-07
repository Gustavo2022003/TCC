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

const storage = multer.diskStorage({
    destination: "Images",
    filename: (req, file, cb) =>{
        cb(null, Date.now()+ path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
}).single('Picture')

app.post('/upload',upload, async (req,res)=>{
    let response = req.body
    console.log('me cutucaram')
    console.log (response)
});





let port=process.env.PORT || 3000;
app.listen(port,(req,res)=>{
    console.log('Servidor Rodando')
})








// Upload Image via Multer