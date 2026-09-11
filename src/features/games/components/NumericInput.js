import { View, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";

export default function NumericInput({ minValue, maxValue, setValue, value, quantity }) {
    const [error, setError] = useState(false);

    const increaseValue = () => {
        if (value < maxValue) {
            setValue(value + 1);
        }
    };

    const decreaseValue = () => {
        if (value > minValue) {
            setValue(value - 1);
        }
    };

    const changeValue = (text) => {
        const cleaned = parseInt(text.replace(/[^0-9]/g, '')) || 0;
        setValue(cleaned);
    };

    const checkValue = () => {
        if (value > maxValue) {
            setValue(maxValue);
            setError(true);
            setTimeout(() => setError(false), 2500);
        } else if (value < minValue) {
            setValue(minValue);
            setError(true);
            setTimeout(() => setError(false), 2500);
        }
    };

    const isMinDisabled = value <= minValue;
    const isMaxDisabled = value >= maxValue;

    return (
        <View style={numericStyles.container}>
            <View style={numericStyles.stepperRow}>
                <TouchableOpacity
                    style={[numericStyles.btn, numericStyles.btnMinus, isMinDisabled && numericStyles.btnDisabled]}
                    onPress={decreaseValue}
                    disabled={isMinDisabled}
                    activeOpacity={0.7}
                >
                    <Feather name="minus" size={18} color={isMinDisabled ? "#A0AEC0" : "#5B3FD3"} />
                </TouchableOpacity>

                <View style={numericStyles.inputWrapper}>
                    <TextInput
                        style={numericStyles.textInput}
                        value={value ? value.toString() : "0"}
                        keyboardType="numeric"
                        onChangeText={changeValue}
                        onBlur={checkValue}
                    />
                    <Text style={numericStyles.quantityText}>{quantity}</Text>
                </View>

                <TouchableOpacity
                    style={[numericStyles.btn, numericStyles.btnPlus, isMaxDisabled && numericStyles.btnDisabled]}
                    onPress={increaseValue}
                    disabled={isMaxDisabled}
                    activeOpacity={0.7}
                >
                    <Feather name="plus" size={18} color={isMaxDisabled ? "#A0AEC0" : "#FFFFFF"} />
                </TouchableOpacity>
            </View>

            {error && (
                <Text style={numericStyles.errorText}>
                    * Değer {minValue} ile {maxValue} arasında olmalıdır.
                </Text>
            )}
        </View>
    );
}

const numericStyles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7FC',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E9E3FF',
        padding: 4,
        height: 52,
    },
    btn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnMinus: {
        backgroundColor: '#EDE9FE',
    },
    btnPlus: {
        backgroundColor: '#5B3FD3',
    },
    btnDisabled: {
        backgroundColor: '#EDF2F7',
        opacity: 0.6,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    textInput: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2D3748',
        paddingVertical: 0,
        paddingHorizontal: 4,
        textAlign: 'right',
        minWidth: 28,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 4,
    },
    errorText: {
        color: '#E53E3E',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
        textAlign: 'center',
    }
});