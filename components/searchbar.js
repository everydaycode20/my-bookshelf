import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, StatusBar, Image, FlatList, Dimensions } from 'react-native';
import SearchResult from "./search_results";

export default function SearchBar({tab}){

    const screenWidth = Math.ceil(Dimensions.get("window").width);

    const [text, setText] = useState("");

    const [results, setResults] = useState([]);

    const [showResults, setShowResults] = useState(false);

    function textInput(text) {
        // setText(t);
        if (text !== "") {
            setText(text);
            search(text);
        }
        else{
            setShowResults(false);
            // console.log("WMPTRY");
            setResults([]);
            setText("");
        }
        
    }

    function search(text) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=5&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/language, id)`).then(res => res.json()).then(data => {

            setResults(data.items);
            setShowResults(true);
            
        });

    }

    return (
        <View style={[styles.container, {width: screenWidth}]}>
            <View style={styles.searchBar}>
                <TextInput style={styles.input} value={text} placeholder="search by author or title" onChangeText={text => textInput(text)} />
                <Image style={styles.image} source={require("../assets/search_icon.png")}/>
            </View>
            {showResults === true ? <SearchResult results={results} tab={tab} setText={setText} setShowResults={setShowResults}/> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // width: "100%",
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    searchBar: {
        backgroundColor: "#F2F2F2",
        padding: 10,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        width: "80%"
    },
    input: {
        fontSize: 18,
        width: "90%"
    },
    image: {
        width: "10%",
        resizeMode: "contain",
        flex: 1
    },
});