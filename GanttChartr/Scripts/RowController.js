function RowController(rowTemplate, highlights) {

    this.rowTemplate = rowTemplate;
    this.highlights = highlights;
};

RowController.prototype.SpliceData = function () {

    for (var highlightIndex = 0, highlightCount = this.highlights.length; highlightIndex < highlightCount; highlightIndex++) {

        var highlight = this.highlights[highlightIndex];
        for (var dayIndex = 0, dayCount = this.rowTemplate.days.length; dayIndex < dayCount; dayIndex++) {

            var day = this.rowTemplate.days[dayIndex];
            var dayDate = new Date(day.yearName, day.monthName, day.dayName);
            if (highlight.startDate <= dayDate && highlight.endDate >= dayDate) {
                day.highlight = "highlight";
            } else {
                day.highlight = " ";
            }
        }
    }
};