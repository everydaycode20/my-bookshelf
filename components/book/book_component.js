import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, FlatList, TouchableWithoutFeedback } from 'react-native';

import { Ionicons, FontAwesome } from '@expo/vector-icons'; 

export default function BookComp({data, pagesRead, listOpts, idBtn, score, fav, Back, makeScore, markFav, checkBtn, pages, deleteBook, savePageCount, pagesInput, wrongPageCount, showIcon}){
    
    return (
        <FlatList keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} data={[data]} renderItem={(renderItem, index) => {
                    
            const {image, title, authors, description, pageCount} = data;
            
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
                    {idBtn === 0 && 
                    <View style={{marginTop: 20}}>
                        <FlatList horizontal={true} data={score} renderItem={({item, index}) => {
                            return <FontAwesome name="star" size={24} color={item.status === true ? "#F54748" : "#343F56"} onPress={() => makeScore(item.score)} />
                        }} keyExtractor={(item, index) => {return index.toString()}}/>
                    </View>}
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