import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getTypeColor } from "@/constants/typeColors";

const pokeAPI = "https://pokeapi.co/api/v2/pokemon?limit=20";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(pokeAPI);
      const data = await response.json();

      const detalles: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        }),
      );

      setPokemons(detalles);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E3350D" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {pokemons.map((pokemon) => {
        const mainType = pokemon.types[0]?.type.name;

        return (
          <Link
            key={pokemon.name}
            href={{ pathname: "/details", params: { name: pokemon.name } }}
            asChild
          >
            <Pressable
              style={StyleSheet.flatten([
                styles.card,
                { backgroundColor: getTypeColor(mainType) + "40" },
              ])}
            >
              <Text style={styles.name}>{pokemon.name}</Text>

              <View style={styles.types}>
                {pokemon.types.map((t) => (
                  <Text
                    key={t.type.name}
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeColor(t.type.name) },
                    ]}
                  >
                    {t.type.name}
                  </Text>
                ))}
              </View>

              <View style={styles.images}>
                <Image source={{ uri: pokemon.image }} style={styles.image} />
                <Image
                  source={{ uri: pokemon.imageBack }}
                  style={styles.image}
                />
              </View>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    gap: 16,
    padding: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  types: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  typeBadge: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "capitalize",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  images: {
    flexDirection: "row",
  },
  image: {
    width: 150,
    height: 150,
  },
});
