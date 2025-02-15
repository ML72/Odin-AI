let idCounter = 0;

export class N {
    title: string;
    body: string
    weight: number;
    id: number;

    constructor(title : string, body: string, weight: number) {
        this.title = title;
        this.body = body;
        this.weight = weight;
        this.id = 0;
    }
}

export class Edge {
    connection: string;
    from: N;
    to: N;
    weight: number;
    graph_id: number;

    constructor(title: string, weight: number, from: N, to: N) {
        this.connection = title;
        this.weight = weight;
        this.from = from;
        this.to = to;
        this.graph_id = 0;
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
        for (let edge of this.edges) {
            edge.graph_id = idCounter;
        }
        idCounter ++;
    }
}
