import React, {useState, useEffect, useRef, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import ComponentIngrediente from '../../components/ComponentIngrediente';
import { Ionicons } from '@expo/vector-icons';
import AlertCustom from '../../components/Alert';
import { TextInput } from 'react-native-gesture-handler';
import { Form, Formik, useFormik, useFormikContext } from 'formik';
import * as yup from 'yup';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }

export default function SearchRecipe({navigation, routes}) {
    const [ingredients, setIngredients]=useState([]);
    const [SearchIngredientes, setSearchIngredients] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [counter, setCounter] = useState([]);
    const [queryResult, setQueryResult] = useState([]);
    const [shownButtonDown, setShownButtonDown] = useState(false)
    const [formDataState, setFormData] = useState(null);
    const RecipeInfo = {recipename: '', category: '', ModoPreparo: ''};

    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [disable, setDisable] = useState(false);
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }

    async function GetIngredients(){
        let response= await fetch('http://192.168.0.108:3000/ingredients',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.json();
        if (json == 'IngredientsError'){
            setAlertTitle('Erro ao Carregar Ingredientes')
            setAlertMessage('Clique no Botão para atualizar os ingredientes novamente')
            setErrorFeed(true);
            setIngredients(null);
        }else{
            console.log('Ingredientes Carregados')
            // Add quant to the object
            let newIngredients = json.map(item => {
                return { ...item, quantItem: 0};
            });
            setIngredients(newIngredients);
            setSearchIngredients(newIngredients);
        }
    };

    useEffect(()=>{
        GetIngredients();
    },[navigation]);

    

    async function checkGeral(values){
    var ingredientQuery = ingredients.filter(ingredient => ingredient.quantItem > 0).map(ingredients => {return [ingredients.id, ingredients.quantItem]})
        // Sempre numéros impares serão os IDS dos ingredientes e os Pares Quantidades
        let flatIngredients = ingredientQuery.flatMap(ingredients => ingredients)
        if(flatIngredients.length == 0){
            setVisibleAlert(true)
            setAlertTitle('Erro ao fazer consulta')
            setAlertMessage('Você não pode realizar uma consulta sem inserir nenhum ingrediente')
        }
        else if(flatIngredients.length > 20){
            setVisibleAlert(true)
            setAlertTitle('Erro ao fazer consulta')
            setAlertMessage('Me Desculpe, mas por enquanto você não pode crair uma receita com mais de 10 ingredientes')
        }
        else{
            /*ingredients.forEach(item => {
                item.quantItem = 0
                let value = item.quantItem;
                setCounter(value);
                return item.quantItem;
            });*/
            /*let query = await fetch('http://192.168.0.108:3000/searchRecipe',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ArrrayIngredient: flatIngredients,
                    recipeName: '',
                    category:'',
                    ModoPreparo:'',
                    PictureReceita:'',
                })
            })
            let res = await query.json()
            console.log("----------- RECEITA CRIADA -----------")
            console.log(res)*/
            
        }
        console.log(values.recipename)
        console.log(values.category)
        console.log(values.ModoPreparo)
    }
    //Search on Ingredients FlatList
    async function FilterIngredients(s){
        if (s){
        let newData = ingredients.filter((item) => {
            const itemData = item.ingredienteName ?
                        item.ingredienteName.toUpperCase()
                        : ''.toUpperCase();
            const textData = s.toUpperCase()
            return itemData.indexOf(textData) > -1;
        });
            setSearchIngredients(newData);
        }else{
            setSearchIngredients(ingredients)
        }
    }

    //Image Selector
    const openImagePickerAsync = async () => {
    
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({allowsEditing: true,});
        
        if (!pickerResult.cancelled) {
            // ImagePicker saves the taken photo to disk and returns a local URI to it
                let localUri = pickerResult.uri;
                let filename = localUri.split('/').pop();

            // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs
                let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
                formData.append('photo', { uri: localUri, name: filename, type });
                
                //Send to the back-end
                let response = await axios.post('http://192.168.0.108:3000/uploadImg', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    }
                })
                .catch(function (error) {
                    console.log(error.toJSON());
                });
                //Return and set the name of Image
                let json = await response.data;
                setFormData(json);
        }
    }

    //Schema yup
    const recipeSchema = yup.object().shape({
        recipename: yup.string().trim().min(3, 'Recipe name too short!').required("Recipe name is necessary!"),
        category: yup.string().trim().min(3, 'Category name too short!').required("Categoryis necessary!"),
        ModoPreparo: yup.string().trim().min(40, 'Way of Preparation is too short!').required("Way of Preparation is necessary!")
    })


    //Render item to Flat List
    let RenderItem = ({item, index}) => {
        //Check if selected more than 5 ingredients and remove the last inserted
        async function checkQuant(){
            var ingredientQuery = ingredients.filter(ingredient => ingredient.quantItem > 0).map(ingredients => {return [ingredients.id, ingredients.quantItem]})
            // Sempre numéros impares serão os IDS dos ingredientes e os Pares Quantidades
            let flatQuery = ingredientQuery.flatMap(ingredients => ingredients)
            if(flatQuery.length > 10){
                setVisibleAlert(true)
                setAlertTitle('Erro ao adicionar item')
                setAlertMessage('Você não pode realizar uma consulta com mais de 5 itens')
                setCounter([item.quantItem -= 1, item.id]);
                return item.quantItem, item.id;
            }
        }

        async function increment(){      
            setCounter([item.quantItem += 1, item.id]);
            checkQuant();
            return item.quantItem, item.id;
        }
        async function decrement(){
            if (item.quantItem <= 0){
                console.log('Não consegue ser menor que 0')
            }else{;
                setCounter([item.quantItem -= 1, item.id])
                return item.quantItem, item.id;
            }
        }
        

    return(
    <View style={{backgroundColor: index++ % 2 === 0 ? '#83B98F' :'#A0E2AF' }}>
        <ComponentIngrediente {...item} index={index} counterId={counter} increment={increment} decrement={decrement}/>
    </View>
    )}

    const onRefresh = async () => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        GetIngredients();
        console.log('Refresh')
        setErrorFeed(false)
    };

    const FilterSearch = useRef();
    const clearSearch = () =>{
        FilterSearch.current.clear();
        let s;
        FilterIngredients(s)
    }

    const FlatIngredients = useRef();
    const goDown = () => {
        FlatIngredients.current.scrollToEnd({animated: true})
    }


    const formik = useFormik({
        initialValues: RecipeInfo,
        onSubmit: {checkGeral},
        validationSchema: recipeSchema
    });

    return (
            <Animatable.View animation='fadeInUp' style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity disabled={disable} style={{ flexDirection: 'row', alignSelf: 'center' }} onPress={() => goBack()}>
                        <AntDesign style={{ alignSelf: 'center' }} name="left" size={24} color="#3B944F" />
                        <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: '500', color: '#3B944F' }}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.HeaderTitle}>Recipe Creation</Text>
                    <View style={{width: '10%'}}/>
                </View>
                <AlertCustom 
                    visible={visibleAlert}
                    title = {alertTitle}
                    message = {alertMessage}
                    positiveButton={() => setVisibleAlert(false)}
                />
                <View>
                <FlatList
                    ref={FlatIngredients}
                    data={SearchIngredientes}
                    keyExtractor={(item, index) =>  index.toString()}
                    renderItem={RenderItem}
                    onScrollBeginDrag={()=> setShownButtonDown(true)}
                    onEndReached={()=> setShownButtonDown(false)}
                    onEndReachedThreshold={0.1}
                    ListHeaderComponent={
                        <View style={styles.container}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.form}>
                                
                
                                        <TextInput style={styles.formInput} placeholder='Recipe name' value={formik.values.recipename} onBlur={formik.handleBlur('recipename')} onChangeText={formik.handleChange('recipename')}/>
                                        {formik.touched.recipename && formik.errors.recipename && <Text style={styles.errorInput}>{formik.errors.recipename}</Text>}
                                        
                                        <TextInput style={styles.formInput} placeholder='Category' value={formik.values.category} onBlur={formik.handleBlur('category')} onChangeText={formik.handleChange('category')}/>
                                        {formik.touched.category && formik.errors.category && <Text style={styles.errorInput}>{formik.errors.category}</Text>}

                                        <Image/>
                                        <TouchableOpacity style={styles.selectImgBtn}onPress={openImagePickerAsync}>
                                            <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 20}}>Choose a Picture</Text>
                                        </TouchableOpacity>
                                        
                            </View>
                            </TouchableWithoutFeedback>
                            <View style={{justifyContent: 'flex-start', width: '90%', marginTop:'5%'}}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Select the used ingredients</Text>
                            </View>
                            <View style={styles.backSearch}>
                                <TextInput ref={FilterSearch} style={styles.input} placeholder={"Search the ingredient here"} onChangeText={(s) => FilterIngredients(s)}/>
                                <TouchableOpacity style={styles.resetSearch} onPress={clearSearch}>
                                    <Text>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    ListFooterComponent={
                        <View style={styles.bottom}>
                            <TextInput style={styles.formInput} placeholder='Way of Preparation' multiline={true} value={formik.values.ModoPreparo} onBlur={formik.handleBlur('ModoPreparo')} onChangeText={formik.handleChange('ModoPreparo')}/>
                            {formik.touched.ModoPreparo && formik.errors.ModoPreparo && <Text style={styles.errorInput}>{formik.errors.ModoPreparo}</Text>}
                            
                            {formik.errors.recipename || formik.errors.category || formik.errors.ModoPreparo ?
                                <TouchableOpacity style={styles.RegButtonInvalid} disabled={!Formik.isValid}>
                                    <Text style={styles.RegTextInvalid}>Create Recipe</Text> 
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.RegButton} onPress={formik.handleSubmit} disabled={!recipeSchema.isValid}>
                                    <Text style={styles.RegText}>CreateRecipe</Text> 
                                </TouchableOpacity>}
                        </View>
                    }
                />
                </View>
                {shownButtonDown == true ?
                <TouchableOpacity style={styles.downButton} onPress={goDown}>
                    <AntDesign name="arrowdown" size={30} color="white" />
                </TouchableOpacity>
                :
                //Nothing
                <View>

                </View>
                }
            </Animatable.View>
    );
}
//#A0E2AF
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
header:{
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 32,
    fontWeight: '700',
},
bottom:{
    marginBottom: '60%',
    width: '100%',
    height: '30%'
},
error:{
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
},
errorTxt:{
    marginTop: '1%',
    fontSize: 16,
    fontWeight: '500',
},
errorTxtTitle:{
    fontSize: 26,
    fontWeight: '700',
    marginBottom: '2%'
},
ButtonRefreshError:{
    marginTop: '3%',
    backgroundColor: '#A0E2AF',
    padding: '3%',
    width: '40%',
    height: 45,
    borderRadius: 15,
    justifyContent:'center'
},
buttonTxt:{
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
},
btnPesquisa: {
    backgroundColor: '#5DB075',
    margin: 6,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: '2%',
    height: 45,
    width: '50%'
},
downButton: {
    backgroundColor: '#5DB075',
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 60,
    height: 60,
    borderRadius: 33,
    bottom: '15%',
    right: '8%'
},
yourRecipe:{
    justifyContent: 'center',
    alignItems:'center',
    marginBottom: 15
},
createButton:{
    backgroundColor: '#5DB075',
    width: '60%',
    alignItems:'center',
    padding: '2%',
    borderRadius: 50,
    marginTop: '3%'
},
backSearch:{
    flex: 1,
    backgroundColor: '#A0E2AF',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '-1%'
},
resetSearch:{
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#BDBDBD',
    width: '18%',
    height: '55%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.21)',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
},
input:{
    alignSelf:'center',
    color: '#BDBDBD',
    width: '75%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.21)',
    paddingLeft: 20,
    height: '55%',
    marginVertical: '5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
},
form:{
    marginTop: '2%',
    flex: 1,
    width: '100%',
},
formInput:{
    alignSelf:'center',
    color: '#BDBDBD',
    width: '80%',
    height: 60,
    paddingLeft: 20,
    margin: '3%',
    backgroundColor: '#EDEDED',
    borderRadius: 18,
},
errorInput:{
    marginTop: '-3%',
    paddingBottom: 10,
    color: 'red',
    fontWeight: '700',
    marginLeft: '14%',
},
selectImgBtn:{
    alignContent: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 40,
    backgroundColor: '#5DB075',
    alignSelf: 'center',
    borderRadius: 15,
},
RegButton:{
    marginTop: '3%',
    alignSelf:'center',
    backgroundColor: '#5DB075',
    width: '60%',
    height: 55,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
},
RegButtonInvalid:{
    marginTop: '3%',
    alignSelf:'center',
    backgroundColor: '#eaeaea',
    width: '60%',
    height: 55,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
},
RegText:{
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
},
RegTextInvalid:{
    fontSize: 26,
    fontWeight: '700',
    color: '#999999',
}
});