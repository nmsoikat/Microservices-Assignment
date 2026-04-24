import { SuccessResponse } from "./success.response";

export class ResponseHelper {
    static success<T>(message: string, data: T) {
        return new SuccessResponse(message, data);
    }
}