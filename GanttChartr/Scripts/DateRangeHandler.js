var DateRangeHandler = function (startDate, endDate) {
    
    if (endDate < startDate) {
        throw ("End date must be after start date");
    }

    this.startDate = startDate;
    this.endDate = endDate;
    this.dataStructure = {};
    this.dataStructure.Header = {};
};

DateRangeHandler.prototype.GenerateDataStructure = function () {

    this.dataStructure.Header.years = this.GetYearsArray();
    this.dataStructure.row = {
        "days": []
    };

    var numberOfYears = this.dataStructure.Header.years.length;
    for (var yearIndex = 0; yearIndex < numberOfYears; yearIndex++) {

        var year = this.dataStructure.Header.years[yearIndex],
            numberOfMonths = year.months.length;
        for (var monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {

            this.dataStructure.row.days = this.dataStructure.row.days.length !== 0 ?
                this.dataStructure.row.days.concat(year.months[monthIndex].days) :
                year.months[monthIndex].days;
        }
    }
};

DateRangeHandler.prototype.GetYearsArray = function () {
    var yearArray = [];
    var startYear = this.startDate.getFullYear();
    var endYear = this.endDate.getFullYear();
    var currentYear = startYear.toString();

    while (parseInt(currentYear) <= parseInt(endYear)) {
        yearArray.push(
        {
            "yearName": currentYear,
            "months": this.GetMonthsArray(currentYear)
        });
        currentYear = (parseInt(currentYear) + 1).toString();
    };

    return yearArray;
};

DateRangeHandler.prototype.GetMonthsArray = function (year) {
    var monthArray = [];
    var monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    var i = 0;
    var length;

    if (this.endDate.getFullYear() > parseInt(year)) {

        length = monthNames.length;
    } else {

        length = this.endDate.getMonth() + 1;
    }

    while (i < length) {
        monthArray.push({
            "monthName": monthNames[i],
            "days": this.GetDaysArray(year, i)
        });
        i++;
    }

    return monthArray;
};

DateRangeHandler.prototype.GetDaysArray = function (year, month) {

    var dayArray = [];
    var i = 0;
    var length;

    if (this.endDate.getFullYear() > parseInt(year)
        ||
        (this.endDate.getFullYear() >= parseInt(year) && this.endDate.getMonth() > month)) {

        var d = new Date(parseInt(year), month + 1, 0);
        length = d.getDate();
    } else {

        length = this.endDate.getDate();
    }

    while (i < length) {
        dayArray.push({
            "dayName": i + 1
        });
        i++;
    }

    return dayArray;
};