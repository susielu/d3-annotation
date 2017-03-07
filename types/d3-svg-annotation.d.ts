import { Dispatch } from 'd3-dispatch';
import { BaseType, Selection } from 'd3-selection';

type Accessors = {
  [k: string]: (any) => number
};

// TODO figure out what these actually are.
type Components = any[];

type Orientation = 'topBottom' | 'leftRight' | 'fixed';
type Align = 'dynamic' | 'left' | 'right' | 'top' | 'bottom' | 'middle';
type LineType = 'horizontal' | 'vertical' | 'none';

type BBox = {
  x: number,
  y: number,
  width: number,
  height: number
};

export default class Annotation {

  className: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  offset: {
    x: number;
    y: number;
  };
  position: {
    x: number;
    y: number;
  };
  readonly translation: {
    x: number;
    y: number;
  };
  readonly json: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };

  constructor({ x, y, dy, dx, data, type, subject, connector, note, disable, id, className }: {
    x?: number;
    y?: number;
    dy?: number;
    dx?: number;
    data: any;
    type: any;
    subject: any;
    connector: any;
    note: any;
    disable: any;
    id: any;
    className: string;
  });

  updatePosition(): void;
  updateOffset(): void;
}

export class Type {
  a: Selection<BaseType, any, any, any>;
  note: Selection<Element, any, any, any> | false;
  noteContent: Selection<Element, any, any, any> | false;
  connector: Selection<Element, any, any, any> | false;
  subject: Selection<Element, any, any, any> | false;
  annotation: Annotation;
  editMode: boolean;
  notePadding: number;
  offsetCornerX: number;
  offsetCornerY: number;

  constructor(args: {
    a: Selection<any, any, any, any>,
    annotation: Annotation,
    editMode?: boolean,
    dispatcher?: Dispatch<Element>,
    notePadding?: number,
    accessors?: Accessors
  });

  init(accessors: Accessors): void;

  mapY(accessors: Accessors): void;

  mapX(accessors: Accessors): void;

  updateEditMode(): void;

  drawOnSVG(
    component: Selection<Element, any, any, any>,
    builders: Array<
      { type: string, className: string, attributes: {}, handles?: any[] }>):
    void;

  getNoteBBox(): BBox;

  getNoteBBoxOffset(): BBox;

  drawSubject(context?: { type: string }): Components;

  drawConnector(context?: { type: string, end: string }): Components;

  drawNote(context: {
    orientation: Orientation,
    align: Align,
    lineType: LineType,
    bbox: BBox,
  }): Components;

  drawNoteContent({
    orientation: Orientation,
    lineType: LineType,
    align: Align,
    bbox: BBox,
  }): Array<void>;

  drawOnScreen(component: any, drawFunction: (any) => any): void;

  redrawSubmit(): void;

  redrawConnector(bbox?: BBox): void;

  redrawNote(bbox?: BBox): void;

  setPosition(): void;

  setOffset(): void;

  setPositionWithAccessors(accessors?: Accessors): void;

  setClassName(): void;

  draw(): void;

  dragstarted(): void;
  drawended(): void;
  dragSubject(): void;
  dragNode(): void;
  mapHandler(handles: Array<{}>): { start: () => void, end: () => void };
}

// TODO define these
export class d3Label extends Type { }
export class d3Callout extends Type { }
export class d3CalloutElbow extends Type { }
export class d3CalloutCurve extends Type { }
export class d3CalloutCircle extends Type { }
export class d3CalloutRect extends Type { }
export class d3XYThreshold extends Type { }
export class d3Badge extends Type { }
