import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db, doc, getDoc, setDoc } from "../firebase/config.js";
import { getAllCharacters, searchCharacter } from "../api/fetchDisneyApi";
import { Entypo, Ionicons } from "@expo/vector-icons";

const userLists = [
  { characters: [], key: "Group 1" },
  { characters: [], key: "Group 2" },
];

export default function Main({ navigation }) {

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);

  const handleLoadMore = async () => {
    setLoading(true);
    const newData = await getAllCharacters((page + 1));
    setCharacters([...characters, ...newData.map((character) => ({
      imageUrl: character.imageUrl ? character.imageUrl : require("../assets/no-image.png"),
      name: character.name,
      films: character.films,
      shortFilms: character.shortFilms,
      tvShows: character.tvShows,
      videoGames: character.videoGames,
      key: character._id,
      comment: "",
    }))]);
    setPage(page + 1);
    setLoading(false);
  };

  const searchCharacters = useCallback(async (query) => {
    const data = await searchCharacter(query);

    setCharacters(data.map((character) => ({
      imageUrl: character.imageUrl ? character.imageUrl : require("../assets/no-image.png"),
      name: character.name,
      films: character.films,
      shortFilms: character.shortFilms,
      tvShows: character.tvShows,
      videoGames: character.videoGames,
      key: character._id,
      comment: "",
    })));
    setPage(1);
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const getDatastoreFirebase = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().data;
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.log(e);
      console.log("Trying to get local data");
      return getData();
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@storage_Key", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const storeDataToFirebase = async (value) => {
    try {
      await setDoc(doc(db, "users", auth.currentUser.email), {
        data: value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    return navigation.addListener("focus", () => {
      console.info(userLists)
      storeDataToFirebase(userLists)
    });
  }, [navigation]);

  useEffect(() => {
    getDatastoreFirebase().then((value) => setUserLists(value || []));
    setCharacters([]);
    searchCharacters();
    navigation.setOptions({});
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <TouchableOpacity onPress={() => {
            navigation.navigate("CharacterDetails", [item, userLists]);
          }}>
            <Image style={styles.characterImage} source={{ uri: item.imageUrl }} />
            <Text style={styles.itemTitle}>{item.name}</Text>
          </TouchableOpacity>
          {/*<TouchableOpacity*/}
          {/*  style={styles.addToListButton}*/}
          {/*  onPress={() => {*/}
          {/*    let list = userLists.filter((obj) => obj.key !== "");*/}
          {/*    navigation.navigate("ListOfCharacters", list);*/}
          {/*  }}>*/}
          {/*  <Text style={styles.addToListText}>Add to group</Text>*/}
          {/*</TouchableOpacity>*/}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={"Search..."}
          placeholderTextColor={"black"}
          onSubmitEditing={(event) => {
            setCharacters([]);
            searchCharacters(event.nativeEvent.text);
          }}
        />
        <Ionicons name="ios-search" size={24} color="black" />
      </View>
      <FlatList
        data={characters}
        style={styles.flatListContainer}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text style={styles.itemTitle}>Loading...</Text> : null}
        numColumns={2}
        pageSize={10}
      />
      <TouchableOpacity
        style={styles.listButton}
        onPress={() => {
          navigation.navigate("ListOfCharacters", userLists);
        }}
      >
        <Entypo name="list" size={36} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    width: Dimensions.get("window").width - 5,
  },
  searchInput: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16,
  },
  flatListContainer: {},
  itemContainer: {
    width: Dimensions.get("window").width / 2 - 5,
    backgroundColor: "#c7f1e0",
    borderColor: "#c7c6c6",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 2,
  },
  characterImage: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").width * 0.4 * (3 / 2),
    borderRadius: 8,
    margin: 5,
    alignContent: "flex-start",
    alignSelf: "center",
    borderColor: "#c7f1e0",
    borderWidth: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "space-around",
  },
  itemTitle: {
    flex: 1,
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  itemButtonsContainer: {
    justifyContent: "space-between",
  },
  addToListButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  removeToListButton: {
    backgroundColor: "#c02a2a",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  addToListText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeToListText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listButton: {
    position: "absolute",
    bottom: 30,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#7cada7",
    borderWidth: 1,
    borderColor: "#bebcbc",
    width: 50,
    height: 50,
    paddingLeft: 7,
    paddingTop: 7,
  },
});

