import { IncomingMessage, ServerResponse } from "http";

export interface RouteDefinition {
    method: string;
    path: string;
    handler: (req: IncomingMessage, res: ServerResponse) => void;
}