


export class ApiFeatures {
    constructor(dbQuery, searchQuery) {
        this.dbQuery = dbQuery;
        this.searchQuery = searchQuery;
    }

    pagination() {
        // * pagination
        let pageNumber = this.searchQuery.page * 1 || 1;
        if (this.searchQuery.page < 1) pageNumber = 1;
        const limit = this.searchQuery.limit || 10;
        let skip = (pageNumber - 1) * limit;
        this.pageNumber = pageNumber;
        this.limit = limit;
        this.skip = skip;
        this.dbQuery.skip(skip).limit(limit);
        return this;
    }

    filter() {
        let filterObj = structuredClone(this.searchQuery);
        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/, (value) => "$" + value); // `$${value}`
        filterObj = JSON.parse(filterObj);

        let excludedFields = ["page", "sort", "fields", "search"];
        excludedFields.forEach((val) => {
            delete filterObj[val];
        });
        this.filterObj = filterObj;

        this.dbQuery.find(filterObj);
        return this;
    }

    sort() {
        // * sort
        if (this.searchQuery.sort) {
            let sortBy = this.searchQuery.sort.split(",").join(" ");
            this.sortBy = sortBy

            this.dbQuery.sort(sortBy);
        }

        return this;
    }

    fields() {
        // * selected fields
        if (this.searchQuery.fields) {
            let selectedFields = this.searchQuery.fields.split(",").join(" ");
            this.dbQuery.select(selectedFields);
            this.selectedFields = selectedFields
        }

        return this
    }

    search() {
        // * search
        if (this.searchQuery.search) {
            this.dbQuery.find(
                {
                    $or: [
                        { title: { $regex: this.searchQuery.search, $options: "i" } },
                        { discription: { $regex: this.searchQuery.search, $options: "i" } }
                    ]
                });

            this.searchQuery = this.searchQuery
        }
        return this
    }
}