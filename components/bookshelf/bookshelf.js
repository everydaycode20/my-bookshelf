import React, {useEffect, useContext, useState} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView, RefreshControl, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalError from '../modal_error';

import {UserContext} from "../utils/user_context";
import {BookContext} from "../utils/context_book";

import firestore from "@react-native-firebase/firestore";


export default function BookShelf({read, route, routeId, reading, wishlist, isLoading, onRefresh, refreshing}) {

    const {user} = useContext(UserContext);

    const {setId} = useContext(BookContext);

    const navigation = useNavigation();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (route === "error") {
            setShowModal(true);
        }
    }, [routeId]);

    function getBook(id) {
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {  

                let objBooks = documentSnapshot.data().books;

                for (const key in objBooks) {
                    if (key === "read") {
                        let newObj = objBooks[key];
                        for (const key in newObj) {
                            if (id === key) {
                                const {authors, image, pageCount, title, description, pagesRead, categories, id, stat, isFavorite} = newObj[key];
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Bookshelf", "stat": stat, "isFavorite": isFavorite};
                                setId(id),
                                navigation.navigate("Book", {data: objData});
                            }
                        }
                    }
                    else if (key === "currentlyReading") {
                        let newObj = objBooks[key];
                        for (const key in newObj) {
                            if (id === key) {
                                const {authors, image, pageCount, title, description, pagesRead, categories, id, stat, isFavorite} = newObj[key];
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Bookshelf", "stat": stat, "isFavorite": isFavorite};
                                setId(id),
                                navigation.navigate("Book", {data: objData});
                            }
                        }
                    }
                    else if (key === "wishlist") {
                        let newObj = objBooks[key];
                        for (const key in newObj) {
                            if (id === key) {
                                const {authors, image, pageCount, title, description, pagesRead, categories, id, stat} = newObj[key];
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Bookshelf", "stat": stat};
                                setId(id),
                                navigation.navigate("Book", {data: objData});
                            }
                        }
                    }
                }
            }
        });
    }
    
    return (
        <View style={{backgroundColor: "white", flex: 1, alignItems: "center"}}>
            <View style={styles.container}>
                <Text style={{color: "black", fontSize: 24}}>My Bookshelf</Text>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F54748"]}/>} showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <View style={styles.containerBook}>
                    <View style={{flexDirection: "column", width: "100%"}}>
                        <Text style={{color: "black", fontSize: 20, marginBottom: 20, }}>Books I've read</Text>
                    {!isLoading && <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={read} renderItem={(renderItem, item) => {
                        const {image} = renderItem.item;
                        return (
                                <View style={{marginRight: 30}}>
                                    <View>
                                        <TouchableOpacity onPress={() => getBook(renderItem.item.title)}>
                                            <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}/>}
                    {isLoading && 
                        <Image style={{width: 100, height: 50, flex: 1, resizeMode: "contain", alignSelf: "center"}} source={require("../../assets/loading_gif.gif")}/>
                    }
                    {read.length === 0 && !isLoading && <View style={{height: 100}}>
                        <Text style={{fontSize: 18}}>There are no books in your read list</Text>
                    </View>}
                    </View>
                </View>
                <View style={styles.containerBook}>
                    <View style={{flexDirection: "column", width: "100%"}}>
                        <Text style={{color: "black", fontSize: 20, marginBottom: 20}}>Currently reading</Text>
                    {!isLoading && <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={reading} renderItem={(renderItem, item) => {
                        const {image} = renderItem.item;
                        return (
                                <View style={{marginRight: 30}}>
                                    <View>
                                        <TouchableOpacity onPress={() => getBook(renderItem.item.title)}>
                                            <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}/>}
                    {isLoading && 
                        <Image style={{width: 100, height: 50, flex: 1, resizeMode: "contain", alignSelf: "center"}} source={require("../../assets/loading_gif.gif")}/>
                    }
                    {reading.length === 0 && !isLoading && <View style={{height: 100}}>
                        <Text style={{fontSize: 18}}>There are no books in your read list</Text>
                    </View>}
                    </View>
                </View>
                <View style={styles.containerBook}>
                    <View style={{marginBottom: 20, flexDirection: "column", width: "100%"}}>
                        <Text style={{color: "black", fontSize: 20, marginBottom: 20}}>Wishlist</Text>
                    {!isLoading && <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={wishlist} renderItem={(renderItem, item) => {
                        const {image} = renderItem.item;
                        return (
                            <View style={{marginRight: 30}}>
                                <View>
                                    <TouchableOpacity onPress={() => getBook(renderItem.item.title)}>
                                        <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}/>}
                    {isLoading && 
                        <Image style={{width: 100, height: 50, flex: 1, resizeMode: "contain", alignSelf: "center"}} source={require("../../assets/loading_gif.gif")}/>
                    }
                    {wishlist.length === 0 && !isLoading && <View style={{height: 100}}>
                        <Text style={{fontSize: 18}}>There are no books in your read list</Text>
                    </View>}
                    </View>
                </View>
                </ScrollView>
            </View>
            {showModal && 
                <ModalError setShowModal={setShowModal}/>
            }   
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        flex: 1
    },
    containerBook: {
        flexDirection: "row",
        marginTop: 30,
        width: "100%",
    },
    bar: {
        backgroundColor: "#F5E6CA",
        width: 100,
        height: 8,
        borderRadius: 50,
        marginTop: 7,
    }
});