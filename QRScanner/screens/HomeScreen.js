import React from "react";
import { View, StyleSheet, Button } from "react-native";
import "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  // Layout:
  // 3 buttons below: Profile, Scanner, Settings

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Scan" onPress={() => navigation.navigate("Scanner")} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
