function RowController(rowTemplate, highlights) {

    this.rowTemplate = rowTemplate;
    this.highlights = highlights;
};

RowController.prototype.SpliceData = function () {

    for (var highlightIndex = 0, highlightCount = this.highlights.length; highlightIndex < highlightCount; highlightIndex++) {

        var highlight = this.highlights[highlightIndex];
        var lastDayWasAHighlight = false;
        for (var dayIndex = 0, dayCount = this.rowTemplate.days.length; dayIndex < dayCount; dayIndex++) {

            var day = this.rowTemplate.days[dayIndex];
            day.events = typeof day.events !== "undefined" ? day.events : [];
            var dayDate = new Date(day.yearName, day.monthName, day.dayName);
            if (lastDayWasAHighlight === false && highlight.startDate <= dayDate && highlight.endDate >= dayDate) {
                lastDayWasAHighlight = true;
                day.highlight = " ";
                day.events.push({
                    name: highlight.name,
                    id: highlight.id,
                    className: "highlight draggable",
                    width: "width: " + ((this.GetDaysBetween(highlight.startDate, highlight.endDate)*21) - 5) + "px;",
                    numberOfDays: this.GetDaysBetween(highlight.startDate, highlight.endDate)
                });
            } else {
                day.highlight = " ";
                day.events.push({
                    name: "",
                    className: "",
                    width:"",
                    numberOfDays: ""
                });
            }
            if (highlight.endDate === dayDate) {
                lastDayWasAHighlight = false;
            }
        }
    }
};

RowController.prototype.GetDaysBetween = function(startDate, endDate) {
    return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))) + 1;
}