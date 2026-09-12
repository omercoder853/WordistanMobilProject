import { createContext, useContext, useState, useEffect } from "react";
import Fruits from "@/shared/data/collections/fruits.json";
import Animals from "@/shared/data/collections/animals.json";
import Places from "@/shared/data/collections/places.json";
import { useDictionary } from "./DictContext";
import { ENDPOINTS } from "../constants/ApiConfig";
import { useAuth } from "./AuthContext";
import { useUserStats } from "./UserStatsContext";
import { apiClient } from "../services/ApiClient";

const GameContext = createContext();

const DEFAULT_SETTINGS = {
    gameType: null,
    source: null,
    value: null,
    numberQuestion: 5,
    seconds: 5,
    visibleFirstLetter: false,
    numberOptions: 4,
    perPage: 4,
    autoCont: false,
};

export const GameProvider = ({ children }) => {
    const { isLogin } = useAuth();
    const { getWords } = useDictionary();
    const { incXP } = useUserStats();

    const collections = { fruits: Fruits, animals: Animals, places: Places };

    const [gameSettings, setGameSettings] = useState(DEFAULT_SETTINGS);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [gameSessions, setGameSessions] = useState([]);

    useEffect(() => {
        if (isLogin) {
            const fetchGameSessions = async () => {
                try {
                    const sessions = await getGameSessions();
                    setGameSessions(sessions);
                } catch (error) {
                    console.error('Error fetching game sessions:', error);
                }
            };
            fetchGameSessions();
        }
    }, [isLogin]);

    const resetGame = () => {
        setQuestions([]);
        setUserAnswers([]);
        setGameSettings(prev => ({
            ...prev,
            source: null,
            value: null,
        }));
    };

    const randomIndexCreater = ({ target_words = null, length = null }) => {
        if (length != null) {
            return Math.floor(Math.random() * length);
        }
        if (target_words != null) {
            return Math.floor(Math.random() * target_words.length);
        }
    };

    const optionCreater = ({ words, answer_index, numOptions = 4 }) => {
        let options = [];
        let used_indexes = new Set();
        let used_option_index = new Set();
        used_indexes.add(answer_index);
        const correctAnswerIndex = randomIndexCreater({ target_words: null, length: numOptions });
        options[correctAnswerIndex] = words[answer_index].tr || words[answer_index].meaning;
        used_option_index.add(correctAnswerIndex);

        for (let i = 1; i <= numOptions - 1; i++) {
            let random_index;
            let random_option_index;
            do {
                random_index = randomIndexCreater({ target_words: words, length: null });
            } while (used_indexes.has(random_index));

            used_indexes.add(random_index);

            do {
                random_option_index = randomIndexCreater({ target_words: null, length: numOptions });
            } while (used_option_index.has(random_option_index));

            used_option_index.add(random_option_index);

            options[random_option_index] = words[random_index].tr || words[random_index].meaning;
        }
        return { options, correctAnswerIndex };
    };

    const createQuestion = async (customSettings = null) => {
        const settings = customSettings || gameSettings;
        let data;
        if (settings.source === "collection") {
            data = collections[settings.value];
        } else if (settings.source === "personal") {
            data = await getWords(settings.value);
        }

        if (!data || data.length === 0) {
            console.warn("createQuestion: No word data found for", settings.source, settings.value);
            return [];
        }

        let tempQuestions = [];
        let usedIndex = new Set();
        const count = Math.min(settings.numberQuestion || 5, data.length);

        for (let i = 1; i <= count; i++) {
            let random_index;
            do {
                random_index = randomIndexCreater({ target_words: data, length: null });
            } while (usedIndex.has(random_index));
            usedIndex.add(random_index);

            const question = data[random_index].en || data[random_index].word;
            const answer = data[random_index].tr || data[random_index].meaning;

            switch (settings.gameType) {
                case "mcq": {
                    const { options, correctAnswerIndex } = optionCreater({
                        words: data,
                        answer_index: random_index,
                        numOptions: settings.numberOptions || 4
                    });
                    tempQuestions.push({ id: i, question, answer, options, correctAnswerIndex });
                    break;
                }
                case "wc":
                    tempQuestions.push({ id: i, question, answer });
                    break;
                case "mp":
                    tempQuestions.push({ id: i, question, answer });
                    break;
                default:
                    break;
            }
        }
        setQuestions(tempQuestions);
        return tempQuestions;
    };

    const getGameSessions = async () => {
        const { ok, status, data } = await apiClient.get(ENDPOINTS.gameSessions);
        if (ok) {
            console.log("Game sessions fetched successfully");
            setGameSessions(data);
            return data;
        } else {
            console.log("Error while fetching game sessions.", status, data);
            return false;
        }
    };

    const saveGameSession = async (sessionData) => {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.saveGameSession, sessionData);
        if (ok) {
            console.log("New game session created successfully:", data);
            incXP(sessionData.total_count);
            await getGameSessions();
            return data;
        } else {
            console.error(`Failed to create new game session. Status: ${status}, Message: ${data}`);
            return null;
        }
    };

    return (
        <GameContext.Provider value={{
            gameSettings,
            setGameSettings,
            questions,
            setQuestions,
            userAnswers,
            setUserAnswers,
            createQuestion,
            resetGame,
            saveGameSession,
            gameSessions,
            setGameSessions,
            randomIndexCreater,
            // Compatibility aliases
            numberQuestion: gameSettings.numberQuestion,
            seconds: gameSettings.seconds,
            gameType: gameSettings.gameType,
            autoCont: gameSettings.autoCont,
            perPage: gameSettings.perPage,
            visibleFirstLetter: gameSettings.visibleFirstLetter,
            numberOptions: gameSettings.numberOptions,
            source: gameSettings.source,
            value: gameSettings.value,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    return context;
};