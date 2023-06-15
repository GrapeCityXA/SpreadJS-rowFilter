
var spreadNS = GC.Spread.Sheets;

var salesData = [
        ["SalesPers", "Birth", "Region", "SaleAmt", "ComPct", "ComAmt"],
        ["Joe", new Date("2000/01/23"), "North", 260, 0.1, 26],
        ["Robert", new Date("1988/08/21"), "South", 660, 0.15, 99],
        ["Michelle", new Date("1995/08/03"), "East", 940, 0.15, 141],
        ["Erich", new Date("1994/05/23"), "West", 410, 0.12, 49.2],
        ["Dafna", new Date("1992/07/21"), "North", 800, 0.15, 120],
        ["Rob", new Date("1995/11/03"), "South", 900, 0.15, 135],
        ["Jonason", new Date("1987/02/11"), "West", 300, 0.17, 110],
        ["Enana", new Date("1997/04/01"), "West", 310, 0.16, 99.2],
        ["Dania", new Date("1997/02/15"), "North", 500, 0.10, 76],
        ["Robin", new Date("1991/12/28"), "East", 450, 0.18, 35]];

var tableColumnsContainer;
var checkBoxes;
window.onload = function () {
    tableColumnsContainer = _getElementById("tableColumnsContainer");
    //设置
    var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"), {sheetCount: 1});
    //初始化方法
    initSpread(spread);
};

function initSpread(spread) {
    var sheet = spread.getSheet(0);
    sheet.suspendPaint();
    //设置表格是否可以溢出
    sheet.options.allowCellOverflow = true;
    sheet.name("FilterDialog");

    sheet.setArray(1, 1, salesData);
    //添加数据筛选
    var filter = new spreadNS.Filter.HideRowFilter(new spreadNS.Range(2, 1, salesData.length - 1, salesData[0].length));
    sheet.rowFilter(filter);
    //选择想要筛选的数据
    prepareFilterItems(sheet, salesData[0]);
    sheet.defaults.rowHeight = 28;
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 100);
    sheet.setColumnWidth(4, 80);
    sheet.setColumnWidth(5, 80);
    sheet.setColumnWidth(6, 80);
    sheet.getRange(2, 2, 10, 1).formatter("yyyy/mm/dd");

    var ComparisonOperators = spreadNS.ConditionalFormatting.ComparisonOperators;
    var equalsTo = ComparisonOperators.equalsTo;

    var range = sheet.getRange(1, 1, 11, 6);
    range.setBorder(new spreadNS.LineBorder("gray", spreadNS.LineStyle.thin), {all: true});

    var ranges = [new spreadNS.Range(2, 3, 10, 1)];
    var style1 = new spreadNS.Style();
    style1.foreColor = "Accent 2";
    var rule1 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style1, equalsTo, "West", "");
    sheet.conditionalFormats.addRule(rule1);
    var style2 = new spreadNS.Style();
    style2.foreColor = "Accent 3";
    var rule2 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style2, equalsTo, "East", "");
    sheet.conditionalFormats.addRule(rule2);
    var style3 = new spreadNS.Style();
    style3.foreColor = "Accent 6";
    var rule3 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style3, equalsTo, "North", "");
    sheet.conditionalFormats.addRule(rule3);
    var style4 = new spreadNS.Style();
    style4.foreColor = "Accent 1";
    var rule4 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style4, equalsTo, "South", "");
    sheet.conditionalFormats.addRule(rule4);

    ranges = [new spreadNS.Range(2, 2, 10, 1)];
    style1 = new spreadNS.Style();
    style1.backColor = "rgb(241, 135, 102)";
    rule1 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style1, ComparisonOperators.lessThan, "1990/01/01", "");
    sheet.conditionalFormats.addRule(rule1);
    style2 = new spreadNS.Style();
    style2.backColor = "lightGreen";
    rule2 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style2, ComparisonOperators.between, "1990/01/01", "2000/01/01");
    sheet.conditionalFormats.addRule(rule2);
    style3 = new spreadNS.Style();
    style3.backColor = "deepSkyBlue";
    rule3 = new spreadNS.ConditionalFormatting.NormalConditionRule(1, ranges, style3, ComparisonOperators.greaterThan, "2000/01/01", "");
    sheet.conditionalFormats.addRule(rule3);

    sheet.resumePaint();

    // var sheet2 = spread.sheets[1];
    // initOutlineColumnFilter(sheet2);
    // sheet2.name("OutlineColumnFilter");

    //显示筛选条件
    _getElementById("showAll").addEventListener('click',function () {
        if (filter) {
            filter.filterButtonVisible(true);
            checkBoxes.forEach(function(item) {
                item.checked = true;
            });
        }

    });

    //隐藏筛选条件
    _getElementById("hideAll").addEventListener('click',function () {
        if (filter) {
            filter.filterButtonVisible(false);
            checkBoxes.forEach(function(item) {
                item.checked = false;
            });
        }
    });
    _getElementById("sortByValue").addEventListener('change',function () {
        var val = this.checked;
        filter.filterDialogVisibleInfo({
            sortByValue: val
        });
    });
    _getElementById("sortByColor").addEventListener('change',function () {
        var val = this.checked;
        filter.filterDialogVisibleInfo({sortByColor:val});
    });
    _getElementById("filterByColor").addEventListener('change',function () {
        var val = this.checked;
        filter.filterDialogVisibleInfo({filterByColor:val});
    });
    _getElementById("filterByValue").addEventListener('change',function () {
        var val = this.checked;
        filter.filterDialogVisibleInfo({filterByValue:val});
    });
    _getElementById("listFilterArea").addEventListener('change',function () {
        var val = this.checked;
        filter.filterDialogVisibleInfo({listFilterArea:val});
    });
}


