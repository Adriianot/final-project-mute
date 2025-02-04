import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const getDynamicStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
      container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
      },
  
      imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
      },
      image: { width: windowWidth - 60, height: 300, resizeMode: "contain" },
  
      infoContainer: { marginTop: 10, paddingHorizontal: 16 },
      title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      description: {
        fontSize: 16,
        color: isDarkMode ? "#aaaaaa" : "#666666",
        marginBottom: 10,
      },
      price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF5733",
        marginBottom: 16,
      },
  
      sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
  
      sizeSelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#f0f0f0",
      },
      sizeSelectorText: {
        fontSize: 16,
        color: "#333",
      },
  
      addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5733",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
      },
      addButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
        marginLeft: 8,
      },
  
      disabledButton: { backgroundColor: "#ccc" },
  
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        width: 300,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
      modalSizes: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
      },
      closeModalButton: {
        marginTop: 15,
        backgroundColor: "#FF5733",
        padding: 10,
        borderRadius: 5,
      },
      closeModalText: {
        color: "#fff",
        fontWeight: "bold",
      },
  
      sizeButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#999",
        marginHorizontal: 5,
        backgroundColor: "#f0f0f0",
      },
      selectedSizeButton: {
        backgroundColor: "#FF5733",
        borderColor: "#FF5733",
      },
      sizeText: { fontSize: 14, fontWeight: "bold", color: "#333" },
      selectedSizeText: { color: "#FFF" },
      counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
      },
      counterButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5733",
        borderRadius: 8,
      },
      counterButtonText: {
        fontSize: 24,
        color: isDarkMode ? "#ffffff" : "#000000",
        fontWeight: "bold",
      },
      counterText: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 15,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    });
  
export { getDynamicStyles };