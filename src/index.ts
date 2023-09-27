import { Layer, Window, WindowManager } from './mingde/wm.js';
import { DesktopBackground } from './mingde/desktop_background.js';
import { Taskbar } from './mingde/taskbar.js';
import { TASKBAR_HEIGHT, SCALE } from './mingde/constants.js';

let wm = new WindowManager("canvas-container");

wm.set_layers([new Layer(wm, "desktop"), new Layer(wm, "windows", true), new Layer(wm, "taskbar")]);

wm.layers[2].add_member(new Taskbar(), [0, document.body.clientHeight - TASKBAR_HEIGHT / SCALE]);

wm.layers[0].add_member(new DesktopBackground(), [0, 0]);

wm.layers[1].add_member(new Window([300, 200], "Title"), [50, 50]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [350, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [370, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [390, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [410, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [420, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [430, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [440, 250]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [445, 255]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [447, 260]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [449, 180]);

wm.layers[1].add_member(new Window([300, 200], "Test 123"), [437, 190]);

wm.render();
