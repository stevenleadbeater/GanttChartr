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
            var dayDate = new Date(day.yearName, day.monthName, day.dayName);
            if (lastDayWasAHighlight === false && highlight.startDate <= dayDate && highlight.endDate >= dayDate) {
                lastDayWasAHighlight = true;
                day.highlight = "highlight";
                day.events = [
                {
                    name: highlight.name,
                    className: "highlight",
                    width: "width: " + ((this.GetDaysBetween(highlight.startDate, highlight.endDate)*21) - 1) + "px;"
                }];
            } else {
                day.highlight = " ";
                day.events = [
                {
                    name: "",
                    className: "",
                    width:""
                }];
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