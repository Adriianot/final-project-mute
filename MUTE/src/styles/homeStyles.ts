import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth } = Dimensions.get("window");


const getDynamicStyles = (isDarkMode: boolean) =>
    StyleSheet.create({
      container: { flex: 1, backgroundColor: isDarkMode ? "#121212" : "#ffffff" },
      scrollView: { flex: 1 },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        elevation: 4,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      headerRight: { flexDirection: "row" },
      headerIcon: { marginLeft: 16, padding: 8 },
      viewPager: { height: 200, marginVertical: 16 },
      bannerPage: { flex: 1, alignItems: "center", justifyContent: "center" },
      bannerImage: { width: "100%", height: "100%" },
      featuredSection: { padding: 16 },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      loadingText: {
        textAlign: "center",
        fontSize: 16,
        marginVertical: 10,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
      productCard: {
        width: (windowWidth - 48) / 2,
        marginBottom: 16,
        backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        borderRadius: 8,
        elevation: 2,
        overflow: "hidden",
      },
      productImage: { width: "100%", height: 150 },
      productTitle: {
        fontSize: 14,
        marginTop: 8,
        marginHorizontal: 8,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 8,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: isDarkMode ? "#222222" : "#f0f0f0",
        borderRadius: 8,
        paddingHorizontal: 10,
        color: isDarkMode ? "#ffffff" : "#000000",
      },
      noResultsText: {
        textAlign: "center",
        fontSize: 16,
        marginVertical: 20,
        fontWeight: "bold",
        color: isDarkMode ? "#ff4444" : "#cc0000",
      },
      filterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      },
      categoryScroll: {
        marginLeft: 10,
        marginBottom: 20,
      },
      categoryButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
      },
      categoryButtonSelected: {
        backgroundColor: "#000",
      },
      categoryText: {
        fontSize: 14,
        color: "#000",
      },
      categoryTextSelected: {
        color: "#fff",
        fontWeight: "bold",
      },
    });
export { getDynamicStyles };