//选择想要展示的数据筛选项
function prepareFilterItems(sheet, headers) {
    var items = [];
    var filter = sheet.rowFilter(),
        range = filter.range,
        startColumn = range.col;
    //循环遍历想要获取的数据
    for (var c = 0, length = headers.length; c < length; c++) {
        var name = headers[c];

        items.push('<div><label><input type="checkbox" checked data-index="' + (startColumn + c) + '">'+ name + '</label></div>');
    }
    tableColumnsContainer.innerHTML = items.join("");

    var nodeList = tableColumnsContainer.querySelectorAll("input[type='checkbox']");
    checkBoxes = [];
    for (var i = 0, count = nodeList.length; i < count; i++) {
        var element = nodeList[i];
        checkBoxes.push(element);
        //添加监听事件
        element.addEventListener('change', function () {
            var index = +this.dataset.index; // +this.getAttribute("data-index");
            //判断是否显示筛选条件和筛选后的数据信息
            if (filter) {
                filter.filterButtonVisible(index, this.checked);
            }
        });
    }
}

// function initOutlineColumnFilter(sheet) {
//     sheet.setColumnWidth(2, 120);
//     sheet.rowFilter(new GC.Spread.Sheets.Filter.HideRowFilter(new GC.Spread.Sheets.Range(-1, 0, -1, 1)));
//     sheet.suspendPaint();
//     sheet.setColumnWidth(0, 200);
//     sheet.setRowCount(12);
//     sheet.outlineColumn.options({
//         columnIndex: 0,
//         showIndicator: true,
//     });

//     var sd = data;
//     sheet.setDataSource(sd);
//     sheet.bindColumn(0, "name");
//     sheet.setColumnCount(3);
//     sheet.setColumnWidth(0, 300);
//     for (var r = 0; r < sd.length; r++) {
//         var level = sd[r].level;
//         sheet.getCell(r, 0).textIndent(level);

//     }
//     sheet.showRowOutline(true);
//     sheet.outlineColumn.refresh();
//     sheet.resumePaint();
// }

//获取元素的方法
function _getElementById(id){
    return document.getElementById(id);
}
