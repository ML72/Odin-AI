import { Graph, Edge, N } from '../graphs/graph';

const INF = Number.MAX_SAFE_INTEGER;

type AdjacencyList = {
    [key: number]: Edge[];
};

let n: number;
let capacity: number[][];
let adj: number[][];
let topFiveNodes = new Set<number>();

function bfs(s: N, t: N, parent: number[]): number {
    parent.fill(-1);
    parent[s] = -2;
    
    const queue: [number, number][] = [[s, INF]];
    
    while (queue.length > 0) {
        const [cur, flow] = queue.shift()!;

        for (const next of adj[cur]) {
            if (parent[next] === -1 && capacity[cur][next] > 0) {
                parent[next] = cur;
                const new_flow = Math.min(flow, capacity[cur][next]);
                if (next === t) return new_flow;
                queue.push([next, new_flow]);
            }
        }
    }
    
    return 0;
}

function maxflow(s: N, t: N): number {
    let flow = 0;
    const parent: N[] = new Array(n);
    let new_flow: number;

    while ((new_flow = bfs(s, t, parent)) > 0) {
        flow += new_flow;
        let cur = t;
        
        while (cur.id !== s.id) {
            const prev = parent[cur.id];
            capacity[prev.id][cur.id] -= new_flow;
            capacity[cur.id][prev.id] += new_flow;
            cur = prev;
        }
    }

    return flow;
}
