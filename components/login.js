import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

export default function Login({ route}) {

    const navigation = useNavigation();

    function toLoginEmail() {
        navigation.navigate("Signup-Email");
    }

    return (
        <View style={styles.container}>
            <View style={{width: "80%", justifyContent: "flex-start", alignItems: "center", flex: 1}}>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 25, marginTop: 100}}>
                    <Image style={{width: 40, height: 40}} source={require("../assets/icon_mb.png")}/>
                    <Text style={{fontSize: 35, color: "black"}}>My Bookshelf</Text>
                </View>
                
                <Text style={{color: "black", fontSize: 16, textAlign: "center", marginBottom: 25,}}>Sign up or Sign in to track your reading progress, 
                add books and find new suggestions.</Text>
                <Text style={styles.btn} onPress={() => toLoginEmail()}>Use your Email</Text>
                <GoogleSigninButton style={{width: 192, height: 48}} size={GoogleSigninButton.Size.Wide} onPress={() => route.params.event()}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 250,
        height: "100%",
        resizeMode: "contain",
    },
    btn: {
        backgroundColor: "#F54748",
        fontSize: 18,
        color: "white",
        width: 150,
        padding: 5,
        borderRadius: 5,
        textAlign: "center",
        marginBottom: 15,
        elevation: 3
    },

});