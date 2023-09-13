class HandleResponseJson {
    success = true;
    constructor(data, pageCount = 0) {
        this.data = data;
        this.pageCount = pageCount;
    }
}

export default HandleResponseJson;
