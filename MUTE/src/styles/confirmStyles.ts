import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const getDynamicStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
        padding: 20,
        width: windowWidth,
      },
      title: {
        fontSize: 22,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
        textAlign: "center",
        marginBottom: 20,
      },
      input: {
        borderWidth: 1,
        borderColor: isDarkMode ? "#555" : "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
        marginTop: 5,
      },
      total: {
        fontSize: 18,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
        textAlign: "center",
        marginTop: 20,
      },
      confirmButton: {
        marginTop: 16,
        backgroundColor: "#ff5722",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
      },
      confirmButtonText: { fontSize: 16, color: "#ffffff", fontWeight: "bold" },
      logoContainer: {
        width: 150, // Ajusta el tamaño del círculo
        height: 150,
        borderRadius: 75, // Hace que sea un círculo
        backgroundColor: isDarkMode ? "#ffffff" : "transparent", // Aura blanca solo en Dark Mode
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#ffffff", // Aura en iOS
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isDarkMode ? 0.5 : 0, // Activar solo en Dark Mode
        shadowRadius: 10,
        elevation: isDarkMode ? 10 : 0, // Aura en Android
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
      },
      modalLogo: { width: 120, height: 120 },
      loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
  
      fullScreenModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
      paidText: {
        fontSize: 20,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
        marginBottom: 20,
      },
    });
  
export { getDynamicStyles };