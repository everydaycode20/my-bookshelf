import React, {useState, useContext, useEffect} from 'react';
import { View, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {BookContext} from "../utils/context_book";
import {UserContext} from "../utils/user_context";
import { getWeek, getTotalDaysOfYear } from '../utils/get_date';

import Searchbar from "../searchbar/searchbar";
import Main from "./main";
import Book from "../book/book";
import Camera from '../camera/camera';

import firestore from "@react-native-firebase/firestore";

function CompMain({route}) {
    
    const {user, setUser} = useContext(UserContext);

    const {id, setId} = useContext(BookContext);

    const [userExists, setUserExists] = useState(false);

    const [userData, setUserData] = useState([]);

    const [readingBooks, setReadingBooks] = useState([]);

    const [suggestions, setSuggestions] = useState([]);

    const [tab, setTab] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        getUserData();
        setTab("Main");
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUserData();
    });

    function getUserData() {
        getTotalDaysOfYear(2019);
        const currentYear = new Date(Date.now()).getFullYear();

        const week = getWeek(new Date(Date.now()));

        const weekDays = [0,0,0,0,0,0,0];
        if (user !== null) {

            firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
                
                if (documentSnapshot.exists) {
                    
                    setUserExists(true);
                    const arr = [];
                    
                    const obj = documentSnapshot.data().books.currentlyReading;
                    
                    const objRead = documentSnapshot.data().books.read;
                    const suggestionsBooks = documentSnapshot.data().suggestions.categories;

                    for (const key in objRead) {
                        arr.push(objRead[key]);
                    }

                    for (const key in obj) {
                        arr.push(obj[key]);
                    }
                    
                    setUserData(documentSnapshot.data());
                    setReadingBooks(arr);

                    if (suggestionsBooks.length !== 0) {
                        setSuggestions([]);
                        suggestionsBooks.forEach((category, index) => {
                            fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=4&fields=items(volumeInfo/imageLinks,id)`).then(res => res.json()).then(data => {
                                if (data.items !== undefined) {
                                    data.items.forEach((d) => {
                                        setSuggestions(elm => [...elm, d]);
                                    })
                                }
                            });
                        })
                    }
                    
                    const years = documentSnapshot.data().years;
                    
                    for (const key in years) {
                        if (parseInt(key) === currentYear) {
                            let weekObj = years[key];
                            
                            if (!weekObj[week]) {
                                
                                firestore().collection("users").doc(user.uid).update({
                                    [`years.${currentYear}.${week}`]: weekDays,
                                });
                            }
                            else{
                                let currWeek = documentSnapshot.data().years[currentYear][week];
                                
                                firestore().collection("users").doc(user.uid).update({
                                    [`years.${currentYear}.${week}`]: currWeek,
                                });
                            }
                        }
                        else{
                            firestore().collection("users").doc(user.uid).update({
                                [`years.${currentYear}.${week}`]: weekDays,
                            });
                        }
                    }
                    setIsLoading(false);
                }
                else{
                    
                    setUserExists(false);
                    
                    if (week > 1) {
                        makeWeeks(week).then(obj => {
                            firestore().collection("users").doc(user.uid).set({
                                user: user.email,
                                years: {
                                    [currentYear]: {
                                        ...obj,
                                        pagesRead: 0
                                    },
                                },
                                books: {
                                    currentlyReading: {},
                                    favorite: {},
                                    read: {},
                                    wishlist: {},
                                },
                                suggestions: {
                                    categories: [],
                                },
                                pageGoal: "100",
                                authType: "",
                            });
                            setIsLoading(false);
                        });
                    }
                }
            });
        }
        setRefreshing(false);
    }

    function makeWeeks() {
        return new Promise(resolve => {
            let obj = getTotalDaysOfYear(new Date().getFullYear());
            resolve(obj);
        });
    }

    return(
        <View style={{backgroundColor: "white", flex: 1}}>
            <Searchbar tab={tab}/>
            <Main readingBooks={readingBooks} route={route.params?.message} routeId={route.params?.id} isLoading={isLoading} refreshing={refreshing} onRefresh={onRefresh}/>
        </View> 
    )
}

export default function StackMain() {
    
    const StackMain = createStackNavigator();

    const [id, setId] = useState("");

    return (
        <BookContext.Provider value={{id, setId}}>
            <StackMain.Navigator screenOptions={{headerShown: false}}>
                <StackMain.Screen name="Main" component={CompMain}/>
                <StackMain.Screen name="Book" component={Book}/>
                <StackMain.Screen name="Camera" component={Camera}/>
            </StackMain.Navigator>
        </BookContext.Provider>
    )
}