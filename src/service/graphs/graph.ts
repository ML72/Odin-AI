import fs from "fs";

let idCounter = 0;

export class N {
    title: string;
    body: string
    weight: number;
    freq: number;
    degree: number;
    id: number;
    
    constructor(title: string, body: string, weight: number, id: number = -1, degree: number = 0) {
        this.title = title;
        this.body = body;
        this.weight = weight;
        this.freq = 0; //frequency in the markdown text
        this.degree = degree;
        this.id = id;
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
    ground_truth: boolean;
    size: number;

    constructor(title: string, weight: number, from: N, to: N, graph_id: number = -1, ground_truth: boolean = false, size: number = 1) {
        this.connection = title;
        this.weight = weight;
        this.from = from;
        this.to = to;
        this.graph_id = graph_id;
        this.ground_truth = ground_truth;
        this.size = size;
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
                console.log(`Edge from ${edge.from.title}, id: ${edge.from.id} to ${edge.to.title}, id: ${edge.to.id}, Graph ID: ${edge.graph_id}`);
                console.log(`Edge weight ${edge.weight}`);
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

        const nodes = obj.nodes.map((n: any) => new N(n.title, n.body, n.weight, n.degree, n.id));
        const edges = obj.edges.map((e: any) => new Edge(e.connection, e.weight,
            nodes.find((n: N) => n.title === e.from.title)!,
            nodes.find((n: N) => n.title === e.to.title)!,
            e.graph_id, e.ground_truth, e.size));
        
        return new Graph(nodes, edges);
    }
    
}