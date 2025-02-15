import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingBottom: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginTop: windowHeight * 0.03, 
      marginBottom: 10,
    },
    logo: {
      width: 100,
      height: 100,
    },
    content: {
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
      textAlign: "center",
      marginBottom: 20,
    },
    inputContainer: {
      width: "90%",
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
    },
    createButton: {
      backgroundColor: "#000",
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: "center",
      marginTop: 30,
      width: "85%",
    },
    createButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
  
export { styles };