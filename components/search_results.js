import React, {useContext,} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {BookContext} from "./utils/context_book";

export default function SearchResult({results, setShowResults, tab, setText}) {
    
    const navigation = useNavigation();

    const {setId} = useContext(BookContext);

    function Separator() {
        
        return (
            <View style={{height: 0.7, width: "100%", backgroundColor: "#F54748"}}/>
        )
    }   

    function getBook(id) {
        
        setId(id);
        setShowResults(false);
        setText("");
        fetch(`https://www.googleapis.com/books/v1/volumes/${id}`).then(res => res.json()).then(data => {
            const {authors, imageLinks, pageCount, title, categories, description} = data.volumeInfo;

            let page = pageCount;
            let img = imageLinks;
            
            let category = categories;
            if (img === undefined) {
                img = "https://res.cloudinary.com/dzsr3ncf1/image/upload/v1623427401/img_not_available_ojjucr.png";
            }
            if (category === undefined) {
                category = "";
            }

            if (page === undefined) {
                page = 0;
            }

            if (authors === undefined || description === undefined || pageCount === undefined || title === undefined) {
                navigation.navigate({name: tab, params: {message: "error", id: Date.now()}, merge: true});
            }
            else{
                let obj = {"authors": authors, "image": img.smallThumbnail.replace("http", "https") || img, "pageCount": page, "title": title, "description": description, "categories": category, current: tab};
                navigation.navigate("Book", {data: obj});
            }
            

        }).catch((err) => {
            console.log(err, "ERR");
        });
    }

    return (
        <View style={[styles.containerResult, ]}>
            <FlatList keyboardShouldPersistTaps="handled" ItemSeparatorComponent={Separator} data={results} renderItem={(renderItem, i) => {
                let sbs = "";
                let author = "";
                
                if (renderItem.item.volumeInfo.title !== undefined){

                    if (renderItem.item.volumeInfo.title.length >= 50) {
                        sbs = renderItem.item.volumeInfo.title.substring(0,40) + "...";
                    }
                    else{
                        sbs = renderItem.item.volumeInfo.title;
                    }

                    if (renderItem.item.volumeInfo.authors === undefined) {
                        author = "unknown";
                    }
                    else{
                        if (renderItem.item.volumeInfo.authors[0].length >= 30) {
                            author = renderItem.item.volumeInfo.authors[0].substring(0, 30) + "...";
                        }
                        else{
                            author = renderItem.item.volumeInfo.authors[0];
                        }
                    } 
                }
                

                return (
                    <TouchableWithoutFeedback onPress={() => getBook(renderItem.item.id)}>
                        <View style={{backgroundColor: "#F2F2F2", paddingLeft: 4}}>
                            <View style={styles.result}>
                                <Text style={{fontSize: 16, color: "black"}}>{sbs}</Text>
                                <Text>{author}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }} keyExtractor={(item, index) => {return item.id.toString()}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    result: {
        padding: 4,
        
    },
    containerResult: {
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 5
    }
});