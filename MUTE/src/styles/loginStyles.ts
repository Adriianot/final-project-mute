import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 10,
    },
    form: {
      width: "100%",
    },
    inputContainer: {
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    input: {
      height: 40,
      paddingHorizontal: 10,
    },
    loginButton: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 25,
      alignItems: "center",
      marginTop: 20,
      borderWidth: 0.5,
      width: windowWidth * 0.8, // Hacerlo más responsivo
    alignSelf: "center",
    },
    loginButtonText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    forgotPassword: {
      alignItems: "center",
      marginTop: 15,
    },
    forgotPasswordText: {
      color: "#007bff",
      fontSize: 14,
    },
    createAccount: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 25,
      alignItems: "center",
      marginTop: 20,
    },
    createAccountText: {
      color: "#fff",
      fontSize: 16,
    },
    socialContainer: {
      marginTop: 30,
      alignItems: "center",
    },
    socialText: {
      color: "#666",
      marginBottom: 15,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },
    socialButton: {
      padding: 10,
    },
    socialIcon: {
      width: 30,
      height: 30,
    },
  });
  
  
export { styles };