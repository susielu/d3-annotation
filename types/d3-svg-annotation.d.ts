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
type AnnotationEvent =
  | 'subjectover'
  | 'subjectout'
  | 'subjectclick'
  | 'connectorover'
  | 'connectorout'
  | 'connectorclick'
  | 'noteover'
  | 'noteout'
  | 'noteclick'
  | 'dragend'
  | 'dragstart';

type BBox = {
  x: number,
  y: number,
  width: number,
  height: number
};

interface AnnotationConfig {
  classname: string;
  color?: string;
  connector?: {
    end?: string;
    endScale?: number;
    type?: string;
    points?: any[];
  };
  data: any;
  disable?: Array<'connector' | 'subject' | 'note'>;
  dx?: number;
  dy?: number;
  id: string | number;
  note?: {
    label?: string | number;
    title?: string | number;
    wrap?: number;
    align?: Align;
  };
  nx?: number;
  ny?: number;
  subject?: {
    radius?: number;
  };
  type?: any;
  x?: number;
  y?: number;
}

export default class Annotation<T> {

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

  constructor(args: AnnotationConfig);

  annotations(anotations: AnnotationConfig[]): Annotation<T>;
  accessors(accessors: { x?: (datum: T) => any, y?: (datum: T) => any }): Annotation<T>;
  accessorsInverse(accessors: any): Annotation<T>;
  editMode(editMode: boolean): Annotation<T>;
  notePadding(padding: number): Annotation<T>;
  type(type: any): Annotation<T>;
  updatePosition(): void;
  updateOffset(): void;
  update(): Annotation<T>;
  updatedAccessors(): Annotation<T>;
  on(
    event: AnnotationEvent,
    callback: (target: Annotation<T>) => void
  ): Annotation<T>;
}

export class Type<T> {
  a: Selection<BaseType, any, any, any>;
  note: Selection<Element, any, any, any> | false;
  noteContent: Selection<Element, any, any, any> | false;
  connector: Selection<Element, any, any, any> | false;
  subject: Selection<Element, any, any, any> | false;
  annotation: Annotation<T>;
  editMode: boolean;
  notePadding: number;
  offsetCornerX: number;
  offsetCornerY: number;

  constructor(args: {
    a: Selection<any, any, any, any>,
    annotation: Annotation<T>,
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
export class annotationLabel<T> extends Type<T> { }
export class annotationCallout<T> extends Type<T> { }
export class annotationCalloutElbow<T> extends Type<T> { }
export class annotationCalloutCurve<T> extends Type<T> { }
export class annotationCalloutCircle<T> extends Type<T> { }
export class annotationCalloutRect<T> extends Type<T> { }
export class annotationXYThreshold<T> extends Type<T> { }
export class annotationBadge<T> extends Type<T> { }

interface CustomAnnotationSettings {
  disable?: string[];
  className?: string;
  subject?: any;
  connector?: any;
  note?: any;
}

export class annotationCustomType<T> extends Type<T> {
  constructor(type: typeof Type, settings: CustomAnnotationSettings);
}

export function annotation<T>(): Annotation<T>;

export as namespace d3;
