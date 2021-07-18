import React, {useEffect, useContext, useState} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, RefreshControl, ScrollView } from 'react-native';
import {UserContext} from "../utils/user_context";
import {BookContext} from "../utils/context_book";
import ModalError from '../modal_error';

import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';

export default function Favorite({refreshing, isLoading, favorite, onRefresh, route, routeId}){
    
    const {user,} = useContext(UserContext);

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
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Favorite", "stat": stat, "isFavorite": isFavorite};
                                setId(id);
                                navigation.navigate("Book", {data: objData});
                            }
                        }
                    }
                    else if (key === "currentlyReading") {
                        let newObj = objBooks[key];
                        for (const key in newObj) {
                            if (id === key) {
                                const {authors, image, pageCount, title, description, pagesRead, categories, id, stat, isFavorite} = newObj[key];
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Favorite", "stat": stat, "isFavorite": isFavorite};
                                setId(id);
                                navigation.navigate("Book", {data: objData});
                            }
                        }
                    }
                }
            }
        });
    }

    return (
        <View style={{backgroundColor: "white", alignItems: "center", flex: 1}}>
            <View style={styles.container}>
                <Text style={{color: "black", fontSize: 24}}>my favorite books</Text>
                <View style={styles.containerBook}>
                    {!isLoading && <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F54748"]} />} showsVerticalScrollIndicator={false} data={favorite} renderItem={(renderItem, index) => {
                        const {image, pageCount, title, authors} = renderItem.item;
                        
                        return (
                            <View style={styles.book}>
                                <View>
                                    <TouchableOpacity onPress={() => getBook(renderItem.item.title)}>
                                        <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft: 10, flexShrink: 1}}>
                                    <Text  style={{color: "black", fontSize: 18, fontWeight: "bold", flexShrink: 1}}>{title}</Text>
                                    <Text style={{color: "black", fontSize: 18,}}>{authors}</Text>
                                    <Text style={{color: "black", fontSize: 18,}}>{pageCount} pages</Text>
                                </View>
                            </View>
                        )
                    }} keyExtractor={(item, index) => {return index.toString()}}/>}
                    {isLoading && 
                        <Image style={{width: 100, height: 50, resizeMode: "contain", alignSelf: "center"}} source={require("../../assets/loading_gif.gif")}/>}
                    {favorite.length === 0 && !isLoading  && 
                    <ScrollView style={{height: "100%"}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F54748"]} />} >
                        <Text style={{fontSize: 18}}>You don't have any favorite book</Text>
                    </ScrollView>}
                </View>
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
        paddingBottom: 20,
        marginTop: 30,
        width: "100%",
        
    },
    bar: {
        backgroundColor: "#F5E6CA",
        width: 100,
        height: 8,
        borderRadius: 50,
        marginTop: 7
    },
    book: {
        flexDirection: "row",
        marginBottom: 20,
    }
});