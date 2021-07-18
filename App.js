import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import {AuthContext} from "./components/utils/context_auth";
import {UserContext} from "./components/utils/user_context"
import {NewBookContext} from "./components/utils/context_newBook";

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Login from "./components/login";
import Profile from "./components/profile";
import SignupEmail from './components/signup_email';

import StackMain from "./components/stack_Main";
import StackFavorite from "./components/stack_Favorite";
import StackBookshelf from "./components/stack_Bookshelf";
import StackProfile from './components/stack_profile';
import SigninEmail from './components/signin_email';
import Connected from './components/not-connected';

export default function App() {

  const [login, setLogin] = useState(false);

  const [user, setUser] = useState([]);

  const Tab = createBottomTabNavigator();

  const [newBook, setNewBook] = useState({main: "", bookshelf: "all", favorite: "", profile: ""});

  const [isConnected, setIsConnected] = useState(true);

  const [refresh, setRefresh] = useState("");

  useEffect(() => {
    
    const ac = new AbortController();
    let subscriber = null;

    const unsubscribe = NetInfo.addEventListener(state => {
      
      if (!state.isConnected) {
        setIsConnected(false);
      }
      else{
        setIsConnected(true);
        GoogleSignin.configure({
          scopes: ["email"],
          webClientId: '99853162195-ptu9icemdkvmp9lq9e74kifj5ja29eds.apps.googleusercontent.com',
        });
        subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      }
    });
    
    

    // if (isConnected) {
    //     GoogleSignin.configure({
    //       scopes: ["email"],
    //       webClientId: '99853162195-ptu9icemdkvmp9lq9e74kifj5ja29eds.apps.googleusercontent.com',
    //   });
    //   subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // }
    
    return () => {
      unsubscribe();
      subscriber;
      ac.abort();
    };
    
  }, [refresh]);

  function onAuthStateChanged(user) {
    setUser(user)

    if (user) {
      setLogin(true);
    }
  }

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();

      const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);

      await auth().signInWithCredential(credential);

    } 
    catch (error) {
      // alert('login: Error:' + error);
    }
  }

  function handleSignIn() {
    signIn();
  }

  const StackLogin = createStackNavigator();

  if (!isConnected) {
    return <Connected setRefresh={setRefresh}/>
  }

  if (login === false && login !== null && isConnected === true) {
    return(
      <View style={{flex: 1}}>
      <StatusBar barStyle = "dark-content" backgroundColor="white"/>
      <NavigationContainer>
        <StackLogin.Navigator screenOptions={{headerShown: false}}>
          <StackLogin.Screen initialParams={{event: handleSignIn}} name="Login" component={Login}/>
          <StackLogin.Screen name="Signup-Email" component={SignupEmail}/>
          <StackLogin.Screen name="Signin-Email" component={SigninEmail}/>
        </StackLogin.Navigator>
      </NavigationContainer>
      </View>
    )
  }

  if (login === true && login !== null && isConnected === true) {
    return (
      <NewBookContext.Provider value={{newBook, setNewBook}}>
      <AuthContext.Provider value={{login, setLogin}}>
        <StatusBar barStyle = "dark-content" backgroundColor="white"/>
        <UserContext.Provider value={{user, setUser}}>
          <NavigationContainer>
            <Tab.Navigator screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                if (route.name === "Home") {
                  return (
                    <Entypo name="home" size={35} color={focused ? "#F54748" : "#343F56"} />
                  )
                }
                else if (route.name === "Bookshelf") {
                  return (
                    <FontAwesome5 name="book" size={30} color={focused ? "#F54748" : "#343F56"} />
                  )
                }
                else if(route.name === "Favorite"){
                  return (
                    <FontAwesome name="bookmark" size={32} color={focused ? "#F54748" : "#343F56"} />
                  )
                }
                else if(route.name === "Profile"){
                  return(
                    <Ionicons name="person" size={32} color={focused ? "#F54748" : "#343F56"} />
                  )
                }
              }
            })} tabBarOptions={{style:{elevation: 0},showLabel: false, keyboardHidesTabBar: true}}>
              <Tab.Screen name="Home" component={StackMain} />
              <Tab.Screen name="Bookshelf" component={StackBookshelf} />
              <Tab.Screen name="Favorite" component={StackFavorite} />
              <Tab.Screen name="Profile" component={StackProfile} />
            </Tab.Navigator>
          </NavigationContainer>
        </UserContext.Provider>
      </AuthContext.Provider>
      </NewBookContext.Provider>
    )
  }

  return null;

}
