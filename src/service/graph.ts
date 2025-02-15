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
    node_from: N;
    node_to: N;
    weight: number;

    constructor(title: string, weight: number, node_from: N, node_to: N) {
        this.connection = title;
        this.weight = weight;
        this.node_from = node_from;
        this.node_to = node_to;
    }
}

export class Graph {
    nodes: N[]
    edgeList: Edge[];

    constructor(nodes: N[], edgeList: Edge[]) {
        this.nodes = nodes;
        this.edgeList = edgeList;
    }
}
