
function typeNameToOrderNumber(typeName) {
    switch (typeName) {
        case "Daily":
            return 1;
        case "Weekly":
            return 2;
        case "Monthly":
            return 3;
        default: 
            return 4;
    }
}

exports.performSort = function (entries) {
    return entries.sort(function (entryA, entryB) {
        var typeAOrder = typeNameToOrderNumber(entryA.typeName);
        var typeBOrder = typeNameToOrderNumber(entryB.typeName);

        return typeAOrder - typeBOrder;
    });
}