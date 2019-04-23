Blockly.FieldColour.COLOURS = [
    utils.NONE_COLOR,
    utils.COLOR_BLACK_0,
    utils.COLOR_WHITE_1,
    utils.COLOR_RED_2,
    utils.COLOR_ORANGE_3,
    utils.COLOR_YELLOW_4,
    utils.COLOR_GREEN_5,
    utils.COLOR_BLUE_6,
    utils.COLOR_INDIGO_7,
    utils.COLOR_PURPLE_8,
];
Blockly.FieldColour.COLUMNS = 3;

Blockly.Blocks['led_matrix_input'] = {
    init: function () {
        this.appendValueInput("led_matrix_")
            // .appendField(new Blockly.FieldVariable("matrix"), "matrix_var")
            .appendField("Set LED matrix")
            .appendField(new Blockly.FieldDropdown([
                ["1", "0"],
                ["2", "1"],
                ["3", "2"],
                ["4", "3"],
                ["5", "4"],
                ["6", "5"],
                ["7", "6"],
                ["8", "7"],
                ["9", "8"],
                ["10", "9"],
                ["11", "10"],
                ["12", "11"],
                ["13", "12"],
                ["14", "13"],
                ["15", "14"],
                ["16", "15"],
                ["17", "16"],
                ["18", "17"],
                ["19", "18"],
                ["20", "19"],
                ["21", "20"],
                ["22", "21"],
                ["23", "22"],
                ["24", "23"],
                ["25", "24"],
                ["26", "25"],
                ["27", "26"],
                ["28", "27"],
                ["29", "28"],
                ["30", "29"],
                ["31", "30"],
                ["32", "31"],
                ["33", "32"],
                ["34", "33"],
                ["35", "34"],
                ["36", "35"],
                ["37", "36"],
                ["38", "37"],
                ["39", "38"],
            ]), "matrix")
            .setCheck("led_6x6");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_6x6'] = {
    init: function () {
        for (var x = 1; x <= constValue.BoardHeight; x++) {
            var block = this.appendDummyInput();
            for (var y = 1; y <= constValue.BoardWidth; y++) {
                var valueName = ['led', x, '_', y].join('');
                block.appendField(new Blockly.FieldColour(utils.NONE_COLOR), valueName);
            }
        }

        this.setOutput(true, 'led_6x6');
        this.setColour(180);
        this.setTooltip("灰色表示不變更當前顏色");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['setLed'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set LED ( X:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalHeight), "x")
            .appendField(", Y:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalWidth), "y")
            .appendField(")")
            .appendField(new Blockly.FieldColour(utils.NONE_COLOR), "led_clr");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150);
        this.setTooltip("x: [1~18], y: [1~78]");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_enabled'] = {
    init: function () {
        this.appendDummyInput()
            // .appendField(new Blockly.FieldVariable("led_enabled"), "led_enabled")
            .appendField("Led ( X:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalHeight), "x")
            .appendField(", Y:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalWidth), "y")
            .appendField(") is enabled");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("x: [1~18], y: [1~78]");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_color'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Led Color: ( X:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalHeight), "x")
            .appendField(", Y:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalWidth), "y")
            .appendField(")");
        this.setOutput(true, "Number");
        this.setColour(210);
        this.setTooltip("x: [1~18], y: [1~78]");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['set_full_led'] = {
    init: function () {
        this.appendValueInput("full_led_matrix")
            .setCheck("led_78x18")
            .appendField("LED");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['led_78x18'] = {
    init: function () {
        for (var x = 1; x <= constValue.TotalHeight; x++) {
            var block = this.appendDummyInput();
            for (var y = 1; y <= constValue.TotalWidth; y++) {
                var valueName = ['led', x, '_', y].join('');
                block.appendField(new Blockly.FieldColour(utils.NONE_COLOR), valueName);
            }
        }

        this.setOutput(true, 'led_78x18');
        this.setColour(180);
        this.setTooltip("灰色表示不變更當前顏色");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['button_status'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Button ( X:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalHeight), "x")
            .appendField(", Y:")
            .appendField(new Blockly.FieldNumber(1, 1, constValue.TotalWidth), "y")
            .appendField(") is enabled");
        this.setOutput(true, "Boolean");
        this.setColour(325);
        this.setTooltip("x: [1~18], y: [1~78]");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['marquee_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("位移 LED")
            .appendField(new Blockly.FieldDropdown([
                ["往左", "1"],
                ["往右", "-1"]
            ]), "shift");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['elapsed_time'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("經過")
            .appendField(new Blockly.FieldNumber(100, 100), "millisecond")
            .appendField("毫秒");
        this.setOutput(true, "Boolean");
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['reset_elapsed_time'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("重置經過時間");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['render_image'] = {
    init: function () {
        this.appendValueInput("fileName")
            .setCheck("String")
            .appendField("Render image")
            .appendField("檔案名稱");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("支援 jpg, png");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['render_image_set'] = {
    init: function () {
        this.appendValueInput("prefix")
            .setCheck("String")
            .appendField("Render")
            .appendField(" 圖集");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["JPG", ".jpg"],
                ["PNG", ".png"]
            ]), "imageOptions")
            .appendField("代數 = ");
        this.appendValueInput("imgIndex")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(")
            .appendField(new Blockly.FieldNumber(0, 0), "start")
            .appendField("~")
            .appendField(new Blockly.FieldNumber(0, 0), "end")
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};