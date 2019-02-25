'use strict';

goog.require('Blockly.JavaScript');

Blockly.JavaScript['led_matrix_input'] = function (block) {
    var index_matrix = block.getFieldValue('matrix');
    var value_led_matrix_ = Blockly.JavaScript.valueToCode(block, 'led_matrix_', Blockly.JavaScript.ORDER_MEMBER);
    value_led_matrix_ = value_led_matrix_ ? JSON.parse(value_led_matrix_) : null;

    if (!value_led_matrix_) {
        return null;
    }

    var obj = {
        index: parseInt(index_matrix),
        value: value_led_matrix_
    };

    var output = JSON.stringify(obj);
    var code = 'ledManager.setRawLedByMatrixObject(' + output + ');\n';
    return code;
};

Blockly.JavaScript['led_6x6'] = function (block) {
    var ledRows = [];
    for (let x = 1; x <= constValue.BoardHeight; x++) {
        var ledColumns = [];
        for (var y = 1; y <= constValue.BoardWidth; y++) {
            var valueName = ['led', x, '_', y].join('');
            var color = block.getFieldValue(valueName);
            color = color == utils.NONE_COLOR ?
                -1 :
                color;
            ledColumns.push(color);
        }
        ledRows.push(ledColumns);
    }

    var code = JSON.stringify(ledRows);
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['setLed'] = function (block) {
    var number_x = block.getFieldValue('x');
    var number_y = block.getFieldValue('y');
    var colour_led_clr = block.getFieldValue('led_clr');

    var code = 'ledManager.setLed(' +
        number_x + ',' +
        number_y + ',"' +
        colour_led_clr + '");\n';
    return code;
};

Blockly.JavaScript['led_enabled'] = function (block) {
    var number_x = block.getFieldValue('x');
    var number_y = block.getFieldValue('y');
    var code = 'ledManager.isLedEnabled(' + number_x + ',' + number_y + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['led_color'] = function (block) {
    var number_x = block.getFieldValue('x');
    var number_y = block.getFieldValue('y');
    var code = 'ledManager.getLedColor(' + number_x + ',' + number_y + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['button_status'] = function (block) {
    var number_x = block.getFieldValue('x');
    var number_y = block.getFieldValue('y');
    var code = 'ledManager.getButtonStatus(' + number_x + ',' + number_y + ') != 0';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['led_78x18'] = function (block) {
    var ledRows = [];
    for (let x = 1; x <= constValue.TotalHeight; x++) {
        var ledColumns = [];
        for (var y = 1; y <= constValue.TotalWidth; y++) {
            var valueName = ['led', x, '_', y].join('');
            var color = block.getFieldValue(valueName);
            color = color == utils.NONE_COLOR ?
                -1 :
                color;
            ledColumns.push(color);
        }
        ledRows.push(ledColumns);
    }

    var code = JSON.stringify(ledRows);
    return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['set_full_led'] = function (block) {
    var fullLed = Blockly.JavaScript.valueToCode(block, 'full_led_matrix', Blockly.JavaScript.ORDER_MEMBER);
    if (!fullLed) {
        return null;
    }

    var code = 'ledManager.setRawLedStatus(' + fullLed + ');\n';
    return code;
};

Blockly.JavaScript['marquee_led'] = function (block) {
    var shiftValue = block.getFieldValue('shift');

    var code = 'ledManager.marqueeLed(' + shiftValue + ');\n';
    return code;
};

Blockly.JavaScript['elapsed_time'] = function (block) {
    var number_millisecond = block.getFieldValue('millisecond');

    var code = 'runtimeValue.isElapsedGreaterThen(' + number_millisecond + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['reset_elapsed_time'] = function (block) {
    var code = 'runtimeValue.resetElapsed();\n';
    return code;
};

Blockly.JavaScript['render_image'] = function (block) {
    var value_filename = Blockly.JavaScript.valueToCode(block, 'fileName', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'ledManager.renderImage(' + value_filename + ');\n';
    return code;
};

Blockly.JavaScript['render_image_set'] = function (block) {
    var value_prefix = Blockly.JavaScript.valueToCode(block, 'prefix', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_imageoptions = block.getFieldValue('imageOptions');
    var value_imgindex = Blockly.JavaScript.valueToCode(block, 'imgIndex', Blockly.JavaScript.ORDER_ATOMIC);
    var number_start = block.getFieldValue('start');
    var number_end = block.getFieldValue('end');

    var count = number_end - number_start + 1;
    var filename = [value_prefix, value_imgindex, '\'' + dropdown_imageoptions + '\''].join('+');
    var code = value_imgindex + ' = ' + value_imgindex + ' == undefined ?\n';
    code += '   ' + number_start + ' :\n';
    code += '   ' + value_imgindex + ';\n';
    code += value_imgindex + ' = ' + value_imgindex + ' % ' + count + ';\n';
    code += 'ledManager.renderImage(' + filename + ');\n';
    code += value_imgindex + '++;\n';
    return code;
};
