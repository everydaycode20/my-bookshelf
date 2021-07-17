import React, {useState, useContext, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableWithoutFeedback, FlatList, Keyboard } from 'react-native';
import { GoogleSignin, } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {AuthContext} from "./utils/context_auth";
import {UserContext} from "./utils/user_context";
import firestore from "@react-native-firebase/firestore";
import { getWeek } from './utils/get_date';
import { Ionicons, } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';

import { getTotalPagesInYear } from './utils/get_date';

import { useNavigation } from '@react-navigation/native';

export default function Profile(){

    const navigation = useNavigation();

    const {setLogin} = useContext(AuthContext);

    const {user} = useContext(UserContext);

    const [totalBooks, setTotalBooks] = useState("-");
    
    const [totalReading, setTotalReading] = useState("-");

    const [totalWishlist, setTotalWishlist] = useState("-");

    const [readingWeek, setReadingWeek] = useState([]);

    const [pages, setPages] = useState("");

    const [showIcon, setShowIcon] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getProgress();
        }, [])
    );

    function getProgress() {
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot   => {
            if (documentSnapshot.exists) {

                let currentYear = new Date(Date.now()).getFullYear();

                const readingData = documentSnapshot.data().years[currentYear];

                const currentlyReadingArr = Object.keys(documentSnapshot.data().books.currentlyReading);

                const readArr = Object.keys(documentSnapshot.data().books.read);

                const wishlistArr = Object.keys(documentSnapshot.data().books.wishlist);

                setTotalBooks(currentlyReadingArr.length + readArr.length);
                
                setTotalReading(currentlyReadingArr.length);
                
                setTotalWishlist(wishlistArr.length);

                const week = getWeek(new Date(Date.now()));
                
                for (const key in readingData) {
                    // console.log(readingData[key]);
                    if (parseInt(key) === week) {
                        setReadingWeek(readingData[key])
                    }
                }
                setPages(documentSnapshot.data().pageGoal);

                const years = documentSnapshot.data().years;

                let totalPagesRead = getTotalPagesInYear(Object.values(years));

                firestore().collection("users").doc(user.uid).update({
                    [`years.${currentYear}.pagesRead`]: totalPagesRead,
                });
            }
        });
    }
    
    const signOut = async () => {
        try {
            // await GoogleSignin.revokeAccess();
            // await GoogleSignin.signOut();
            auth().signOut().then(() => console.log("signed out"));
            setLogin(false);
        } catch (error) {
            console.error(error);
        }
    }

    function setNewPageGoal(pages) {
        if (pages >= 1) {
            setShowIcon(true);
            setPages(pages);
        }
        else{
            setPages("");
            setShowIcon(false);
        }
    }

    function savePageGoal(pages) {
        firestore().collection("users").doc(user.uid).update({
            [`pageGoal`]: pages,
        });
        Keyboard.dismiss();
        setShowIcon(false);
    }

    return (
        <View style={{width: "100%", alignItems: "center", flex: 1, backgroundColor: "white"}}>
            <View style={{width: "80%", marginTop: 20}}>
                <Text style={{color: "black", fontSize: 25}}>Profile</Text>
                <View style={styles.profile}>
                    <Image style={styles.image} source={{uri: user.photoURL || "https://res.cloudinary.com/dzsr3ncf1/image/upload/v1624215370/logo_user_g2ifpt.png"}}/>
                    <Text style={{color: "black", fontSize: 20, marginLeft: 10}}>{user.displayName || user.email}</Text>
                </View>
                <View style={styles.listBooks}>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.textBook}>Books</Text>
                        <Text style={[styles.textBook, {fontWeight: "bold"}]}>{totalBooks}</Text>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.textBook}>Currently reading</Text>
                        <Text style={[styles.textBook, {fontWeight: "bold"}]}>{totalReading}</Text>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.textBook}>Wishlist</Text>
                        <Text style={[styles.textBook, {fontWeight: "bold"}]}>{totalWishlist}</Text>
                    </View>
                </View>
                <View style={{marginTop: 50}}>
                    <View style={styles.barContainer}>
                        <Text style={{fontSize: 18, color: "black", marginBottom: 10}}>pages read this week</Text>
                        <View style={{height: 100,  alignItems: "center", }}>
                            <FlatList horizontal={true} data={readingWeek} renderItem={(renderItem, index) => {
                                const days = ["sun", "mon", "tue", "wed", "thr", "fri", "sat"];
                                const percentage = Math.floor((renderItem.item/pages)*100);
                                return (
                                    <View style={{alignItems: "center", marginLeft: 8, marginRight: 8}}>
                                        <View style={styles.bar}>
                                            <View style={{width: "100%", height: percentage >= 100 ? "100%" : `${percentage}%`, backgroundColor: "#F54748", borderRadius: 50}}/>
                                        </View>
                                        <Text>{days[renderItem.index]}</Text>
                                    </View>
                                )
                            }} keyExtractor={(item, index) => {return index.toString()}}/>
                        </View>
                    </View>
                </View>
                <View>
                    <Text onPress={() => navigation.navigate({name: "Stats"})} style={{color: "black", fontSize: 18, marginTop: 10, alignSelf: "flex-end"}}>see more stats</Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center", alignSelf: "center", marginTop: 20}}>
                    <Text style={{color: "black", fontSize: 16}}>Set reading goal per day: </Text>
                    <TextInput value={pages} onChangeText={text => setNewPageGoal(text)} style={{borderBottomWidth: 1, padding: 0, marginLeft: 5, marginRight: 5}} keyboardType="numeric"/>
                    <Text style={{color: "black", fontSize: 16}}>pages</Text>
                    {showIcon && <Ionicons style={{marginLeft: 10}} name="checkmark-sharp" size={24} color="black" onPress={() => savePageGoal(pages)} />}
                </View>
                <TouchableWithoutFeedback onPress={() => signOut()}>
                    <View style={styles.logout}>
                        <Text style={{color: "white", fontSize: 20, textAlign: "center"}}>Log out</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    profile: {
        flexDirection: 'row',
        alignContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    listBooks: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
    },
    textBook: {
        color: "black", 
        fontSize: 18
    },
    logout: {
        backgroundColor: "#F54748",
        borderRadius: 10,
        alignSelf: "center",
        padding: 10,
        marginTop: 50
    },
    barContainer: {
        backgroundColor: "#D2CDCD",
        height: 160,
        padding: 15,
        borderRadius: 25,
        // alignContent: "space-between",
        // width: "100%",

    },
    bar: {
        backgroundColor: "#F5E6CA",
        width: 8,
        height: 80,
        flexDirection: "column-reverse",
        borderRadius: 50
    }
})