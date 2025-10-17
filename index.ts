import axios from "axios"
import cors from "cors"
import express, {
    type NextFunction,
    type Request,
    type Response
} from "express"

type Team = {
    id: number,
    name: string,
    city: string,
    titles: number
}

let teams: Team[] = [
    {
        id: 1,
        name: "Lakers",
        city: "Los Angeles",
        titles: 17
    },
    {
        id: 2,
        name: "Celtics",
        city: "Boston",
        titles: 17
    }
];


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/teams", (req: Request, res: Response) => {
    res.json(teams);
});

app.get("/teams/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const team = teams.find((t) => t.id == Number(id));
    
    return team ? res.json(team) : res.status(404).json({ error: "Equipo no encontrado"});
});

// IT'S NOT UNDEFINED YOU STUPID CLANKER
let newID: number = teams.at(-1)?.id ?? 0;

app.post("/teams", (req: Request, res: Response) => {
    try {
        newID = newID + 1;
        const newTeam: Team = {
            id: newID,
            ...req.body
        };

        teams.push(newTeam);
        res.status(201).json(newTeam);

    } catch (error: any) {
        res
            .status(500)
            .json({ error: "Error al crear el equipo.", detail: error.message});
    }
});

app.delete("/teams/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const index = teams.findIndex((t) => t.id === Number(id));

        if (index === -1)
            return res.status(404).json({ error: "Equipo no encontrado"});


        teams = teams.filter((t) => t.id !== Number(id));
        res.json({ message: "Equipo eliminado correctamente"});
    } catch (error: any) {
        res
            .status(500)
            .json({ error: "Error al eliminar el equipo.", detail: error.message});
    }
});

app.listen(port, () => {
    console.log("Servidor en http://localhost:3000");
});

const testAPI = async () => {
    setTimeout(async () => {
        console.log("Esperando un segundo...\n")
        
        console.log("[GET] Obteniendo los equipos...\n");
        let listAxios = await axios.get("http://localhost:3000/teams");
        console.log(listAxios.data);

        console.log("\n[POST] Creando un nuevo equipo...\n");

        await axios.post("http://localhost:3000/teams", {
            name: "Bulls",
            city: "Chicago",
            titles: 6
        });

        listAxios = await axios.get("http://localhost:3000/teams");
        console.log(listAxios.data);

        let list: Team[] = listAxios.data;
        const team = list.find((n) => n.name === "Bulls");

        if (typeof team === "undefined") {
            console.log("[POST] Error al escribir el equipo!\n");
        } else {
            console.log("\n[DELETE] Borrando equipo...\n");
            await axios.delete(`http://localhost:3000/teams/${team?.id}`);

            console.log("Mostrando la lista nueva...");
            listAxios = await axios.get("http://localhost:3000/teams")
            console.log(listAxios.data);
    }
    }, 1000);



}

testAPI();