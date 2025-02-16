
const INF = Number.MAX_SAFE_INTEGER;

let n: number;
let capacity: number[][];
let adj: number[][];

function bfs(s: number, t: number, parent: number[]): number {
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

function maxflow(s: number, t: number): number {
    let flow = 0;
    const parent: number[] = new Array(n).fill(-1);
    let new_flow: number;

    while ((new_flow = bfs(s, t, parent)) > 0) {
        flow += new_flow;
        let cur = t;
        
        while (cur !== s) {
            const prev = parent[cur];
            capacity[prev][cur] -= new_flow;
            capacity[cur][prev] += new_flow;
            cur = prev;
        }
    }

    return flow;
}
