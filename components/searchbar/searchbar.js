import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TextInput, Image, Dimensions } from 'react-native';
import SearchResult from "./search_results";
import { Ionicons } from '@expo/vector-icons';

import useDebounce from '../utils/useDebounce';

export default function SearchBar({tab}){

    const screenWidth = Math.ceil(Dimensions.get("window").width);

    const [results, setResults] = useState(null);

    const [showResults, setShowResults] = useState(false);

    const [search, setSearch] = useState("");

    const debouncedSearchTerm = useDebounce(search, 400);

    useEffect(() => {
        
        if (debouncedSearchTerm && debouncedSearchTerm.length >= 4) {
            query(debouncedSearchTerm).then(results => {
                setResults(results);
                setShowResults(true);
            }).catch(() => {
                setResults(null);
                setShowResults(false);
            });
        }
        else{
            setResults(null);
            setShowResults(false);
        }

    }, [debouncedSearchTerm]);

    function textInput(text) {
        
        if (text.length > 0) {
            setText(text);
            search(text);
            setShowResults(true);
        }
        else{
            setShowResults(false);
            setResults([]);
            setText("");
        }
        
    }

    function cleanInput() {
        setSearch(null);
        setShowResults(false)
    }

    async function query(text) {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=5&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/language, id)`);

        const data = await res.json();

        return data.items;
    }

    return (
        <View style={[styles.container, {width: screenWidth}]}>
            <View style={styles.searchBar}>
                <TextInput style={styles.input} value={search} placeholder="search by author or title" onChangeText={text => setSearch(text)} />
                {showResults ? <Ionicons style={{width: "10%"}} onPress={() => cleanInput()} name="close" size={24} color="#F54748"/> : <View style={{width: "10%"}}/>}
                <Image style={styles.image} source={require("../../assets/search_icon.png")}/>
            </View>
            {showResults ? <SearchResult results={results} tab={tab}  setShowResults={setShowResults}/> : null}
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
        width: "80%"
    },
    image: {
        width: "10%",
        resizeMode: "contain",
        flex: 1
    },
});