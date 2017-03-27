import { Dispatch } from 'd3-dispatch';
import { BaseType, Selection } from 'd3-selection';

type Accessors = {
  [k: string]: () => number
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

  annotations(anotations: any[]): Annotation;
  accessors(accessors: any): Annotation;
  editMode(editMode: boolean): Annotation;
  type(type: any): Annotation;
  updatePosition(): void;
  updateOffset(): void;
  update(): void;
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

  drawNoteContent(context: {
    orientation: Orientation,
    lineType: LineType,
    align: Align,
    bbox: BBox,
  }): Array<void>;

  drawOnScreen(component: any, drawFunction: () => any): void;

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
export class annotationLabel extends Type { }
export class annotationCallout extends Type { }
export class annotationCalloutElbow extends Type { }
export class annotationCalloutCurve extends Type { }
export class annotationCalloutCircle extends Type { }
export class annotationCalloutRect extends Type { }
export class annotationXYThreshold extends Type { }
export class annotationBadge extends Type { }

export function annotation(): Annotation;