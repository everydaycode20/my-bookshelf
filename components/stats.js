import React, {useState, useContext, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

import {UserContext} from "./utils/user_context";

import { getWeeksArranged } from './utils/get_date';

import firestore from "@react-native-firebase/firestore";

export default function Stats() {
    
    const nav = useNavigation();

    const {user, setUser} = useContext(UserContext);

    const [readingData, setReadingData] = useState(null);

    const [pages, setPages] = useState(0);
    
    const [pagesReadInYear, setPagesReadInYear] = useState(0);

    const [yearsList, setYearsList] = useState();

    const [selectedYear, setSelectedYear] = useState("");
    
    useEffect(() => {
        
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            
            if (documentSnapshot.exists) {
                const obj = documentSnapshot.data().years[new Date(Date.now()).getFullYear()];

                setSelectedYear(new Date(Date.now()).getFullYear());

                const years = Object.keys(documentSnapshot.data().years);
                
                const yearsSort = years.sort((b,a) => a - b);
                
                setYearsList(yearsSort);

                const mergedArr = getWeeksArranged(obj);
                
                setReadingData(mergedArr);
                setPages(documentSnapshot.data().pageGoal);

                setPagesReadInYear(documentSnapshot.data().years[new Date(Date.now()).getFullYear()].pagesRead);
                
            }
        });

    }, []);

    const selectYear = (year) => {

        setSelectedYear(year);

        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            
            if (documentSnapshot.exists) {
                
                const obj = documentSnapshot.data().years[year];

                const mergedArr = getWeeksArranged(obj);
                
                setReadingData(mergedArr);
                setPagesReadInYear(documentSnapshot.data().years[year].pagesRead);
            }
        });
    };

    const Item = ({item}) => {

        let squareColor = "";
        let borderColor = "";
        let percentageRead = (item / pages) * 100;

        if (item === "x") {
            squareColor = "white";
            borderColor = "white";
        }
        else if(percentageRead >= 1 && percentageRead <= 25){
            squareColor = "#FFAF69";
            borderColor = "#FFAF69";
        }
        else if (percentageRead >= 26 && percentageRead <= 50) {
            squareColor = "#F29849";
            borderColor = "#F29849";
        }
        else if (percentageRead >= 51 && percentageRead <= 75) {
            squareColor = "#EB7610";
            borderColor = "#EB7610";
        }
        else if (percentageRead >= 76 && percentageRead <= 100) {
            squareColor = "#B05200";
            borderColor = "#B05200";
        }
        else{
            squareColor = "#DEDEDE";
            borderColor = "#C7C7C7";
        }

        return <View >
            <View style={{  width: 15, height: 15, backgroundColor: squareColor, marginLeft: 1, marginRight: 1, marginTop: 1, marginBottom: 1, borderRadius: 2, borderColor: borderColor, borderWidth: 1, zIndex: 100}}></View>
        </View>
    }

    const renderItem = ({item}) => (
        <Item item={item}/>
    )

    return(
        <View style={{flex: 1, backgroundColor: "white", alignItems: "center",  }}>
            {readingData && 
            <View style={{width: "90%", }}>
                <Ionicons onPress={() => nav.goBack()} style={{marginBottom: 20}} name="arrow-back" size={35} color="black"/>
            </View>}
            
            {readingData && <View style={[styles.list,{flexDirection: "row"}]}>
                <FlatList horizontal={true} data={yearsList} renderItem={({item, index}) => {
                    
                    return(
                        <TouchableWithoutFeedback onPress={() => selectYear(item)} >
                            <View style={{zIndex: 1, backgroundColor: selectedYear.toString() === item ? "#d8d8d8ff" : "white", borderRadius: 5, padding: 5,}}>
                                <Text style={{fontSize: 16, color: "black", }}>{item}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        
                    )
                }} keyExtractor={(item, index) => {return index.toString()}}/>

            </View>}

            {readingData && <View style={{ width: "80%",  flexDirection: "row"}}>
            
            <View style={{ height: "77%", marginRight: 4, marginTop: 35}}>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false, flex: 1}}>Su</Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false}}></Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false, flex: 1}}>Tu</Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false}}></Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false}}>Th</Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false}}></Text>
                <Text style={{fontSize: 13, color: "black", includeFontPadding: false}}>Sa</Text>
            </View>
            
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                <View style={{marginTop: 20, }}>
                <View style={{flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 13, color: "black" }}>Jan</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Feb</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Mar</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Apr</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>May</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Jun</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Jul</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Aug</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Sep</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Oct</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Nov</Text>
                    <Text style={{ fontSize: 13, color: "black" }}>Dec</Text>
                </View>

                <FlatList numColumns={Math.ceil(readingData.length/7)} data={readingData} renderItem={renderItem} keyExtractor={(item, index) => { return index.toString()}}/>
                </View>
            </ScrollView>
            
            </View>}
            {readingData && <View style={styles.containerText}>
                {new Date(Date.now()).getFullYear().toString() === selectedYear.toString() ? <Text style={{color: "black", fontSize: 16}}>You have read {pagesReadInYear} pages this year</Text> : <Text style={{color: "black", fontSize: 16}}>You read {pagesReadInYear} pages in {selectedYear}</Text>}
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    containerText: {
        marginTop: 20,
        width: "80%",

    },
    list: {
        padding: 10,
        paddingRight: 15,
        paddingLeft: 15,
        backgroundColor: "white",
        // borderRadius: 10,
        borderBottomColor: "black",
        marginBottom: 10,
        borderBottomWidth: 0.5,
    }
})