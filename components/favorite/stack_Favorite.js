import React, {useState, useContext, useEffect} from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {BookContext} from "../utils/context_book";
import {UserContext} from "../utils/user_context";

import Searchbar from "../searchbar/searchbar";
import Favorite from "./favorite";
import Book from "../book/book";

import firestore from "@react-native-firebase/firestore";

function CompFav({route}) {
    
    const {user,} = useContext(UserContext);

    const [tab, setTab] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [favorite, setFavorite] = useState([]);
    
    useEffect(() => {
        getFavorites();
        setTab("Favorite");
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getFavorites();
    });

    function getFavorites() {
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {

            if (documentSnapshot.exists) {
                const arr = [];
                const objCurrentlyReading = documentSnapshot.data().books.currentlyReading;
                const objRead = documentSnapshot.data().books.read;

                for (const key in objCurrentlyReading) {
                    if (objCurrentlyReading[key].isFavorite === true) {
                        arr.push(objCurrentlyReading[key]);
                    }
                }

                for (const key in objRead) {
                    if (objRead[key].isFavorite === true) {
                        arr.push(objRead[key]);
                    }
                }

                setFavorite(arr);
                setIsLoading(false);
            }
            
        });
        
        setRefreshing(false);
    }

    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <Searchbar tab={tab}/>
            <Favorite refreshing={refreshing} route={route.params?.message} routeId={route.params?.id} onRefresh={onRefresh} favorite={favorite} isLoading={isLoading}/>
        </View>
    )
}

export default function StackFavorite() {
    
    const StackFav = createStackNavigator();

    const [id, setId] = useState("");

    return (
        <BookContext.Provider value={{id, setId}}>
            <StackFav.Navigator screenOptions={{headerShown: false}}>
                <StackFav.Screen name="Favorite" component={CompFav}/>
                <StackFav.Screen name="Book" component={Book}/>
            </StackFav.Navigator>
        </BookContext.Provider>
    )

}