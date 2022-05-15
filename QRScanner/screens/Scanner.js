import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BarcodeMask from "react-native-barcode-mask";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const qrSize = width * 0.4;

const finderWidth = 280;
const finderHeight = 230;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation();

  // PERMISSION HOOK -> CHECK IF USER HAS ENABLED NECESSARY
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //const handleBarCodeScanned = ({ type, data }) => {
  const handleBarCodeScanned = (scanningResult) => {
    // Scanned has been set to false on load of UI screen. We update this using hook from bar code comp, and only taking specific viewport.
    if (!scanned) {
      const { type, data, bounds: { origin } = {} } = scanningResult;
      const { x, y } = origin;
      if (
        x >= viewMinX &&
        y >= viewMinY &&
        x <= viewMinX + finderWidth / 2 &&
        y <= viewMinY + finderHeight / 2
      ) {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Layout:
  // 3 buttons below: Profile, Scanner, Settings
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      >
        {/* <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
         */}
        <View
          style={{
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text style={styles.description}>Hold to Scan</Text>
          <Text onPress={() => navigation.navigate("HomeScreen")} style={styles.cancel}>
            Cancel
          </Text>
        </View>

        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
        {scanned && <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
      </BarCodeScanner>
    </SafeAreaProvider>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qr: {
    marginTop: "20%",
    marginBottom: "20%",
    width: qrSize,
    height: qrSize,
  },
  description: {
    fontSize: width * 0.05,
    marginTop: "70%",
    textAlignVertical: "bottom",
    width: "70%",
    color: "white",
    marginBottom: 30,
  },
  cancel: {
    fontSize: width * 0.05,
    justifyContent: "center",
    width: "70%",
    marginLeft: 10,
    padding: 5,
    color: "white",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8,
  },
});
