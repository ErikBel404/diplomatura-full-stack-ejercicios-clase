const express = require("express");
const path = require("node:path");
const { leerJson } = require("./archivos.js");
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "series.json");

async function main() {
    try {
        const series = await leerJson(rutaDatos);

        const app = express();
        app.use(express.json());


        app.get("/", (req, res) => {
            res.json({ mensaje: "API de series disponible" });
        });

        /*
        /api/series?genero=drama
        */

        app.get("/api/series", (req, res) => {

            const { genero } = req.query;

            if (!genero) { return res.json(series); }

            const resultado = series.filter((serie) => serie.genero.toLowerCase() === String(genero).toLowerCase(),);

            res.json(resultado);
        });

        app.get("/api/series/:id", (req, res) => {
            const id = Number(req.params.id);

            const serie = series.find((elemento) => elemento.id === id);

            if (!serie) { return res.status(404).json({ error: "Serie no encontrada" }); }

            res.json(serie);
        });

        app.post("/api/series", (req, res) => {
            const { titulo, genero, temporadas } = req.body;

            if (!titulo || !genero || temporadas === undefined) {
                return res.status(400).json({ error: "titulo, genero y temporadas son obligatorios", });
            }

            const ultimoId = series.length === 0 ? 0 : series[series.length - 1].id;
            const nuevaSerie = { id: ultimoId + 1, titulo, genero, temporadas, };
            series.push(nuevaSerie);

            res.status(201).json(nuevaSerie);
        });


        app.listen(PORT, () => { console.log(`Servidor disponible en http://localhost:${PORT}`); });

    } catch (error) {
        console.error(`No se pudo iniciar el servidor: ${error.message}`); process.exitCode = 1;
    }
}


main();