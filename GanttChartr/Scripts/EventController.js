function EventController(dateRangeHandler) {

    this.Model = null;
    this.rows = [];
    this.dateRangeHandler = dateRangeHandler;
    this.levelStart = null;
    this.levelEnd = null;
    this.levelAccessor = null;
    this.isCalculated = false;
};

EventController.prototype.LoadData = function (data) {

    this.Model = data;
    if (this.IsObjectOrArray(this.Model)) {
        this.rows = this.Iterate(this.Model, this.processData.bind(this), "", false);
    } else {
        throw "Invalid data. Must be an object or array";
    }
};

EventController.prototype.preProcessData = function (target) {

    if (target.startDate < this.levelStart || this.levelStart === null) {
        this.levelStart = target.startDate;
    }
    if (target.endDate > this.levelEnd || this.levelEnd === null) {
        this.levelEnd = target.endDate;
    }
};

EventController.prototype.processData = function (item, dataAccessor) {

    var childRows = null,
        rows = [];

    if (this.IsObjectOrArray(item.children)) {
        childRows = this.Iterate(item.children, this.processData.bind(this), dataAccessor, item.isCalculated);
    }

    this.preProcessData(item, dataAccessor);

    var startDate,
        endDate;

    var blocks = [];

    if (item.isCalculated) {
        startDate = this.levelStart;
        endDate = this.levelEnd;

        blocks.push({
            startDate: startDate,
            endDate: endDate,
            name: item.displayText,
            toolTip: item.toolTip,
            id: item.id
        });
    } else {
        for(var i = 0; i < item.blocks.length; i ++)
        {
            blocks.push({
                startDate: item.blocks[i].startDate,
                endDate: item.blocks[i].endDate,
                name: item.displayText,
                toolTip: item.toolTip,
                id: item.id
            });
        }
    }
    var row = this.MakeRow(this.dateRangeHandler.dataStructure.row, blocks);

    rows.push(row);

    if (childRows !== null) {
        rows = rows.concat(childRows);
    }
    return rows;
};

EventController.prototype.MakeRow = function (rowTemplate, highlights) {
    var row = {}
    this.CloneObject(row, rowTemplate);

    var rowController = new RowController(row, highlights);
    rowController.SpliceData();
    return row;
}

EventController.prototype.CloneObject = function (obj1, obj2) {

    //iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
        // Property in destination object set; update its value.
        if (obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined") {
            this.CloneObject(obj1[p], obj2[p]);

        } else {
            //We don't have that level in the heirarchy so add it

            if (Object.prototype.toString.call(obj2[p]) === "[object Array]") {
                obj1[p] = [];
                this.CloneObject(obj1[p], obj2[p]);
            } else if (Object.prototype.toString.call(obj2[p]) === "[object Object]") {
                obj1[p] = {};
                this.CloneObject(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        }
    }
}

EventController.prototype.IsObjectOrArray = function (item) {

    return (Object.prototype.toString.call(item) === "[object Array]" && item.length > 0)
        || Object.prototype.toString.call(item) === "[object Object]";
};

EventController.prototype.Iterate = function (target, callBack, dataAccessor, isCalculated) {

    this.isCalculated = isCalculated;
    this.levelAccessor = dataAccessor;
    this.levelStart = null;
    this.levelEnd = null;

    if (Object.prototype.toString.call(target) === "[object Array]") {

        var returnArray = [];
        for (var index = 0, length = target.length; index < length; index++) {

            returnArray = returnArray.concat(callBack(target[index], dataAccessor + "." + index));
        }
        return returnArray;
    } else if (Object.prototype.toString.call(target) === "[object Object]") {

        var returnObject = {};
        for (var p in target) {

            if (target.hasOwnProperty(p)) {

                returnObject[p] = callBack(target[p], dataAccessor + "." + p);
            }
        }
        return returnObject;
    }
};