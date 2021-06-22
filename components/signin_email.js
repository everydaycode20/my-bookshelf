import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function SigninEmail() {
    
    const [showPassword, setShowPassword] = useState(true);

    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [isUSer, setIsUser] = useState(true);

    const [isValidEmail, setIsValidEmail] = useState(true);

    const [emptyEmail, setEmptyEmail] = useState(false);

    const [emptyPass, setEmptyPass] = useState(false);

    const nav = useNavigation();
    
    function login() {

        if (email === "" ) {
            setEmptyEmail(true);
        }
        else{
            setEmptyEmail(false);
        }
        if (password === "") {
            setEmptyPass(true);
        }
        else{
            setEmptyPass(false); 
        }
        if(email !== "" && password !== ""){
            auth()
            .signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log(userCredential);
                console.log('User signed in!');
            })
            .catch(error => {
            
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    setIsUser(true);
                    setIsValidEmail(false)
                }

                if (error.code === "auth/user-not-found") {
                    console.log("user not found");
                    setIsUser(false);
                    setIsValidEmail(true);
                }
                
                if (error.code === "auth/wrong-password") {
                    setIsUser(false);
                    setIsValidEmail(true);
                }

            });
        }
    }

    function showPass() {
        setShowPassword(false);

        if (!showPassword) {
            setShowPassword(true);
        }
    }

    function back() {
        nav.navigate("Login");
    }

    function testEmail(text) {

        setEmail(text);
    }

    function testPassword(text) {
        setPassword(text);
    }

    return (
        <View style={{backgroundColor: "white", flex: 1, }}>
            <View style={{flexDirection: "row", alignItems: "center", marginLeft: 20, marginTop: 20}}>
                <Ionicons onPress={() => back()} name="arrow-back" size={35} color="black"/>
                <Text style={{fontSize: 24, color: "black"}}>Sign in</Text>
            </View>
            <View style={styles.container}>
                <View style={{justifyContent: "center", alignSelf: "center", marginTop: 40}}>
                    <Text style={{color: "black", fontSize: 18}}>Email</Text>
                    <TextInput style={styles.input} keyboardType={"email-address"} autoCapitalize="none" onChangeText={text => testEmail(text)} placeholder="example@example.com"/>
                    {!isUSer && <Text style={styles.errorMsg}>Incorrect email or password</Text>}
                    {!isValidEmail && <Text style={styles.errorMsg}>Email invalid</Text>}
                    {emptyEmail && <Text style={styles.errorMsg}>Email is missing</Text>}
                </View>
                <View style={{justifyContent: "center", alignSelf: "center", marginTop: 20}}>
                    <Text style={{color: "black", fontSize: 18}}>Password</Text>
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <TextInput style={styles.input} secureTextEntry={showPassword ? true : false} onChangeText={text => testPassword(text)}/>
                        <Feather onPress={() => showPass()} name={showPassword ? "eye" : "eye-off"} size={24} color="black" style={{position: "absolute", top: 0, left: "100%"}}/>
                    </View>
                    {emptyPass && <Text style={styles.errorMsg}>Password is missing</Text>}
                </View>
                <TouchableWithoutFeedback onPress={() => login()}>
                    <Text style={styles.btn}>Sign in</Text>
                </TouchableWithoutFeedback>
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },
    input: {
        borderBottomWidth: 1,
        padding: 0,
        width: 200,
        fontSize: 16,
        
    },
    btn: {
        backgroundColor: "#F54748",
        fontSize: 18,
        color: "white",
        width: 100,
        padding: 5,
        borderRadius: 5,
        textAlign: "center",
        marginBottom: 15,
        elevation: 3,
        marginTop: 20,
    },
    errorMsg: {
        color: "#D83A56",
        fontSize: 16,
        
    }
});