export class SuccessResponse<T = any> {
    success = true;
    message: string;
    data: T;

    constructor(message: string, data: T) {
        this.message = message;
        this.data = data
    }
}