export interface NodeDetails {
    status: string;
    type: string;
    group: string;
}
export interface MsdNode {
    details: NodeDetails;
    id: string;
    lane: number;
}
