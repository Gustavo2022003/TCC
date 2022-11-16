const http = require('http');
const express= require('express');
const cors= require('cors');
const bodyParser = require('body-parser');
const models=require('./models');
const multer = require('multer');
const path = require('path');
var Sequelize = require('sequelize');
const { Op, where, or } = require("sequelize");
const { QueryTypes } = require('sequelize');
const db = require('./models/index')

//Pc do chris no wifi do avalone 192.168.43.92

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
let user=models.User;
let recipe=models.Recipe;
let ingrediente = models.Ingrediente
let follow = models.UserSegueUser
let like = models.userLikeRecipe
let port=process.env.PORT || 3000;

const host = '192.168.43.92';



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
    if(response === null){
        let register = await user.create({completeName: req.body.fullname, username: req.body.username,
        email: req.body.email, password: req.body.password, profilePicture: '17bcb88b-4881-4d42-bf97-2b8793c16a65.png' })
        res.send(JSON.stringify("Registered"))
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
app.post('/feed/:page', async (req,res)=>{
    page = Number(req.params.page) * 5
    let response = await recipe.findAll({order: [[req.body.field, req.body.order]], include: [{model: user, required: true}], limit: 5, offset: page});
    if(response.length == null){
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

app.post('/user/:userId', async (req,res)=>{
    let response = await user.findOne({ where:{id: req.params.userId}})
    if (response === null){
        res.send(JSON.stringify('NoProfile'))
    }else{
        res.send(response)
    }
})


//Store Path Multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, 'Images');
},
filename: function(req, file, cb) {
    cb(null, file.originalname);
}});

//Create Image at server
var upload = multer({
    storage: storage
}).single('photo')

app.post('/UploadImg', upload, async(req, res)=>{
    let response = JSON.stringify(req.file.filename)
    res.send(response)
})

//Get all the profile
app.post('/getProfile/:idUser', async(req,res)=>{
    let response = await user.findOne({
        where: {id: req.params.idUser}
    })
    if (response != null){
        res.send(response)
    }
})

//Update Profile
app.post('/updateProfile/:idUser', async(req,res)=>{
    let response = await user.findOne({where: {username: req.body.username}})
    if (response == null || response.id == req.params.idUser){
        let update = await user.update({completeName: req.body.completeName, username: req.body.username, profilePicture: req.body.profilePicture},{where: {id: req.params.idUser}})
        res.send(JSON.stringify('Updated'))
    }else{
        res.send(JSON.stringify('UsernameExist'))
    }
})

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
});

//Upload profile picture
app.post('/uploadPicture/:userId',upload, async (req,res)=>{
    let userid = req.params.userId
    let response = JSON.stringify(req.file.filename)
    let updatepicture = await user.update({ profilePicture: response },{
        where: {
            id: userid
        }
    });
    if(updatepicture === null){
        res.send(JSON.stringify('Deu Erro'));
    }else{
        res.send(updatepicture);
    }
});

