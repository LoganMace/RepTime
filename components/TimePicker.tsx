import React, { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimePicker = ({
  onValueChange,
  initialMinutes = "0",
  initialSeconds = "0",
}: {
  onValueChange: (minutes: string, seconds: string) => void;
  initialMinutes?: string;
  initialSeconds?: string;
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

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
  },
};

export default TimePicker;
