import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {BookContext} from "./utils/context_book";
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import firestore, { firebase } from '@react-native-firebase/firestore';
import {UserContext} from "./utils/user_context";
import { useNavigation } from '@react-navigation/native';
import { NewBookContext } from './utils/context_newBook';
import { getWeek, getDay } from './utils/get_date';

export default function Book({route, navigation}) {
    
    const nav = useNavigation();

    const {user} = useContext(UserContext);

    const {newBook, setNewBook} = useContext(NewBookContext);

    const { data } = route.params;

    const {id} = useContext(BookContext);
    
    const listOpts = [{id: 0, opt: 'Read'}, {id: 1, opt: "Currently reading"}, {id: 2, opt: "Wishlist"}];

    const [idBtn, setIdBtn] = useState(4);

    const [fav, setFav] = useState(false);

    const [pages, setPages] = useState("");

    const [wrongPageCount, setWrongPageCount] = useState(false);

    const [pagesRead, setPagesRead] = useState(0);

    const [isNewBook, setIsNewBook] = useState(false);

    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        console.log(data, "DATA BOOK");
        setIdBtn(data.stat);
        setPages(data.pagesRead);
        if (data.isFavorite) {
            setFav(true);
        }
        console.log(data.current);
        if (data.status) {
            const {pageCount, pagesRead} = data;
            setPagesRead(Math.floor((pagesRead/pageCount)*100));
        }
    }, [data]);
    
    function checkBtn(index) {
        setIdBtn(index);
        console.log(id, "ID DE SIEMPRE");
        const {authors, image, pageCount, title, description, categories } = data;

        try {
            if (index === 0) {
                console.log(id);
                setIsNewBook(true);
                setPagesRead(100);

                firestore().collection("users").doc(user.uid).update({
                    [`books.read.${title}`]: {pagesRead: `${pageCount}`, id, image, pageCount, description, title, authors, categories, "stat": 0, "isFavorite": false},
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.currentlyReading.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.wishlist.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`suggestions.categories`]: firestore.FieldValue.arrayUnion(categories[0]),
                });
            }
            else if(index === 1){
                setPagesRead(0);
                setIsNewBook(true);

                firestore().collection("users").doc(user.uid).update({
                    [`books.currentlyReading.${title}`]: {pagesRead: "0", id, image, pageCount, description, title, authors, categories, "stat": 1, "isFavorite": false},
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.read.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.wishlist.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`suggestions.categories`]: firestore.FieldValue.arrayUnion(categories[0]),
                });
            }
            else if(index === 2){
                setFav(false);
                setIsNewBook(true);
                setPagesRead(0);

                firestore().collection("users").doc(user.uid).update({
                    [`books.wishlist.${title}`]: {pagesRead: `${pageCount}`, id, image, pageCount, description, title, authors, categories, "stat": 2, "isFavorite": false},
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.currentlyReading.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.read.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`books.favorite.${title}`]: firestore.FieldValue.delete(),
                });
    
                firestore().collection("users").doc(user.uid).update({
                    [`suggestions.categories`]: firestore.FieldValue.arrayUnion(categories[0]),
                });
            }
        } catch (error) {
            console.log(error, "ERROR");
            navigation.navigate({name: data.current, params: {message: "error"}, merge: true});
        }
    }

    function pagesInput(pages) {
        const {pageCount} = data;
        if (pages > pageCount) {
            setWrongPageCount(true);
            setShowIcon(false);
        }
        else{
            setWrongPageCount(false);
            setPages(pages);
            setShowIcon(true);
        }
    }

    function markFav() {
        setFav(true);
        const {title} = data;

        if (idBtn === 0) {
            firestore().collection("users").doc(user.uid).update({
                [`books.read.${title}.isFavorite`]: true,
            });
        }
        else if (idBtn === 1) {
            firestore().collection("users").doc(user.uid).update({
                [`books.currentlyReading.${title}.isFavorite`]: true,
            });
        }

        if (fav) {
            setFav(false);
            if (idBtn === 0) {
                firestore().collection("users").doc(user.uid).update({
                    [`books.read.${title}.isFavorite`]: false,
                });
            }
            else if (idBtn === 1) {
                firestore().collection("users").doc(user.uid).update({
                    [`books.currentlyReading.${title}.isFavorite`]: false,
                });
            }

        }
    }
    
    function savePageCount(pages) {
        
        let currentYear = new Date(Date.now()).getFullYear();

        let currentDay = getDay();

        const {pageCount, pagesRead} = data;

        let currentWeek = getWeek(new Date(Date.now()));
        
        let pagesReadDay = pages - pagesRead;
        console.log(pagesReadDay);
        setPagesRead(Math.floor((pages/pageCount)*100));

        const {title} = data;
        firestore().collection("users").doc(user.uid).update({
            [`books.currentlyReading.${title}.pagesRead`]: pages,
        });
        
        if (fav) {
            firestore().collection("users").doc(user.uid).update({
                [`books.favorite.${title}.pagesRead`]: pages,
            });
        }

        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            
            const readingDays = documentSnapshot.data().years[currentYear][currentWeek];
            if (pagesRead === undefined) {
                pagesReadDay = pages;
            }
            
            readingDays[currentDay] = parseInt(readingDays[currentDay]) + parseInt(pagesReadDay);
            
            firestore().collection("users").doc(user.uid).update({
                [`years.${currentYear}.${currentWeek}`]: readingDays,
            });
        });

        Keyboard.dismiss();
        setShowIcon(false);
    }

    function deleteBook() {
        const {title} = data;
        console.log(idBtn, "ID");
        if (idBtn === 0) {
            firestore().collection("users").doc(user.uid).update({
                [`books.read.${title}`]: firebase.firestore.FieldValue.delete(),
            }).then(() => {
                navigation.navigate({name: data.current, params: {back: `${Date.now()}`}, merge: true});
            });
        }
        else if(idBtn === 1){
            firestore().collection("users").doc(user.uid).update({
                [`books.currentlyReading.${title}`]: firebase.firestore.FieldValue.delete(),
            }).then(() => {
                navigation.navigate({name: data.current, params: {back: `${Date.now()}`}, merge: true});
            });
        }
        else if(idBtn === 2){
            firestore().collection("users").doc(user.uid).update({
                [`books.wishlist.${title}`]: firebase.firestore.FieldValue.delete(),
            }).then(() => {
                navigation.navigate({name: data.current, params: {back: `${Date.now()}`}, merge: true});
            });
        }
        
    }

    function Back() {
        // nav.goBack();
        if (isNewBook) {
            setNewBook(Date.now());
        }
        navigation.navigate({name: data.current,});
    }

    return (
        <View style={{flex: 1, backgroundColor: "white", alignItems: "center"}}>
            <View style={{ width: "85%", }}>
                <FlatList keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} data={[data]} renderItem={(renderItem, index) => {
                    console.log(renderItem);
                    const {image, title, authors, description, pageCount} = data;
                    console.log(typeof pageCount, "TYPEOF");
                    return(
                        <View >
                            <Ionicons onPress={() => Back()} name="arrow-back" size={35} color="black"/>
                            <View style={{marginTop: 20, width: "50%", }}>
                                <Text style={{fontSize: 24, color: "black", fontWeight: "bold"}}>{title}</Text>
                                <Text style={{fontSize: 16, color: "black"}}>{authors[0]}</Text>
                            </View>
                            <View style={styles.containerBook}>
                                <View style={{width: "40%", alignItems: "flex-start", }}>
                                    <Image style={{width: 100, height: 150, resizeMode: "contain", borderRadius: 5,}} source={{uri:image}}/>
                                    <View style={styles.bar}>
                                        <View style={{width: `${pagesRead}%`, height: 8, backgroundColor: "#F54748", borderRadius: 50}}/>
                                    </View>
                                </View>
                                <View style={{justifyContent: "center", width: "60%"}}>
                                    <FlatList data={listOpts} renderItem={(renderItem, index) => {
                                        return (
                                            <TouchableWithoutFeedback onPress={() => checkBtn(renderItem.item.id)}>
                                                <View style={styles.optItem}>
                                                    <View style={{width: 20, height: 20, borderRadius: 50, borderColor: "#F54748", borderWidth: 4, backgroundColor: idBtn === renderItem.item.id ? "#F54748" : "transparent"}}/>
                                                    <Text style={styles.text}>{renderItem.item.opt}</Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                            )
                                        }} keyExtractor={(item, index) => {return item.id.toString()}}/>
                                </View>
                            </View>
                            {idBtn === 1 &&
                                <View style={{marginTop: 40}}>
                                    <Text style={{fontSize: 20, color: "black"}}>Update progress</Text>
                                    <View style={{flexDirection: "row", alignItems: "center", }}>
                                        <TextInput value={pages} style={{borderBottomWidth: 2, width: 50, fontSize: 18, padding: 0}} keyboardType="numeric" onChangeText={text => pagesInput(text)}/>
                                        <Text style={{fontSize: 18, color: "black"}}> pages of {pageCount}</Text>
                                        {showIcon && <Ionicons style={{marginLeft: 10}} name="checkmark-sharp" size={24} color="black" onPress={() => savePageCount(pages)} />}
                                    </View>
                                    {wrongPageCount && <Text style={{color: "#e63946", fontSize: 15}}>Can't be greater than {pageCount}</Text>}
                                </View>
                            }
                            {idBtn === 0 || idBtn === 1 ? 
                            <View style={{flexDirection: "row", marginTop: 40}}>
                                <Text style={{color: "#343F56", fontSize: 20}}>Mark as favorite</Text>
                                <TouchableWithoutFeedback onPress={() => markFav()}>
                                    <FontAwesome style={{marginLeft: 10}} name="bookmark" size={32} color={fav ? "#F54748" : "#343F56"} />
                                </TouchableWithoutFeedback>
                            </View> : null}
                            <View style={{marginTop: 40, marginBottom: 40}}>
                                <Text style={{fontSize: 20, color: "black", fontWeight: "bold"}}>Description</Text>
                                <Text style={styles.desc}>{description}</Text>
                            </View>
                            {idBtn <= 2 && <Text onPress={() => deleteBook()} style={styles.delete}>Delete Book</Text>}
                        </View>
                        
                    )
                }} keyExtractor={(item, index) => {return index.toString()}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerBook: {
        flexDirection: "row",
        marginTop: 15,
    },
    bar: {
        backgroundColor: "#F5E6CA",
        width: 100,
        height: 8,
        borderRadius: 50,
        marginTop: 7
    },
    optItem: {
        flexDirection: "row",
        padding: 10,
    },
    text: {
        marginLeft: 10, 
        fontSize: 15,
        color: "black"
    },
    desc: {
        color: "black",
        fontSize: 18
    },
    delete: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 40,
        color: "white",
        backgroundColor: "#F54748",
        width: 120,
        alignSelf: "center",
        padding: 5,
        borderRadius: 5,
        elevation: 3,
    }
});