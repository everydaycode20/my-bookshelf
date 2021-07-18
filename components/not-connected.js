import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback } from 'react-native';

export default function Connected({setRefresh}) {
    

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <StatusBar barStyle = "dark-content" backgroundColor="white"/>
            <View style={{width: "80%", alignItems: "center", }}>
                <Text style={{fontSize: 18, color: "black", textAlign: "center", marginBottom: 30}}>Looks like you don't have internet, check your connection.</Text>
                <TouchableWithoutFeedback onPress={() => setRefresh(new Date())}>
                    <Text style={styles.button}>Try again</Text>
                </TouchableWithoutFeedback>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#F54748",
        color: "white",
        padding: 7,
        borderRadius: 5,
        fontSize: 18,
    }
})