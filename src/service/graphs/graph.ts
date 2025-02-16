import fs from "fs";

let idCounter = 0;

export class N {
    title: string;
    body: string
    weight: number;
    freq: number;
    id: number;
    degree: number;

    constructor(title : string, body: string, weight: number, degree: number = 0) {
        this.title = title;
        this.body = body;
        this.weight = weight;
        this.id = 0;
        this.freq = 0; //frequency in the markdown text
        this.degree = degree;
    }

    toString() {
        return this.title + "\n" + this.body; //can also contain body if changed later
    }
}


export class Edge {
    connection: string;
    from: N;
    to: N;
    weight: number;
    graph_id: number;
    color: number;

    constructor(title: string, weight: number, from: N, to: N, graph_id: number = -1, color: number = 0xFF0000) {
        this.connection = title;
        this.weight = weight;
        this.from = from;
        this.to = to;
        this.graph_id = graph_id;
        this.color = color;
    }
}

export class Graph {
    nodes: N[]
    edges: Edge[];
    id: number;

    constructor(nodes: N[], edgeList: Edge[]) {
        this.nodes = nodes;
        this.edges = edgeList;
        this.id = idCounter;

        if (this.edges.length > 0) {
            if (this.edges[0].graph_id == -1) {
                for (let edge of this.edges) {
                    edge.graph_id = idCounter;
                }  
                idCounter ++;
            }
        }
    }

    print() {
        console.log("Graph ID:", this.id);
        console.log("Nodes:", this.nodes);
        console.log("Edges:");
        for (let edge of this.edges) {
            try {
                console.log(`Edge from ${edge.from.title} to ${edge.to.title}, Graph ID: ${edge.graph_id}`);
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    saveToFile(filename: string) {
        const data = JSON.stringify({ nodes: this.nodes, edges: this.edges, id: this.id }, null, 2);
        fs.writeFileSync(filename, data, 'utf-8');
    }

    static loadFromFile(filename: string): Graph {
        const data = fs.readFileSync(filename, 'utf-8');
        const obj = JSON.parse(data);

        const nodes = obj.nodes.map((n: any) => new N(n.title, n.body, n.weight));
        const edges = obj.edges.map((e: any) => new Edge(e.connection, e.weight,
            nodes.find((n: N) => n.title === e.from.title)!,
            nodes.find((n: N) => n.title === e.to.title)!,
            e.graph_id));
        
        return new Graph(nodes, edges);
    }
    
}