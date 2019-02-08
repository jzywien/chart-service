export const stringify = function (obj) {
    var placeholder = '____PLACEHOLDER____';
    var fns = [];
    var json = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'function') {
            fns.push(value);
            return placeholder;
        }
        return value;
    }, 2);
    json = json.replace(new RegExp(`"${placeholder}"`, 'g'), function (_) {
        return fns.shift();
    });

    return json;
}; 