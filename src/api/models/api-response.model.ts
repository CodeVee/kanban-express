export class ApiResponse {
    succeeded: boolean;
    message: string;

    constructor(message: string, succeeded = false) {
        this.message = message;
        this.succeeded = succeeded;
    }

    static success = () => new ApiDataResponse(null, 'Success');
    static successData = <T>(data: T) => new ApiDataResponse(data, 'Success');
    static successDataMessage = <T>(data: T, message: string) => new ApiDataResponse(data, message);
    static failure = () => new ApiDataResponse(null, 'Failure', false);
    static failureMessage = (message: string) => new ApiDataResponse(null, message, false);
}

class ApiDataResponse<T> extends ApiResponse {
    data: T;
    constructor(data: T, message = '', succeeded = true) {
        super(message, succeeded);
        this.data = data;
    }
}
