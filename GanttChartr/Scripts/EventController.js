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

    if (target.isCalculated === false) {

        for (var i = 0, len = target.blocks.length; i < len; i++) {

            if (target.blocks[i].startDate < this.levelStart || this.levelStart === null) {
                this.levelStart = target.blocks[i].startDate;
            }
            if (target.blocks[i].endDate > this.levelEnd || this.levelEnd === null) {
                this.levelEnd = target.blocks[i].endDate;
            }
        }
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

    if (item.isCalculated) {
        item.blocks = [];
    }

    if (item.isCalculated && !item.showGapsFromChildren) {
        startDate = this.levelStart;
        endDate = this.levelEnd;

        item.blocks.push({
            startDate: new Date(startDate.getTime()),
            endDate: new Date(endDate.getTime()),
            name: item.displayText,
            toolTip: item.toolTip,
            id: item.id
        });
    } else if (item.isCalculated && item.showGapsFromChildren) {

        item.blocks = item.children[0].blocks;
        for (var childIndex = 1, numberOfChildren = item.children.length; childIndex < numberOfChildren; childIndex++) {

            var child = item.children[childIndex];
            for (var childBlockIndex = 0, numberOfChildBlocks = child.blocks.length; childBlockIndex < numberOfChildBlocks; childBlockIndex++) {

                var childBlock = child.blocks[childBlockIndex];
                for (var blockIndex = 0, numberOfBlocks = item.blocks.length; blockIndex < numberOfBlocks; blockIndex++) {
                    
                    var block = item.blocks[blockIndex];
                    block.name = item.displayText;
                    block.toolTip = item.toolTip;
                    var blockStart = block.startDate.getTime() - (1 * 86400000);
                    var childBlockStart = childBlock.startDate.getTime() - (1 * 86400000);

                    if (item.showAdditiveArea) {

                        if (childBlock.startDate.getTime() < block.startDate.getTime() && childBlock.endDate.getTime() >= blockStart) {

                            block.startDate = new Date(childBlock.startDate.getTime());
                        }

                        if (childBlock.endDate.getTime() > block.endDate.getTime() && childBlockStart <= block.endDate.getTime()) {

                            block.endDate = new Date(childBlock.endDate.getTime());
                        }

                        if (childBlockStart > block.endDate.getTime()) {

                            item.blocks.push(childBlock);
                        }

                    } else {
                        
                        if (childBlockStart > block.endDate.getTime() || childBlock.endDate.getTime() < blockStart) {
                            continue;
                        }

                        if (childBlock.startDate.getTime() > block.startDate.getTime() && childBlockStart <= block.endDate.getTime()) {

                            block.startDate = new Date(childBlock.startDate.getTime());
                        }

                        if (childBlock.endDate.getTime() < block.endDate.getTime() && childBlockStart <= block.endDate.getTime()) {
                            
                            block.endDate = new Date(childBlock.endDate.getTime());
                        }

                        //if (block.endDate.getTime() <= childBlockStart && blockIndex === (numberOfBlocks - 1)) {

                        //    block.startDate = "";
                        //    block.endDate = "";
                        //}
                    }
                }
            }
        }
    } else {
        for (var i = 0, len = item.blocks.length; i < len; i++) {
            item.blocks[i].name = item.displayText;
            item.blocks[i].toolTip = item.toolTip;
            item.blocks[i].id = item.id;                
        }
    }

    
var row = this.MakeRow(this.dateRangeHandler.dataStructure.row, item.blocks);

rows.push(row);

if (childRows !== null) {
    rows = rows.concat(childRows);
}
return rows;
};

EventController.prototype.MakeRow = function (rowTemplate, highlights) {
    var row = {}
    this.CloneObject(row, rowTemplate);
    row.name = highlights[0].name;

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