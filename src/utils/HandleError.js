class HandleError {
    constructor(statusCode = 500, message = '') {
        if (!message) {
            switch (statusCode) {
                case 500:
                    this.message = 'Internal Server Error!';
                    break;
                case 400:
                    this.message = 'Bad Request!';
                    break;
                case 404:
                    this.message = 'Not Found!';
                    break;
                case 401:
                    this.message = 'Unauthorized!';
                    break;
                case 403:
                    this.message = 'Forbidden!';
                    break;
                case 503:
                    this.message = 'Service Unavailable!';
                    break;
                // Thêm các case lỗi khác tùy theo yêu cầu của bạn
                default:
                    this.message = 'Error Occurred!';
                    break;
            }
        } else {
            this.message = message;
        }
        this.statusCode = statusCode;
    }
}

export default HandleError;
