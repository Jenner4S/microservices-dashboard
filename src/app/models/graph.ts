import { MsdNode } from './';
export interface MsdGraph {
    directed: boolean;
    types: any;
    nodes: MsdNode[];
    lanes: any;
    links: any;
    multigraph: boolean;
    graph: any;
}