//Get receita from specific profile
app.post('/recipe/:id', async (req,res)=>{
    let response = await recipe.findAll({where: {UserId: req.params.id}, order:[Sequelize.literal('RAND()')], include: [{model: user, required: true}]});
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

//Search User by name or username
app.post('/searchUser/:text',async(req,res)=>{
    let query = '%'+req.params.text+'%'
    let response = await user.findAll({ where: {[Op.or]:[{username: {[Op.like]: query}}, {completeName: {[Op.like]: query}}]}})
    if (response.length !== 0){
        res.send(response)
    }else{
        res.send(JSON.stringify('noFound'))
    }
})

//Search Recipe by Recipe name or category
app.post('/searchRecipes/:text', async(req,res)=>{
    let query = '%'+req.params.text+'%'
    let response = await recipe.findAll({ where: {[Op.or]:[{recipeName: {[Op.like]: query}}, {category: {[Op.like]: query}}]},include: [{model: user, required: true}] })
    if (response.length !== 0){
        res.send(response)
    }else{
        res.send(JSON.stringify('noFound'))
    }
})






//Search Recipe
app.post('/searchRecipe', async (req,res) => {
    let array = req.body.itens;
    if (array.length < 10){
        while(array.length < 10){
            array.push(0);
        }
    }
    const recipes = await db.sequelize.query("SELECT `idReceita` FROM `receitatemingredientes` where ((`idIngrediente` = " + array[0] + " and `quantidade` <= "+ array[1] +") or (`idIngrediente` = " + 
    array[2] + " and `quantidade` <=" + array[3] +") or (`idIngrediente` =" + array[4] + " and `quantidade` <= "+ array[5] +") or (`idIngrediente` ="+ array[6]+ " and `quantidade` <=" + 
    array[7] + ") or (`idIngrediente` =" +array[8]+ " and quantidade <=" + array[9] +"))GROUP BY idReceita ORDER BY COUNT(idReceita) desc;", { raw: false, type: QueryTypes.SELECT });
    if (recipes.length === 0){
        res.send(JSON.stringify('NoFound'))
    }
    else{
        res.send(recipes)
    }
    //res.send(recipes)
});
//
app.post('/searchedRecipes', async (req,res) => {
    let array = req.body.list
    let response = await recipe.findAll({where: { id: array},
        order: Sequelize.literal("FIELD(Recipe.id,"+array.join(',')+")"),
        include: [{model: user, required: true}]});

    if(response.length === 0){
        res.send(JSON.stringify('SearchError'));
    }else{
        res.send(response);
    }
})

//Ingredients from Current Recipe
app.post("/recipeIngrediente/:idRecipe", async (req, res)=> {
    let response = await db.sequelize.query("SELECT i.tipo, r.idIngrediente, r.quantidade, i.ingredienteName from receitatemingredientes r INNER JOIN ingredientes i ON r.idIngrediente = i.id and idReceita ="+req.params.idRecipe);
    if (response.length === 0){
        res.send(JSON.stringify('Error'))
    }else{
        res.send(response[0])
    }
})


//Creating Recipe
app.post("/CreateRecipe/:idUser", async (req, res)=>{
    let array = req.body.ArrayIngredient;
    
    let pictureRecipe;
    req.body.pictureReceita != null || undefined ? pictureRecipe = req.body.pictureReceita : pictureRecipe = 'Image_not_available.png'
    //Testing sending to database
    let response = await recipe.create({recipeName: req.body.recipeName, desc: req.body.desc, pictureReceita: pictureRecipe,
        category: req.body.category, ModoPreparo: req.body.ModoPreparo, userId: req.params.idUser})
    let recipeId = await response.id

    //Group every 2 itens
    let arrayTeste = []
    for(var i = 0; i < array.length; i++){
        b = i++ //incremento aqui e na definição do for
        arrayTeste.push("("+recipeId+","+ array[b] +","+ array[i] +")") 
    }

    //Map new array
    let finalInsert = arrayTeste.map(item => {return item})
    let query = 'Insert into receitatemingredientes (idReceita, idIngrediente, quantidade) values '+finalInsert

    //Sending to the database ingredients from the recipe
    let response2 = await db.sequelize.query(query)
    res.send(JSON.stringify("RecipeCreated"))
    
    
})

//Delte Recipes
app.post('/deleteRecipe/:idRecipe', async (req, res)=>{
    let response = await recipe.destroy({where: {id: req.params.idRecipe}})
    if (response != null){
        res.send(JSON.stringify('Deleted'))
    }
})

app.post('/follows', async (req, res) =>{
    let response = await follow.create({idUserFollows: req.body.userFollow, idUserFollowed: req.body.userFollowed})
    if (response != null){
        res.send(JSON.stringify('true'))
    }
})  

app.post('/unfollow', async (req, res) =>{
    let response = await follow.destroy({where: {idUserFollows: req.body.userFollow, idUserFollowed: req.body.userFollowed}})
    if (response != null){
        res.send(JSON.stringify('true'))
    }
})

app.post('/checkFollow', async (req, res) =>{
    let response = await follow.findOne({where: {idUserFollows: req.body.userFollow, idUserFollowed: req.body.userFollowed}})
    if (response == null){
        res.send(JSON.stringify('false'))
    }else{
        res.send(JSON.stringify('true'))
    }
})

app.post('/followInfoOther', async(req, res) =>{
    let publicacoes = await db.sequelize.query(`SELECT count(id) as publicacoes from recipes where userId = ${req.body.userFollowed}`) 
    let seguidores = await db.sequelize.query(`SELECT count(idUserFollowed) AS seguidores from usersegueusers where idUserFollowed = ${req.body.userFollowed}`)
    let seguindo = await db.sequelize.query(`SELECT count(idUserFollows) AS seguindo from usersegueusers where idUserFollows = ${req.body.userFollowed}`)
    res.send({
        publicacoes: publicacoes[0][0].publicacoes,
        seguindo: seguindo[0][0].seguindo,
        seguidores: seguidores[0][0].seguidores
    })
})

app.post('/followInfo', async(req, res) =>{
    let publicacoes = await db.sequelize.query(`SELECT count(id) as publicacoes from recipes where userId = ${req.body.user}`) 
    let seguidores = await db.sequelize.query(`SELECT count(idUserFollowed) AS seguidores from usersegueusers where idUserFollowed = ${req.body.user}`)
    let seguindo = await db.sequelize.query(`SELECT count(idUserFollows) AS seguindo from usersegueusers where idUserFollows = ${req.body.user}`)
    res.send({
        publicacoes: publicacoes[0][0].publicacoes,
        seguindo: seguindo[0][0].seguindo,
        seguidores: seguidores[0][0].seguidores
    })
})

app.post('/getLike/:idRecipe', async(req, res) =>{
    let qntLike = await db.sequelize.query(`SELECT count(id) as likes from userlikerecipes where recipeId = ${req.params.idRecipe}`)
    if (qntLike != null){
        res.send({likes: qntLike[0][0].likes})
    }
})

app.post('/like/:idRecipe', async(req,res)=> {
    let response = await like.create({userId: req.body.userId, recipeId: req.params.idRecipe})
    if (response != null){
        console.log(JSON.stringify('true'))
    }
})

app.post('/dislike/:idRecipe', async(req, res)=>{
    let response = await like.destroy({where: {userId: req.body.userId, recipeId: req.params.idRecipe}})
    if (response != null){
        res.send(JSON.stringify('true'))
    }
})

app.post('/checkLike/:idRecipe', async(req, res)=>{
    let response = await like.findOne({where: {userId: req.body.userId, recipeId: req.params.idRecipe}})
    if (response == null){
        res.send(JSON.stringify('noLiked'))
    }else{
        res.send(JSON.stringify('liked'))
    }
})




