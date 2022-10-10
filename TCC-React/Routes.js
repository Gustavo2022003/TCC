import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPreset, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Welcome from './Pages/Welcome';
import Register from './Pages/Register';
import Login from './Pages/Login';

import Home from './Pages/UserArea/Home';
import Profile from './Pages/UserArea/Profile';
import OtherProfile from './Pages/UserArea/OtherProfile';
import SearchRecipe from './Pages/UserArea/SearchRecipe';
import SearchResult from './Pages/UserArea/SearchResult';
import Recipe from './Pages/UserArea/Recipe';
import CreateRecipe from './Pages/UserArea/CreateRecipe';
import Search from './Pages/UserArea/Search';
import Chat from './Pages/UserArea/Chat';


import ButtonNew from './components/ButtonNew';

import {Ionicons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginStack = createStackNavigator();
const AppStack = createStackNavigator();
const HomePages = createStackNavigator();
const TabStack = createBottomTabNavigator();
const SearchPages = createStackNavigator();


function HomeStack(){
  return(
    <HomePages.Navigator 
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      gestureDirection: 'vertical',
    }}>
    <HomePages.Screen name="Home" component={Home} />
    <HomePages.Screen name='Recipe' component={Recipe} />
    <HomePages.Screen name='OtherProfile' component={OtherProfile} />
    </HomePages.Navigator>
);}

function ProfileStack(){
  return(
    <HomePages.Navigator 
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      gestureDirection: 'vertical',
    }}>
    <HomePages.Screen name="ProfileScreen" component={Profile} />
    <HomePages.Screen name='Recipe' component={Recipe} />
    </HomePages.Navigator>
);}

function SearchStack(){
  return(
    <SearchPages.Navigator 
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      gestureDirection: 'vertical',
    }}>
    <SearchPages.Screen name="SearchStack" component={SearchRecipe} />
    <SearchPages.Screen name="CreateRecipe"component={CreateRecipe} />
    <SearchPages.Screen name='SearchResult' component={SearchResult} />
    <SearchPages.Screen name='Recipe' component={Recipe}/>
    <HomePages.Screen name='OtherProfile' component={OtherProfile} />
    </SearchPages.Navigator>
);}

function TabHome() {
    return (
      <TabStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle:{
          position: 'absolute',
          borderTopLeftRadius: 27,
          borderTopRightRadius:27,
          height: '12%'
        }
      }}>
        <TabStack.Screen name="Feed" component={HomeStack} 
        options={{
          tabBarIcon: ({ color, size, focused})=>{
            if(focused){
              return <Ionicons name='home' size={45} color='black' />
            }
            return <Ionicons name='home-outline' size={40} color='black' />
          }
        }} />
        <TabStack.Screen name="Profile" component={ProfileStack} 
        options={{
          tabBarIcon: ({ color, size, focused})=>{
            if(focused){
              return <MaterialCommunityIcons name='account' size={45} color='black' />
            }
            return <MaterialCommunityIcons name='account-outline' size={40} color='black' />
          }
        }} />
        <TabStack.Screen name="SearchRecipe" component={SearchStack} 
        options={{
          tabBarIcon: ({ color, size, focused})=>{
            if(focused){
              return <ButtonNew/>
            }
            return <Ionicons name='book-outline' size={40} color={'black'} />
          }
        }} />
        <TabStack.Screen name="Search" component={Search} 
        options={{
          tabBarIcon: ({ color, size, focused})=>{
            if(focused){
              return <Ionicons name='search' size={45} color={'black'} />
            }
            return <Ionicons name='search-outline' size={40} color={'black'} />
          }
        }} />
        <TabStack.Screen name="Chat" component={Chat}
        options={{
          tabBarIcon: ({ color, size, focused})=>{
            if(focused){
              return <Ionicons name='chatbox' size={45} color={'black'} />
            }
            return <Ionicons name="md-chatbubble-ellipses-outline" size={40} color="black" />
          }
        }} />
      </TabStack.Navigator>
    );
  }


function LoginScreens(){
    return(
      <LoginStack.Navigator 
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        gestureDirection: 'vertical',
      }}>
      <LoginStack.Screen name="Welcome" component={Welcome} />
      <LoginStack.Screen name='Login' component={Login} />
      <LoginStack.Screen name='Register' component={Register} />
      </LoginStack.Navigator>
);}

export default function Routes(){
    return (
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{
                gestureEnabled: false,
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                }}>
                <AppStack.Screen name='LoginStack' component={LoginScreens} />
                <AppStack.Screen name='UserStack' component={TabHome} />
            </AppStack.Navigator>
            
        </NavigationContainer>
    );
}

