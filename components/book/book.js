import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {BookContext} from "../utils/context_book";
import firestore, { firebase } from '@react-native-firebase/firestore';
import {UserContext} from "../utils/user_context";
import { NewBookContext } from '../utils/context_newBook';
import { getWeek, getDay } from '../utils/get_date';

import BookComp from './book_component';

export default function Book({route, navigation}) {

    const {user} = useContext(UserContext);

    const {newBook, setNewBook} = useContext(NewBookContext);

    const { data } = route.params;

    const {id} = useContext(BookContext);
    
    const listOpts = [{id: 0, opt: 'Read'}, {id: 1, opt: "Currently reading"}, {id: 2, opt: "Wishlist"}];

    const [score, setScore] = useState([{score: 1, "status": false, id: 1}, {score: 2, "status": false, id: 2}, {score: 3, "status": false, id: 3}, {score: 4, "status": false, id: 4}, {score: 5, "status": false, id: 5}]);

    const [idBtn, setIdBtn] = useState(4);

    const [fav, setFav] = useState(false);

    const [pages, setPages] = useState("");

    const [wrongPageCount, setWrongPageCount] = useState(false);

    const [pagesRead, setPagesRead] = useState(0);

    const [isNewBook, setIsNewBook] = useState(false);

    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        setIdBtn(data.stat);
        
        setScore(prev => {

            let object = prev;

            object.forEach(o => {
                if (o.id <= data.score) {
                    o.status = true;
                }
                else{
                    o.status = false;
                }
            })
            return [...prev];
        });
        setPages(data.pagesRead);
        if (data.isFavorite) {
            setFav(true);
        }
        if (data.status) {
            const {pageCount, pagesRead} = data;
            setPagesRead(Math.floor((pagesRead/pageCount)*100));
        }
    }, [data]);
    
    function checkBtn(index) {
        setIdBtn(index);

        const {authors, image, pageCount, title, description, categories } = data;

        try {
            if (index === 0) {
                
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
        
        if (isNewBook) {
            setNewBook(Date.now());
        }
        navigation.navigate({name: data.current,});
    }

    function makeScore(index) {
        
        const {title} = data;

        firestore().collection("users").doc(user.uid).update({
            [`books.read.${title}.score`]: index,
        })

        setScore(prev => {

            let object = prev;

            object.forEach(o => {
                if (o.id <= index) {
                    o.status = true;
                }
                else{
                    o.status = false;
                }
            })
            return [...prev];
        });
    }

    return (
        <View style={{flex: 1, backgroundColor: "white", alignItems: "center"}}>
            <View style={{ width: "85%", }}>
                <BookComp data={data} pagesRead={pagesRead} listOpts={listOpts} idBtn={idBtn} score={score} fav={fav} Back={Back} makeScore={makeScore} markFav={markFav} checkBtn={checkBtn} pages={pages} showIcon={showIcon} deleteBook={deleteBook} savePageCount={savePageCount} pagesInput={pagesInput} wrongPageCount={wrongPageCount}/>
            </View>
        </View>
    )
}