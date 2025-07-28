import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const TimePicker = ({
  onValueChange,
  initialSeconds: initialTotalSeconds = "0",
}: {
  onValueChange: (minutes: string, seconds: string) => void;
  initialSeconds?: string;
}) => {
  const parseTotalSeconds = (totalSeconds: string) => {
    const total = parseInt(totalSeconds, 10) || 0;
    const m = Math.floor(total / 60).toString();
    const s = (total % 60).toString();
    return { minutes: m, seconds: s };
  };

  const { minutes: initialMinutes, seconds: initialSecondsValue } =
    parseTotalSeconds(initialTotalSeconds);

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSecondsValue);

  useEffect(() => {
    const { minutes: newMinutes, seconds: newSeconds } =
      parseTotalSeconds(initialTotalSeconds);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  }, [initialTotalSeconds]);

  const generateNumbers = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const minuteOptions = generateNumbers(0, 60); // Up to 60 minutes
  const secondOptions = generateNumbers(0, 59); // 0 to 59 seconds

  const handleMinutesChange = (itemValue: string) => {
    setMinutes(itemValue);
    onValueChange(itemValue, seconds);
  };

  const handleSecondsChange = (itemValue: string) => {
    setSeconds(itemValue);
    onValueChange(minutes, itemValue);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Picker
        selectedValue={minutes}
        onValueChange={handleMinutesChange}
        style={styles.picker}
        itemStyle={{ color: "white" }}
      >
        {minuteOptions.map((minute) => (
          <Picker.Item
            key={minute}
            label={`${minute} min`}
            value={minute.toString()}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={seconds}
        onValueChange={handleSecondsChange}
        style={styles.picker}
        itemStyle={{ color: "white" }}
      >
        {secondOptions.map((second) => (
          <Picker.Item
            key={second}
            label={`${second} sec`}
            value={second.toString()}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = {
  picker: {
    flex: 1,
    color: "white",
  },
};

export default TimePicker;
