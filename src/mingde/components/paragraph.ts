import { Component, WindowLike, WindowMessage } from '../wm.js';
import { Themes, ThemeInfo, THEME_INFOS } from '../themes.js';
import { SCALE, FONT_NAME, FONT_NAME_MONO, FONT_SIZES } from '../constants.js';

export const DEFAULT_LINE_HEIGHT_EXTRA: number = 2;

export class Paragraph<MessageType> implements Component<MessageType> {
  readonly type: string = "paragraph";
  clickable: boolean = false;

  id: string;
  readonly parent: WindowLike<MessageType | WindowMessage>;
  text: string;
  coords: [number, number];
  size: [number, number];
  color: keyof ThemeInfo;
  font_size: keyof typeof FONT_SIZES;
  line_width: number;
  monospace: boolean;
  line_height?: number;

  lines: string[];

  private cached_theme: Themes;
  
  constructor(parent: WindowLike<MessageType | WindowMessage>, text: string, coords: [number, number], color: keyof ThemeInfo, font_size: keyof typeof FONT_SIZES, line_width: number, line_height?: number, monospace: boolean = false) {
    this.parent = parent;
    this.text = text;
    this.coords = [coords[0] * SCALE, coords[1] * SCALE];
    this.color = color;
    this.font_size = font_size;
    this.line_width = line_width * SCALE;
    this.line_height = line_height;
    this.monospace = monospace;
    //do not set lines in the function since otherwise strict compiler will be annoying
    this.lines = this.calculate_lines();
  }
  get lines_length(): number {
    return this.lines.length;
  }
  calculate_lines(): string[] {
    let lines: string[] = [];
    let line: string = "";
    this.parent.context.font = `${FONT_SIZES[this.font_size]}px ${ this.monospace ? FONT_NAME_MONO : FONT_NAME }`;
    let words: string[] = this.text.split(" ");
    for (let i = 0; i < words.length; i++) {
      let measured_width: number = this.parent.context.measureText(line + words[i]).width;
      if (words[i] === "\n") {
        lines.push(line);
        line = "";
      } else if (measured_width > this.line_width) {
        let overflow_measured_width: number = this.parent.context.measureText(words[i]).width;
        if (overflow_measured_width > this.line_width) {
          //if word gets too long, break it up and wrap over several lines
          let word_line: string = line; //starting from the current line (don't start long word on new line)
          for (let j = 0; j < words[i].length; j++) {
            let word_measured_width: number = this.parent.context.measureText(word_line + words[i][j]).width;
            if (word_measured_width > this.line_width && word_line.length === 0) {
              //if single character larger than line width, fit it on the line anyways (otherwise it will never display)
              lines.push(words[i][j]);
            } if (word_measured_width > this.line_width) {
              lines.push(word_line);
              word_line = words[i][j];
            } else {
              word_line += words[i][j];
            }
          }
          if (word_line.length > 0) {
            line = word_line + " ";
          } else {
            line = "";
          }
        } else {
          lines.push(line);
          line = words[i] + " ";
        }
      } else {
        line += words[i] + " ";
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  render_view(theme: Themes, context: CanvasRenderingContext2D = this.parent.context) {
    const theme_info: ThemeInfo = THEME_INFOS[theme];
    context.font = `${FONT_SIZES[this.font_size]}px ${ this.monospace ? FONT_NAME_MONO : FONT_NAME }`;
    context.fillStyle = theme_info[this.color];
    context.textBaseline = "bottom";
    //if needed, calculate lines
    if (this.cached_theme !== theme) {
      this.lines = this.calculate_lines();
      this.cached_theme = theme;
    }
    let line_height: number = typeof this.line_height === "number" ? this.line_height : FONT_SIZES[this.font_size] + DEFAULT_LINE_HEIGHT_EXTRA;
    this.size = [this.line_width, line_height * this.lines.length];
    for (let i = 0; i < this.lines.length; i++) {
      context.fillText(this.lines[i], this.coords[0], this.coords[1] + i * line_height);
    }
  }
  handle_message(_message: MessageType | WindowMessage, _data: any) {
    //
  }
}

