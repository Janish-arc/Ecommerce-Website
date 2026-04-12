class Apihelper {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr. keyword ? {
            
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        this.query = this.query.find({...keyword})
        return this
    }
    
    filter() {
        const queryCopy = {...this.queryStr}
        const removeFields = ["keyword", "page", "limit", "sort"]
        removeFields.forEach((key) => delete queryCopy[key])
        this.query = this.query.find(queryCopy)
        return this
    }
    pagination(productPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = productPerPage * (currentPage -1)
        this.query = this.query.limit(productPerPage).skip(skip)
        return this
    }
    sort(){
        const sort = this.queryStr.sort
        let sortOption = {}
        if(sort === "asc_price") sortOption.price = 1
        if(sort === "desc_price") sortOption.price = -1
        if(sort === "newest") sortOption.createdAt = -1
        if(sort === "rating") sortOption.rating = -1
        this.query = this.query.sort(sortOption)
        return this
    }
}

export default Apihelper