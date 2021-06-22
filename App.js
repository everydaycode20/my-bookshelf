import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
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
import SigninEmail from './components/signin_email';

export default function App() {

  const [login, setLogin] = useState(false);

  const [user, setUser] = useState([]);

  const Tab = createBottomTabNavigator();

  const [newBook, setNewBook] = useState({main: "", bookshelf: "all", favorite: "", profile: ""});

  useEffect(() => {
    const ac = new AbortController();

    GoogleSignin.configure({
      scopes: ["email"],
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return () => {
      subscriber;
      ac.abort();
    };

  }, []);

  function onAuthStateChanged(user) {
    setUser(user)
    console.log(user);
    if (user) {
      setLogin(true);
    }
  }

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();

      // setLogin(true);

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

  if (login === false) {
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

  if (login === true) {
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
              <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>
          </NavigationContainer>
        </UserContext.Provider>
      </AuthContext.Provider>
      </NewBookContext.Provider>
    )
  }

  return null;

}
