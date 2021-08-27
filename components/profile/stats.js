import React, {useState, useContext, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';

import {UserContext} from "../utils/user_context";

import { getWeeksArranged } from '../utils/get_date';

import firestore from "@react-native-firebase/firestore";

import StatsComp from './stats_component';

export default function Stats() {
    
    const nav = useNavigation();

    const {user} = useContext(UserContext);

    const [readingData, setReadingData] = useState(null);

    const [pages, setPages] = useState(0);
    
    const [pagesReadInYear, setPagesReadInYear] = useState(0);

    const [yearsList, setYearsList] = useState();

    const [selectedYear, setSelectedYear] = useState(new Date(Date.now()).getFullYear());
    
    const [year, setYear] = useState("");

    const [isDataFetched, setIsDataFetched] = useState(false);

    const [colors, setColors] = useState(["white", "white", "white"]);

    const [score, setScore] = useState({score: 0, length: 0});

    const [longestBook, setLongestBook] = useState({});

    useEffect(() => {
        
        firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            
            if (documentSnapshot.exists) {

                const currentYear = new Date(Date.now()).getFullYear();

                const obj = documentSnapshot.data().years[currentYear];

                const scoreBooksRead = documentSnapshot.data().books.read;
                
                let tempScore = 0;

                let longestRead = {"title": "", "pages": 0};

                for (const key in scoreBooksRead) {
                    
                    tempScore += scoreBooksRead[key].score;
                    
                    if (parseInt(scoreBooksRead[key].pagesRead) > parseInt(longestRead.pages)) {
                        longestRead.pages = scoreBooksRead[key].pagesRead;
                        longestRead.title = scoreBooksRead[key].title;
                    }
                }
                
                setLongestBook(longestRead);

                let scoreLength = Object.keys(scoreBooksRead).length;
                
                setScore(prev => ({...prev, score: tempScore, length: scoreLength}));

                setSelectedYear(currentYear);
                setYear(currentYear);
                const years = Object.keys(documentSnapshot.data().years);
                
                const yearsSort = years.sort((b,a) => a - b);
                
                setYearsList(yearsSort);

                const mergedArr = getWeeksArranged(obj, currentYear);
                
                setReadingData(prev => ({...prev, [currentYear]: mergedArr[currentYear]}));
                
                setPages(documentSnapshot.data().pageGoal);

                const pagesRead = documentSnapshot.data().years[currentYear].pagesRead;

                setPagesReadInYear(prev => ({...prev, [currentYear]: pagesRead}));
                setIsDataFetched(true);
            }
        });

    }, []);

    const selectYear = (year) => {

        setColors(["#ffffff00","#ffffff4d","#C7C7C7"]);
        setIsDataFetched(false);
        setSelectedYear(year);

        const obj = Object.keys(readingData).includes(year);
        
        if (obj === true) {
            setYear(year);
            setIsDataFetched(true);
        }
        else{  
            firestore().collection("users").doc(user.uid).get().then(documentSnapshot => {
            
                if (documentSnapshot.exists) {
                    
                    const obj = documentSnapshot.data().years[year];

                    const mergedArr = getWeeksArranged(obj, year);
                    
                    setReadingData(prev => ({...prev, [year]: mergedArr[year]}));

                    const pagesRead = documentSnapshot.data().years[year].pagesRead;

                    setPagesReadInYear(prev => ({...prev, [year]: pagesRead}));
                    setYear(year);
                    setIsDataFetched(true);
                }
            });
        }
        
    };

    return <StatsComp colors={colors} readingData={readingData} yearsList={yearsList} isDataFetched={isDataFetched} year={year} colors={colors} selectedYear={selectedYear} pagesReadInYear={pagesReadInYear} pages={pages} selectYear={selectYear} nav={nav} score={score} longestBook={longestBook}/>

}