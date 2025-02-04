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
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
        },
        headerTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: isDarkMode ? "#ffffff" : "#000000",
          textAlign: "center",
          flex: 1,
        },
        chatContainer: {
          flex: 1,
          paddingBottom: 20,
        },
        chatItem: {
          marginBottom: 10,
          padding: 12,
          borderRadius: 10,
          maxWidth: "75%",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        userChatItem: {
          alignSelf: "flex-end",
          backgroundColor: isDarkMode ? "#333333" : "#e0e0e0",
          borderRadius: 12,
          padding: 12,
        },
        modelChatItem: {
          alignSelf: "flex-start",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f0f0f0",
          borderRadius: 12,
          padding: 12,
        },
        chatText: {
          fontSize: 16,
          color: isDarkMode ? "#ffffff" : "#000000",
        },
        speakerButton: {
          marginTop: 5,
          alignSelf: "flex-end",
        },
        inputContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? "#333333" : "#eeeeee",
          borderRadius: 12,
        },
        textInput: {
          flex: 1,
          height: 45,
          borderWidth: 1,
          borderColor: isDarkMode ? "#444" : "#ccc",
          borderRadius: 10,
          backgroundColor: isDarkMode ? "#222" : "#f5f5f5",
          color: isDarkMode ? "#ffffff" : "#000000",
          paddingHorizontal: 12,
          fontSize: 16,
        },
        sendButton: {
          marginLeft: 10,
          backgroundColor: "#ff5722",
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        sendIcon: {
          fontSize: 24,
          color: "#ffffff",
        },
      });
export { getDynamicStyles };