import React, {useState, useContext, useEffect} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppRegistry, TouchableWithoutFeedback} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import useDebounce from '../utils/useDebounce';
import { Ionicons } from '@expo/vector-icons'; 

function ErrorMessage({setErrorMessage}) {
    
    return (
        <View style={styles.containerError}>
            <Text style={{color: "black", fontSize: 18}}>Book information not found</Text>
            <TouchableWithoutFeedback onPress={() => setErrorMessage(false)}><Text style={{backgroundColor: "#F54748", fontSize: 20, paddingLeft: 10, paddingRight: 10, color: "white", borderRadius: 5, marginTop: 10}}>ok</Text></TouchableWithoutFeedback>
        </View>
    );
}

export default function Camera(){

    const navigation = useNavigation();
    
    const [barCode, setBarCode] = useState("");

    const debouncedSearchTerm = useDebounce(barCode, 400);

    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        
        if (debouncedSearchTerm) {
            search(debouncedSearchTerm).then(results => {
                
                if (results.items === undefined) {
                    setErrorMessage(true);
                }
                else{
                    const {authors, imageLinks, pageCount, title, categories, description = "description not available"} = results.items[0].volumeInfo;

                    let obj = {"authors": authors, "image": imageLinks.smallThumbnail.replace("http", "https"), "pageCount": pageCount, "title": title, "description": description, "categories": categories};
                    navigation.navigate("Book", {data: obj});
                }
            });
        }

    }, [debouncedSearchTerm])

    async function search(text) {
        console.log(text);
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${text}&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/language,volumeInfo/imageLinks,volumeInfo/description,volumeInfo/pageCount,volumeInfo/language,volumeInfo/categories, id)`);

        const data = res.json();

        return data;
    }
    
    return (
        <View style={styles.container}>
            <Ionicons style={{alignSelf: "flex-start", position: "absolute", top: 5, marginLeft: 10}} onPress={() => navigation.goBack()} name="arrow-back" size={35} color="black"/>
            <RNCamera style={styles.preview} type={RNCamera.Constants.Type.back} captureAudio={false} androidCameraPermissionOptions={{ title: 'Permission to use camera', message: 'We need your permission to use your camera', buttonPositive: 'Ok', buttonNegative: 'Cancel', }} onGoogleVisionBarcodesDetected={({ barcodes }) => {

                if (barcodes.length > 0) {
                    setBarCode(barcodes[0].data);
                }
            }}>
            </RNCamera>
            {errorMessage && <ErrorMessage setErrorMessage={setErrorMessage}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center"
    },
    preview: {
        height: 500,
        width: "100%"
    },
    containerError: {
        backgroundColor: "white",
        position: "absolute",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    }
});