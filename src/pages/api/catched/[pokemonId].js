import { JsonDB, Config } from "node-json-db";

export default async function handler(req, res) {
  const db = new JsonDB(new Config("db", true, false, "/"));

  if (req.method === "GET") {
    const query = req.query;
    const { pokemonId } = query;
    var data = await db.getData("/");
    return res
    .status(200)
    .json(data.some((pokemon) => pokemon.id === Number(pokemonId)));
  } else if (req.method === "DELETE") {
    try {
      const query = req.query;
      const { pokemonId } = query;

      await db.delete(
        "/catchedPokemon[" +
          (await db.getIndex("/catchedPokemon", Number(pokemonId))) +
          "]"
      );

      return res.status(200).send("Pokemon liberado");
    } catch {
      return res.status(409).send("Pokemon no encontrado");
    }
  }
  return res.status(405).send("Method not allowed.");
}
