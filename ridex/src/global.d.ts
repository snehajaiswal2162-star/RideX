import { Connection } from "mongoose";

declare global {
    var mongooConn:{
        conn: Connection | null,
        promise: Promise<Connection> | null
    }
}

export {}