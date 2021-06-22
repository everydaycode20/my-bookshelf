import React, {useEffect, useContext, useState} from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Image, TouchableOpacity, RefreshControl, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalError from './modal_error';

import {UserContext} from "./utils/user_context";
import {BookContext} from "./utils/context_book";
import { NewBookContext } from './utils/context_newBook';

import firestore from "@react-native-firebase/firestore";

export default function Main({readingBooks, refreshing, onRefresh, isLoading, route, routeId}) {
    
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
        console.log(id);
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {  

                let objBooks = documentSnapshot.data().books;

                for (const key in objBooks) {
                    if (key === "read") {
                        let newObj = objBooks[key];
                        for (const key in newObj) {
                            if (id === key) {
                                const {authors, image, pageCount, title, description, pagesRead, categories, id, stat, isFavorite} = newObj[key];
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Main", "id": id, "stat": stat, "isFavorite": isFavorite};
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
                                let objData = {"authors": authors, "image": image, "pageCount": pageCount, "title": title, "description": description, status: "new", "pagesRead": pagesRead, "categories": categories, current: "Main", "id": id, "stat": stat, "isFavorite": isFavorite};
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
        <View style={{backgroundColor: "white", flex: 1, alignItems: "center",}}>
            <ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F54748"]}/>} style={{width: "80%"}}>
            <View style={styles.container}>
                <Text style={{color: "black", fontSize: 24}}>My Bookshelf</Text>
                {!isLoading &&
                <View style={styles.containerBook}>
                    <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={readingBooks} renderItem={(renderItem, index) => {
                        const {image, pagesRead, pageCount} = renderItem.item;
                        let percentageRead = Math.floor((pagesRead/pageCount)*100);
                        return(
                            <View style={{marginRight: 30}}>
                                <View >
                                    <TouchableOpacity onPress={() => getBook(renderItem.item.title)}>
                                        <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5, }} source={{uri:image}}/>
                                    </TouchableOpacity>
                                    
                                    <View style={styles.bar}>
                                        <View style={{width: `${percentageRead}%`, height: 8, backgroundColor: "#F54748", borderRadius: 50}}/>
                                    </View>
                                </View>
                            </View>
                        )
                    }} keyExtractor={(item, index) => {return item.id.toString()}}/>
                    
                </View>}
                {isLoading && 
                    <Image style={{width: 100, height: 50, flex: 1, resizeMode: "contain", alignSelf: "center"}} source={require("../assets/loading_gif.gif")}/>
                }
                {readingBooks.length === 0 && !isLoading && <View style={{height: 100}}>
                        <Text style={{fontSize: 18}}>Search books and add them to your Bookshelf</Text>
                </View>}
            </View>
            {showModal && 
                <ModalError setShowModal={setShowModal}/>
            }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    containerBook: {
        flexDirection: "row",
        marginTop: 15,
        width: "100%",
    },
    bar: {
        backgroundColor: "#F5E6CA",
        width: 100,
        height: 8,
        borderRadius: 50,
        marginTop: 7
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",

    },
    modalView: {
        backgroundColor: "#D2CDCD",
        borderRadius: 5,
        alignItems: "center", 
        elevation: 5,
        height: 120,
        width: 250,
        justifyContent: "center",

    }
});