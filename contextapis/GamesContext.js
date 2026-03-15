import { createContext,useContext } from "react";
import { useState } from "react";
import Fruits from "../assets/data/collections/fruits.json"
import Animals from "../assets/data/collections/animals.json"
import Places from "../assets/data/collections/places.json"
import {useDictionary} from "./DictContext"

const GameContext = createContext();

export const GameProvider = ({children}) => {
    const collections = {fruits:Fruits,animals:Animals,places:Places}
    const {getWords} = useDictionary();
    const [questions,setQuestions] = useState([])
    const [source,setSource] = useState(null)
    const [value,setValue] = useState(null)
    const [numberQuestion,setNumberQuestion] = useState(5)
    const [seconds,setSeconds] = useState(5)
    const [hints,setHints] = useState(0)
    const [visibleFirstLetter,setVisibleFirstLetter] = useState()
    const [numberOptions,setnumberOptions] = useState(4)
    const [perPage,setPerPage] = useState(4)
    const [userAnswers,setUserAnswers] = useState([])
    const [gameType,setGameType] = useState()
    let data;
    let tempQuestions=[];

    const randomIndexCreater = ({target_words = null, length = null}) => {
        if (length != null) {
            const random_index = Math.floor(Math.random() * length)
            return random_index
        }
        if (target_words != null) {
            const random_index = Math.floor(Math.random() * target_words.length)
            return random_index
        }
    }

    const optionCreater = ({words, answer_index}) => {
        let options = []
        let used_indexes = new Set()
        let used_option_index = new Set()
        used_indexes.add(answer_index)
        const correctAnswerIndex = randomIndexCreater({target_words:null,length:numberOptions})
        options[correctAnswerIndex] = words[answer_index].tr || words[answer_index].meaning
        used_option_index.add(correctAnswerIndex)
        for (let i = 1; i <= numberOptions-1 ; i++) {
            let random_index;
            let random_option_index;
            do {
                random_index = randomIndexCreater({target_words:words,length:null})
            } while (used_indexes.has(random_index));

            used_indexes.add(random_index)

            do {
                random_option_index = randomIndexCreater({target_words:null,length:numberOptions})
            } while (used_option_index.has(random_option_index));

            used_option_index.add(random_option_index)

            options[random_option_index] = words[random_index].tr || words[random_index].meaning
        }
        return {options,correctAnswerIndex}
    }

    const createQuestion = () =>{
        if (source=="collection") {
            data = collections[value]
        }
        else if (source=="personal"){
            data = getWords(value)
        }
        let usedIndex = new Set();
        for (let i = 1; i <= numberQuestion; i++) {
            let random_index;
            do {
                random_index = randomIndexCreater({target_words:data,length:null})
            } while (usedIndex.has(random_index));
            usedIndex.add(random_index)

            const question = data[random_index].en || data[random_index].word
            const answer = data[random_index].tr || data[random_index].meaning
            switch (gameType) {
                case "mcq":
                    const {options,correctAnswerIndex} = optionCreater({words:data,answer_index:random_index})
                    tempQuestions.push({id:i,question,answer,options,correctAnswerIndex})
                    break;
                case "wc":
                    tempQuestions.push({id:i,question,answer})
                    break;
                case "mp":
                    tempQuestions.push({id:i,question,answer})
                    break;
                default:
                    break;
            }
        }
        setQuestions(tempQuestions)
    }

    return (<GameContext.Provider value={{source,setSource,value,setValue,numberQuestion,
        setNumberQuestion,seconds,setSeconds,hints,setHints,visibleFirstLetter,setVisibleFirstLetter,
        numberOptions,setnumberOptions,perPage,setPerPage,createQuestion,
        questions,userAnswers,setUserAnswers,setGameType,gameType,randomIndexCreater}}>{children}</GameContext.Provider>)
}

export const useGame = ()=>{
    const context = useContext(GameContext)
    return context
}