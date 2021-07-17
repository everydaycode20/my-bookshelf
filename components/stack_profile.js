import React, {useState, useContext, useEffect} from 'react';
import { View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {BookContext} from "./utils/context_book";
import { useFocusEffect } from '@react-navigation/native';
import { NewBookContext } from './utils/context_newBook';
import firestore from "@react-native-firebase/firestore";

import Profile from './profile';
import Stats from './stats';

function CompProfile() {

    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <Profile />
        </View>
    )
}

export default function StackProfile() {
    
    const StackProfile = createStackNavigator();

    return (
        <StackProfile.Navigator screenOptions={{headerShown: false}}>
            <StackProfile.Screen name="Profile" component={Profile}/>
            <StackProfile.Screen name="Stats" component={Stats}/>
        </StackProfile.Navigator>
    )
}