const http = require('http');
const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const models=require('./models');
const multer = require('multer');
const path = require('path');
var Sequelize = require('sequelize');
const { Op, where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const db = require('./models/index')



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
let user=models.User;
let recipe=models.Recipe;
let ingrediente = models.Ingrediente

let port=process.env.PORT || 3000;

const host = '192.168.0.108';



const server = http.createServer(app);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

//Check Login
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

//Register
app.post('/register',async (req,res)=>{
    let response = await user.findOne({
        where: {[Op.or]: [
            {username: req.body.username},{email: req.body.email}
        ]}
    });
    console.log(response)
    if(response === null){
        res.send(JSON.stringify('null'));
        let register = await user.create({completeName: req.body.fullname, username: req.body.username,
        email: req.body.email, password: req.body.password })
        console.log('Usuário cadastrado com ID: ', register.id)
    }else{ 
        if(response.dataValues.username == req.body.username){
            res.send(JSON.stringify('UserError'));
        }else if(response.dataValues.email == req.body.email){
            res.send(JSON.stringify('EmailError'));
        }else{
            res.send(JSON.stringify('DiferentError'));
        }
    }
});

//Recipes feed
app.post('/feed', async (req,res)=>{
    let response = await recipe.findAll({order:[Sequelize.literal('RAND()')]});
    if(response.length === 0){
        res.send(JSON.stringify('FeedError'));
    }else{
        res.send(response);
    }

});

//GetIngredients
app.post('/ingredients', async (req,res)=>{
    let response = await ingrediente.findAll({order:[Sequelize.literal('ingredienteName ASC')]});
    if(response.length === 0){
        res.send(JSON.stringify('IngredientsError'));
    }else{
        res.send(response);
    }

});

//Store Path Multer
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'Images');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

//Create Image at server
var upload = multer({
  storage: storage
}).single('photo')

//Get Profile Picture
app.post('/getAvatar/:user', async (req,res)=>{
    let response =await user.findAll({
        attributes: ['profilePicture'],
        where: {id: req.params.user}
    });
    if(response === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(response);
    }
});

//Set Images path public
app.use("/Images",express.static("Images"), ()=>{
    console.log('Vou retornar a foto pera ae')
});

//Upload profile picture
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

//Get receita from specific profile
app.post('/recipe/:id', async (req,res)=>{
    let response = await recipe.findAll({where: {UserId: req.params.id}});
    if(response === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(response);
    }

});


// SELECT * FROM `receitatemingredientes` WHERE (`idIngrediente`,`quantidade`) IN ((3,4),(4,5),(2,2),(3,1),(1,1));
//Talvez usar or e contar a compatibilidade/ vezes que receita apareceu, melhor solução por enquanto
//PENSAR EM ALGUM JEITO DE ORDENAR POR MAIOR COMPATIBILIDADE DA CONSULTA
//PARA EXIBIR USAR DISTINCT SELECT PRO ID DA RECEITA, SE NÃO IRÁ REPETIR RECEITA

/* SQL QUERY WORKING -> SELECT idReceita
FROM receitatemingredientes
where ((idIngrediente = 1 and quantidade > 0 <= 5) or (idIngrediente = 2 and quantidade > 0 <= 5)
or (idIngrediente = 3 and quantidade > 0 <= 5) or (idIngrediente = 4 and quantidade > 0 <=5)
or (idIngrediente = 5 and quantidade > 0 <= 5))
GROUP BY idReceita
ORDER BY COUNT(idReceita) desc;
*/

//Search Recipe
app.post('/searchRecipe', async (req,res) => {
    let array = req.body.itens;
    if (array.length < 10){
        while(array.length < 10){
            array.push(0);
        }
    }
    const recipes = await db.sequelize.query("SELECT `idReceita` FROM `receitatemingredientes` where ((`idIngrediente` = " + array[0] + " and `quantidade` > 0 <= "+ array[1] +") or (`idIngrediente` = " + 
    array[2] + " and `quantidade` > 0 <=" + array[3] +") or (`idIngrediente` =" + array[4] + " and `quantidade` > 0 <= "+ array[5] +") or (`idIngrediente` ="+ array[6]+ " and `quantidade` > 0 <=" + 
    array[7] + ") or (`idIngrediente` =" +array[8]+ " and quantidade > 0 <=" + array[9] +"))GROUP BY idReceita ORDER BY COUNT(idReceita) desc;", { raw: false, type: QueryTypes.SELECT });
    if (recipes.length === 0){
        res.send(JSON.stringify('NoFound'))
    }
    else{
        res.send(recipes)
    }
    //res.send(recipes)
});

app.post('/searchedRecipes', async (req,res) => {
    let array = req.body.list
    console.log(array)
    let response = await recipe.findAll({where: { id: array},
        order: Sequelize.literal("FIELD(Recipe.id,"+array.join(',')+")")});

    if(response.length === 0){
        res.send(JSON.stringify('SearchError'));
    }else{
        res.send(response);
    }
})








