import React, {useState, useContext, useEffect} from 'react';
import { View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {BookContext} from "./utils/context_book";
import { useFocusEffect } from '@react-navigation/native';
import { NewBookContext } from './utils/context_newBook';
import firestore from "@react-native-firebase/firestore";

import Searchbar from "./searchbar";
import BookShelf from './bookshelf';
import Book from './book';

import {UserContext} from "./utils/user_context";

function CompBookshelf({route}) {

    const {user} = useContext(UserContext);

    const [tab, setTab] = useState("");

    const [read, setRead] = useState([]);

    const [reading, setReading] = useState([]);

    const [wishlist, setWishlist] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        getBooks();
        setTab("Bookshelf");
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getBooks();
    });

    function getBooks() {
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                    const arrRead = [];
                    const arrReading = [];
                    const arrWishlist = [];

                    const objRead = documentSnapshot.data().books.read;
                    const objReading = documentSnapshot.data().books.currentlyReading;
                    const objWishlist = documentSnapshot.data().books.wishlist;

                    for (const key in objRead) {
                        arrRead.push(objRead[key]);
                    }
                    setRead(arrRead);
                    for (const key in objReading) {
                        arrReading.push(objReading[key]);
                    }
                    setReading(arrReading);
                    for (const key in objWishlist) {
                        arrWishlist.push(objWishlist[key]);
                    }
                    setWishlist(arrWishlist);
                    setIsLoading(false);
            }
        });
        setRefreshing(false);
    }

    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <Searchbar tab={tab}/>
            <BookShelf read={read} route={route.params?.message} routeId={route.params?.id} onRefresh={onRefresh} refreshing={refreshing} reading={reading} wishlist={wishlist} isLoading={isLoading}/>
        </View>
    )
}

export default function StackBookshelf() {
    
    const StackBookshelf = createStackNavigator();

    const [id, setId] = useState("");
    // console.log(id, "ID BOOK CONTEXT");
    return (
        <BookContext.Provider value={{id, setId}}>
            <StackBookshelf.Navigator screenOptions={{headerShown: false}}>
                <StackBookshelf.Screen name="Bookshelf" component={CompBookshelf}/>
                <StackBookshelf.Screen name="Book" component={Book}/>
            </StackBookshelf.Navigator>
        </BookContext.Provider>
    )
}
