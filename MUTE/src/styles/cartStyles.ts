import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");


const getDynamicStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
      container: { flex: 1, backgroundColor: isDarkMode ? "#121212" : "#ffffff", width: windowWidth },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 18,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      cartList: {flexGrow: 1, padding: 16 },
      cartItem: {
        flexDirection: "row",
        marginBottom: 16,
        alignItems: "center",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        padding: 10,
        borderRadius: 8,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      cartImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
      cartDetails: { flex: 1 },
      itemName: { fontSize: 16, color: isDarkMode ? "#ffffff" : "#000000" },
      itemPrice: {
        fontSize: 14,
        color: isDarkMode ? "#aaaaaa" : "#777777",
        marginTop: 4,
      },
      cartQuantity: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      },
      quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: isDarkMode ? "#555555" : "#000000",
        alignItems: "center",
        justifyContent: "center",
      },
      buttonText: { fontSize: 18, fontWeight: "bold", color: "#ffffff" },
      quantityText: {
        fontSize: 17,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      footer: {
        position: "absolute", // Lo fija en la parte inferior
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderTopWidth: 1,
        borderColor: isDarkMode ? "#333333" : "#eeeeee",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        justifyContent: "center",
      },
      totalText: {
        left: 15,
        fontSize: 18,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      confirmButton: {
        marginTop: 16,
        backgroundColor: "#ff5722",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
      },
      confirmButtonText: { fontSize: 16, color: "#ffffff", fontWeight: "bold" },
      cartItemContainer: {
        width: "100%",
        padding: 16,
        borderRadius: 10,
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      
      productContainer: {
        flexDirection: "row", 
        alignItems: "center",
        width: "100%", 
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f9f9f9",
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
      },
      
    });
  
export { getDynamicStyles };