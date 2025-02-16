let nodeList: N[] = [];
let noteAdjList: Edge[][][] = []; // This is a 2D array
let lectAdjList: Edge[][][] = [];
let knowledgeGapList: Edge[][][] = []; // 2D array of connections to go over, weightage on how much is missing

// Read in nodes from some source?
let numNodes: number = nodeList.length;

for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
        for (let a of lectAdjList[i][j]){
            let title = a.title;
            let add = true;
            let weight = a.weight;
            for (let b of noteAdjList[i][j]) {
                if (b.title == a.title){
                    weight = a.weight - b.weight;
                    if (weight <= 0){
                        add = false;
                    }
                }
            }
            if (add){
                let ans: Edge = {title, weight};
                knowledgeGapList[i][j].concat(ans);
            }
        }
        
    }
}
