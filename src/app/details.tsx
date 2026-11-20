import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getTypeColor } from "@/constants/typeColors";

interface PokemonDetails {
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (name) fetchPokemon(name);
  }, [name]);

  async function fetchPokemon(pokemonName: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await res.json();
      setPokemon(data);
    } catch (e) {
      console.log(e);
    }
  }

  const mainType = pokemon?.types[0]?.type.name;
  const color = getTypeColor(mainType);

  return (
    <>
      <Stack.Screen
        options={{
          title: name ? name.charAt(0).toUpperCase() + name.slice(1) : "Detalles",
          headerStyle: { backgroundColor: pokemon ? color : "#E3350D" },
        }}
      />

      {!pokemon ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E3350D" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>

          <View style={[styles.imageBox, { backgroundColor: color + "40" }]}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.image}
            />
            <Image
              source={{ uri: pokemon.sprites.front_shiny }}
              style={styles.image}
            />
          </View>

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

          <View style={styles.row}>
            <Text style={styles.info}>Altura: {pokemon.height / 10} m</Text>
            <Text style={styles.info}>Peso: {pokemon.weight / 10} kg</Text>
          </View>

          <Text style={styles.section}>Habilidades</Text>
          <Text style={styles.info}>
            {pokemon.abilities.map((a) => a.ability.name).join(", ")}
          </Text>

          <Text style={styles.section}>Estadísticas</Text>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{s.stat.name}</Text>
              <Text style={styles.statValue}>{s.base_stat}</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${Math.min(s.base_stat, 150) / 1.5}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  id: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
  },
  imageBox: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  types: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "capitalize",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 24,
  },
  info: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  statName: {
    width: 120,
    textTransform: "capitalize",
  },
  statValue: {
    width: 32,
    fontWeight: "bold",
    textAlign: "right",
  },
  barBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
});
