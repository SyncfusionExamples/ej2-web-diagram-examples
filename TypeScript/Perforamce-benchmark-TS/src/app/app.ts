import {
  Diagram,
  NodeModel,
  ConnectorModel,
  SnapConstraints,
  DataBinding,
  HierarchicalTree,
  ComplexHierarchicalTree,
  MindMap,
  Node,
  ImageElement,
  LineDistribution,
  ConnectionPointOrigin,
  LayoutModel,
  PointModel
} from '@syncfusion/ej2-diagrams';
import {
  Canvas,
  StackPanel,
  TextElement,
  PathElement,
  GroupableView,
} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';

Diagram.Inject(DataBinding, HierarchicalTree, ComplexHierarchicalTree, MindMap, LineDistribution);

// ----------------------------------------------------
// Types
// ----------------------------------------------------
type RenderMode = 'init' | 'con' | 'htree' | 'ctree' | 'org' | 'mind' | 'orgtpl';

interface HierarchyItem {
  id: string;
  parentId: string | null;      // primary parent (for normal tree)
  parentIds?: string[];         // all parents (for complex / multi-parent layout)
  name: string;
  role: string;
  dept: string;
  level: number;
  fill: string;
  border: string;
}


// ----------------------------------------------------
// DOM References
// ----------------------------------------------------
const nodeCountInput = document.getElementById('nodeCount') as HTMLInputElement;
const connectorCountInput = document.getElementById(
  'connectorCount'
) as HTMLInputElement;
const showAnnotationsInput = document.getElementById(
  'showAnnotations'
) as HTMLInputElement;

const btnInitialLoad = document.getElementById(
  'btnInitialLoad'
) as HTMLButtonElement;
const btnDragTest = document.getElementById('btnDragTest') as HTMLButtonElement;
const btnResizeTest = document.getElementById(
  'btnResizeTest'
) as HTMLButtonElement;
const btnRotateTest = document.getElementById(
  'btnRotateTest'
) as HTMLButtonElement;
const btnConnectorDragTest = document.getElementById(
  'btnConnectorDragTest'
) as HTMLButtonElement;
const btnClearLog = document.getElementById('btnClearLog') as HTMLButtonElement;

const btnHierarchy = document.getElementById(
  'btnHierarchy'
) as HTMLButtonElement;
const btnComplex = document.getElementById('btnComplex') as HTMLButtonElement;
const btnOrg = document.getElementById('btnOrg') as HTMLButtonElement;
const btnMind = document.getElementById('btnMind') as HTMLButtonElement;
const btnOrgTemplate = document.getElementById(
  'btnOrgTemplate'
) as HTMLButtonElement;

const statusText = document.getElementById('statusText') as HTMLElement;
const lastActionText = document.getElementById('lastActionText') as HTMLElement;
const currentModeText = document.getElementById(
  'currentModeText'
) as HTMLElement;
const liveTimestamp = document.getElementById('liveTimestamp') as HTMLElement;
const logElement = document.getElementById('log') as HTMLDivElement;

const btnSelect10 = document.getElementById('btnSelect10') as HTMLButtonElement;
const btnSelect50 = document.getElementById('btnSelect50') as HTMLButtonElement;
const btnOneConnector = document.getElementById(
  'btnOneConnector'
) as HTMLButtonElement;
const connectorTypeSelect = document.getElementById(
  'connectorTypeSelect'
) as HTMLSelectElement;

// ----------------------------------------------------
// Global State
// ----------------------------------------------------
let diagram: Diagram | null = null;
let currentMode: RenderMode = 'init';
let pendingRenderStart = 0;

const eventStartTimes: Record<
  'positionChange' | 'sizeChange' | 'rotateChange',
  number | null
> = {
  positionChange: null,
  sizeChange: null,
  rotateChange: null,
};

// ----------------------------------------------------
// Logging / Status
// ----------------------------------------------------
function nowTimeLabel(): string {
  return new Date().toLocaleTimeString();
}

function getSelectedNodes(): NodeModel[] {
  const d = ensureDiagram();
  return (d.selectedItems.nodes || []) as NodeModel[];
}

function selectFirstNodes(count: number): void {
  const d = ensureDiagram();
  const nodesToSelect = d.nodes.slice(0, Math.min(count, d.nodes.length));
  d.clearSelection();
  d.select(nodesToSelect as any);
  appendLog(`Selected first ${nodesToSelect.length} nodes.`, 'success');
  setLastAction(`Sel ${nodesToSelect.length}`);
}

function ensureSelectionForBulkAction(defaultCount = 10): NodeModel[] {
  let selected = getSelectedNodes();
  if (!selected.length) {
    selectFirstNodes(defaultCount);
    selected = getSelectedNodes();
  }
  return selected;
}

function setStatus(text: string): void {
  statusText.textContent = text;
  liveTimestamp.textContent = nowTimeLabel();
}

function setLastAction(text: string): void {
  lastActionText.textContent = text;
}

function setModeLabel(mode: RenderMode): void {
  const map: Record<RenderMode, string> = {
    init: 'Init',
    con: 'One Connector',
    htree: 'Hierarchical Tree',
    ctree: 'Complex Tree',
    org: 'Org Chart',
    mind: 'Mind Map',
    orgtpl: 'Org Chart Template',
  };
  currentModeText.textContent = map[mode];
}

function appendLog(
  message: string,
  type: 'info' | 'success' | 'warn' | 'error' = 'info'
): void {
  const item = document.createElement('div');
  item.className = `log-entry ${type}`;
  item.innerHTML = `[${nowTimeLabel()}] ${message}`;
  logElement.prepend(item);
}

function clearLog(): void {
  logElement.innerHTML = '';
  appendLog('Log cleared.', 'info');
}

// ----------------------------------------------------
// Async helpers
// ----------------------------------------------------
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function nextTwoFrames(): Promise<void> {
  await nextFrame();
  await nextFrame();
}

// ----------------------------------------------------
// Browser Mouse Event simulator
// ----------------------------------------------------
class MouseEvents {
  private createMouseEvent(
    type: string,
    x: number,
    y: number,
    buttons = 1
  ): MouseEvent {
    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      button: 0,
      buttons,
      view: window,
    });
  }

  public mouseDownEvent(target: Element, x: number, y: number): void {
    target.dispatchEvent(this.createMouseEvent('mousedown', x, y, 1));
  }

  public mouseMoveEvent(target: Element, x: number, y: number): void {
    target.dispatchEvent(this.createMouseEvent('mousemove', x, y, 1));
  }

  public mouseUpEvent(target: Element, x: number, y: number): void {
    target.dispatchEvent(this.createMouseEvent('mouseup', x, y, 0));
  }

  public async dragAndDrop(
    downTarget: Element,
    moveTarget: Element,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    steps = 12,
    stepDelayMs = 12
  ): Promise<void> {
    this.mouseDownEvent(downTarget, fromX, fromY);

    for (let i = 1; i <= steps; i++) {
      const x = fromX + ((toX - fromX) * i) / steps;
      const y = fromY + ((toY - fromY) * i) / steps;
      this.mouseMoveEvent(moveTarget, x, y);
      await delay(stepDelayMs);
    }

    this.mouseUpEvent(moveTarget, toX, toY);
  }
}

const mouseEvents = new MouseEvents();

// ----------------------------------------------------
// Utility
// ----------------------------------------------------
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getNodeCount(): number {
  return clamp(parseInt(nodeCountInput.value || '70', 10), 10, 10000);
}

function getConnectorCount(): number {
  return clamp(parseInt(connectorCountInput.value || '70', 10), 0, 10000);
}

function shouldShowAnnotations(): boolean {
  return showAnnotationsInput.checked;
}

function getShapeAnnotation(content: string) {
  return [
    {
      content,
      style: {
        color: 'white',
        fontSize: 12,
        bold: true,
      },
    },
  ];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ----------------------------------------------------
// Hierarchical JSON data source (50-100 items)
// ----------------------------------------------------
function createHierarchyData(
  total: number,
  complexTree = false
): HierarchyItem[] {
  const count = clamp(total, 10, 10000);

  const fills = [
    '#4F46E5',
    '#0EA5E9',
    '#10B981',
    '#F59E0B',
    '#EC4899',
    '#8B5CF6',
  ];

  const borders = [
    '#312E81',
    '#075985',
    '#065F46',
    '#92400E',
    '#9D174D',
    '#5B21B6',
  ];

  const roleByLevel = [
    'Chief',
    'Director',
    'Manager',
    'Lead',
    'Senior Engineer',
    'Engineer',
    'Associate',
  ];

  const deptByLevel = [
    'Executive',
    'Business',
    'Platform',
    'Applications',
    'Operations',
    'Support',
    'Delivery',
  ];

  // Number of children per parent by level.
  // After this array ends, the last value is reused.
  const childPlan = [4, 4, 3, 3, 2, 2];

  const items: HierarchyItem[] = [
    {
      id: 'node1',
      parentId: null,
      parentIds: [],
      name: 'Node 1',
      role: roleByLevel[0],
      dept: deptByLevel[0],
      level: 0,
      fill: fills[0],
      border: borders[0],
    },
  ];

  if (count === 1) {
    return items;
  }

  const queue: HierarchyItem[] = [items[0]];
  let nextIndex = 2;

  // -----------------------------
  // 1. Build normal tree first
  // -----------------------------
  while (items.length < count) {
    const current = queue.shift();

    if (!current) {
      break;
    }

    const level = current.level;
    const maxChildren = childPlan[Math.min(level, childPlan.length - 1)];

    const remaining = count - items.length;
    const childCount = Math.min(maxChildren, remaining);

    for (let i = 0; i < childCount; i++) {
      const childLevel = level + 1;
      const colorIndex = (nextIndex - 1) % fills.length;

      const child: HierarchyItem = {
        id: `node${nextIndex}`,
        parentId: current.id,
        parentIds: [current.id], // initialize with primary parent
        name: `Node ${nextIndex}`,
        role: roleByLevel[Math.min(childLevel, roleByLevel.length - 1)],
        dept: deptByLevel[Math.min(childLevel, deptByLevel.length - 1)],
        level: childLevel,
        fill: fills[colorIndex],
        border: borders[colorIndex],
      };

      items.push(child);
      queue.push(child);
      nextIndex++;

      if (items.length >= count) {
        break;
      }
    }
  }

  // -----------------------------
  // 2. Add multi-parent links
  //    at least 1 in every 10 nodes
  // -----------------------------
  if (!complexTree) {
    return items;
  }

  // Eligible nodes: cannot be root, and should have some depth
  const eligibleNodes = items.filter(x => x.level >= 2);

  if (eligibleNodes.length === 0) {
    return items;
  }

  // At least 1 per 10 nodes
  const multiParentTarget = Math.max(1, Math.floor(count / 10));

  let assigned = 0;

  // Pick approximately every 10th node
  for (let i = 9; i < items.length && assigned < multiParentTarget; i += 10) {
    const node = items[i];

    // root / shallow nodes are harder to make meaningful multi-parent nodes
    if (!node || node.level < 2 || !node.parentId) {
      continue;
    }

    // possible extra parents:
    // - not self
    // - not already the primary parent
    // - from an earlier / higher level node to avoid odd cycles
    const candidateParents = items.filter(candidate =>
      candidate.id !== node.id &&
      candidate.id !== node.parentId &&
      candidate.level < node.level
    );

    if (candidateParents.length === 0) {
      continue;
    }

    // deterministic selection
    const extraParent =
      candidateParents[(assigned * 7 + i) % candidateParents.length];

    if (!extraParent) {
      continue;
    }

    node.parentIds = [node.parentId, extraParent.id];
    assigned++;
  }

  // If for some reason we didn't reach the target, fill remaining from eligible nodes
  if (assigned < multiParentTarget) {
    for (const node of eligibleNodes) {
      if (assigned >= multiParentTarget) {
        break;
      }

      if (!node.parentId) {
        continue;
      }

      // skip if already multi-parent
      if (node.parentIds && node.parentIds.length > 1) {
        continue;
      }

      const candidateParents = items.filter(candidate =>
        candidate.id !== node.id &&
        candidate.id !== node.parentId &&
        candidate.level < node.level
      );

      if (candidateParents.length === 0) {
        continue;
      }

      const extraParent =
        candidateParents[(assigned * 5 + node.level) % candidateParents.length];

      if (!extraParent) {
        continue;
      }

      node.parentIds = [node.parentId, extraParent.id];
      assigned++;
    }
  }

  return items;
}


// ----------------------------------------------------
// Linear data for Init mode
// ----------------------------------------------------
function createLinearData(
  nodeCount: number,
  connectorCount: number
): {
  nodes: NodeModel[];
  connectors: ConnectorModel[];
} {
  const nodes: NodeModel[] = [];
  const connectors: ConnectorModel[] = [];
  const showText = shouldShowAnnotations();

  const cols = Math.max(5, Math.ceil(Math.sqrt(nodeCount)));
  const spacingX = 100;
  const spacingY = 100;
  const startX = 100;
  const startY = 90;

  for (let i = 0; i < nodeCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    nodes.push({
      id: `node${i + 1}`,
      width: 50,
      height: 50,
      offsetX: startX + col * spacingX,
      offsetY: startY + row * spacingY,
      shape: { type: 'Basic', shape: 'Rectangle' },
      annotations: showText ? getShapeAnnotation(String(i + 1)) : [],
      style: {
        fill: i % 2 === 0 ? '#4F46E5' : '#0EA5E9',
        strokeColor: '#ffffff',
        strokeWidth: 1.5,
      },
    });
  }

  for (let i = 0; i < connectorCount; i++) {
    const sourceIndex = i % nodeCount;
    const targetIndex = (i + 1) % nodeCount;

    connectors.push({
      id: `connector${i + 1}`,
      type: 'Straight',
      sourceID: nodes[sourceIndex].id,
      targetID: nodes[targetIndex].id,
      style: {
        strokeColor: '#64748B',
        strokeWidth: 1.6,
      },
      targetDecorator: {
        shape: 'Arrow',
        width: 8,
        height: 8,
        style: {
          fill: '#64748B',
          strokeColor: '#64748B',
        },
      },
    });
  }

  return { nodes, connectors };
}

// ----------------------------------------------------
// Complex hierarchical data (derived from same base JSON)
// ----------------------------------------------------
function createComplexGraphFromHierarchy(data: HierarchyItem[]): {
  nodes: NodeModel[];
  connectors: ConnectorModel[];
} {
  const showText = shouldShowAnnotations();

  const nodes: NodeModel[] = data.map((item) => ({
    id: item.id,
    width: 90,
    height: 44,
    annotations: showText ? getShapeAnnotation(item.name) : [],
    shape: { type: 'Basic', shape: 'Rectangle' },
    style: {
      fill: item.fill,
      strokeColor: item.border,
      strokeWidth: 1.5,
    },
  }));

  const connectors: ConnectorModel[] = [];

  for (const item of data) {
    if (item.parentId) {
      connectors.push({
        id: `${item.parentId}_${item.id}`,
        sourceID: item.parentId,
        targetID: item.id,
        type: 'Orthogonal',
        style: {
          strokeColor: '#64748B',
          strokeWidth: 1.4,
        },
        targetDecorator: {
          shape: 'Arrow',
          width: 8,
          height: 8,
          style: {
            fill: '#64748B',
            strokeColor: '#64748B',
          },
        },
      });
    }
  }

  // Extra cross-parent links to create complex hierarchical relationships.
  const extraPairs: Array<[number, number]> = [
    [2, 10],
    [3, 10],
    [4, 11],
    [6, 15],
    [8, 16],
    [9, 18],
    [12, 22],
    [14, 24],
    [17, 27],
    [20, 30],
    [23, 33],
  ];

  for (const [sourceIndex, targetIndex] of extraPairs) {
    const source = data[sourceIndex - 1];
    const target = data[targetIndex - 1];

    if (source && target) {
      connectors.push({
        id: `${source.id}_${target.id}_x`,
        sourceID: source.id,
        targetID: target.id,
        type: 'Orthogonal',
        style: {
          strokeColor: '#94A3B8',
          strokeWidth: 1.2,
        },
        targetDecorator: {
          shape: 'Arrow',
          width: 7,
          height: 7,
          style: {
            fill: '#94A3B8',
            strokeColor: '#94A3B8',
          },
        },
      });
    }
  }

  return { nodes, connectors };
}

// ----------------------------------------------------
// Native SVG "template" for OrgTpl mode
// ----------------------------------------------------
function createOrgTemplateSvg(item: HierarchyItem, showText: boolean): string {
  const fill = item.fill;
  const border = item.border;
  const name = escapeXml(item.name);
  const role = escapeXml(item.role);
  const dept = escapeXml(item.dept);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="84" viewBox="0 0 190 84">
      <rect x="1.5" y="1.5" width="187" height="81" rx="14" ry="14"
            fill="#FFFFFF" stroke="${border}" stroke-width="2"/>
      <rect x="1.5" y="1.5" width="56" height="81" rx="14" ry="14"
            fill="${fill}" stroke="${fill}" stroke-width="0"/>
      <circle cx="29" cy="28" r="12" fill="rgba(255,255,255,0.92)"/>
      <rect x="20" y="45" width="18" height="4" rx="2" fill="rgba(255,255,255,0.92)"/>
      <rect x="16" y="52" width="26" height="4" rx="2" fill="rgba(255,255,255,0.72)"/>
      <rect x="64" y="14" width="112" height="10" rx="5" fill="rgba(15,23,42,0.06)"/>
      ${
        showText
          ? `
      <text x="68" y="38" font-size="14" font-weight="700" fill="#0F172A">${name}</text>
      <text x="68" y="56" font-size="11" font-weight="600" fill="#64748B">${role}</text>
      <text x="68" y="70" font-size="10" font-weight="600" fill="#94A3B8">${dept}</text>
      `
          : ''
      }
    </svg>
  `;
}

export interface EmployeeInfo {
    Name: string;
    Designation: string;
    ImageUrl: string;
}

function safeText(value: unknown): string {
  return value == null ? '' : String(value);
}



// Funtion to add the Template of the Node.
function setNodeTemplate(obj: NodeModel): GroupableView {
  
  const data = (obj.data as HierarchyItem) || ({} as HierarchyItem);

  const fill = data.fill || '#46e59d';
  const border = data.border || '#4338CA';
  const name = safeText(data.name);
  const role = safeText(data.role);
  const dept = safeText(data.dept);

    // Create the outer container for the node content.
    let content: StackPanel = new StackPanel();
    content.id = obj.id + '_outerstack';
    content.orientation = 'Horizontal';
    content.style.fill = fill;
    content.style.strokeColor = border;
    content.cornerRadius = 10;
    content.padding = { left: 5, right: 10, top: 5, bottom: 5 };

    // Create an image element for the employee image.
    let image: ImageElement = new ImageElement();
    image.width = 50;
    image.height = 50;
    image.style.strokeColor = 'none';
    image.source = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYTLEmVabGuwlmnBGANqCNPLzw-qIYaRdYFGGLxgDihg&s=10';
    image.id = obj.id + '_pic';

    // Create an inner stack panel for text elements (name and designation).
    let innerStack: StackPanel = new StackPanel();
    innerStack.style.strokeColor = 'none';
    innerStack.margin = { left: 5, right: 0, top: 0, bottom: 0 };
    innerStack.id = obj.id + '_innerstack';
    innerStack.style.fill = fill;

    // Create a text element for the employee name.
    let text: TextElement = new TextElement();
    text.content = name;
    text.style.color = 'white';
   
    text.style.bold = true;
    text.horizontalAlignment = 'Left';
    text.id = obj.id + '_text1';

    // Create a text element for the employee designation.
    let desigText: TextElement = new TextElement();
    desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
    desigText.content = dept;
    desigText.style.color = 'white';
    desigText.style.strokeColor = 'none';
    desigText.style.fontSize = 12;
    desigText.horizontalAlignment = 'Left';
    desigText.style.textWrapping = 'Wrap';
    desigText.id = obj.id + '_desig';
    innerStack.children = [text, desigText];

    content.children = [image, innerStack];

    return content;
}

// ----------------------------------------------------
// Diagram lifecycle
// ----------------------------------------------------
function destroyDiagram(): void {
  if (diagram) {
    diagram.destroy();
    diagram = null;
  }

  const host = document.getElementById('diagramHost') as HTMLDivElement;
  host.innerHTML = `<div id="diagram"></div>`;
}

function ensureDiagram(): Diagram {
  if (!diagram) {
    throw new Error(
      'Diagram is not initialized. Click Init or a layout button first.'
    );
  }

  return diagram;
}

function wireDiagramEvents(instance: Diagram): void {
  instance.positionChange = (args: any) => {
    handleInteractionEvent('positionChange', args);
  };

  instance.sizeChange = (args: any) => {
    handleInteractionEvent('sizeChange', args);
  };

  instance.rotateChange = (args: any) => {
    handleInteractionEvent('rotateChange', args);
  };
}

function handleInteractionEvent(
  eventName: 'positionChange' | 'sizeChange' | 'rotateChange',
  args: any
): void {
  const objectId =
    args?.source?.id ||
    args?.element?.id ||
    args?.newValue?.id ||
    args?.oldValue?.id ||
    'unknown';

  if (args?.state === 'Start') {
    eventStartTimes[eventName] = performance.now();
    appendLog(`${eventName} | Start | object=${objectId}`, 'info');
    return;
  }

  if (args?.state === 'Completed') {
    const startedAt = eventStartTimes[eventName];
    const duration = startedAt != null ? performance.now() - startedAt : 0;
    appendLog(
      `${eventName} | Completed | object=${objectId} | <strong style="font-size:17px">duration=${(duration).toFixed(2)} ms</strong>`,
      'success'
    );
    eventStartTimes[eventName] = null;
  }
}

function finalizeRender(
  mode: RenderMode,
  renderLabel: string,
  extraInfo = ''
): void {
  requestAnimationFrame(() => {
    const end = performance.now();
    const total = end - pendingRenderStart;

    if (diagram) {
      diagram.fitToPage({ mode: 'Width' });
    }

    appendLog(
      `<strong style="font-size:17px">${renderLabel}</strong> completed | mode=${mode}${
        extraInfo ? ` | ${extraInfo}` : ''
      } | render <strong style="font-size:17px">time=${(total).toFixed(2)} ms</strong>`,
      'success'
    );
    setStatus('Diagram ready');
  });
}

// ----------------------------------------------------
// Diagram rendering
// ----------------------------------------------------
function createBaseDiagram(props: Partial<Diagram>): void {
  destroyDiagram();
  pendingRenderStart = performance.now();

  diagram = new Diagram({
    width: '100%',
    height: '100%',
    snapSettings: { constraints: SnapConstraints.None },
    ...props,
  });

  wireDiagramEvents(diagram);
  diagram.appendTo('#diagram');
}

function renderInitialLoad(): void {
  currentMode = 'init';
  setModeLabel(currentMode);

  const nodeCount = getNodeCount();
  let connectorCount = getConnectorCount();
  if (connectorCount > nodeCount) {
    connectorCount = nodeCount;
  }

  setStatus('Rendering Init diagram...');
  setLastAction(`Init (${nodeCount} nodes / ${connectorCount} connectors)`);

  const data = createLinearData(nodeCount, connectorCount);

  createBaseDiagram({
    nodes: data.nodes,
    connectors: data.connectors,
    created: () =>
      finalizeRender(
        'init',
        'Initial render',
        `nodes=${nodeCount} | connectors=${connectorCount}`
      ),
  });

  appendLog(
    `Init requested | nodes=${nodeCount} | connectors=${connectorCount} | annotations=${shouldShowAnnotations()}`,
    'info'
  );
}

function renderHierarchyLayout(): void {
  currentMode = 'htree';
  setModeLabel(currentMode);

  const hierarchyCount = getNodeCount();
  const data = createHierarchyData(hierarchyCount);

  setStatus('Rendering Hierarchical Tree...');
  setLastAction(`HTree (${data.length} items)`);

  createBaseDiagram({
    layout: {
      type: 'HierarchicalTree',
      orientation: 'TopToBottom',
      horizontalSpacing: 60,
      verticalSpacing: 60,
    },
    dataSourceSettings: {
      id: 'id',
      parentId: 'parentId',
      dataManager: new DataManager(data),
      doBinding: (nodeModel: NodeModel, item: any) => {
        const entry = item as HierarchyItem;
        nodeModel.id = entry.id;
        nodeModel.width = 96;
        nodeModel.height = 44;
        nodeModel.shape = { type: 'Basic', shape: 'Rectangle' } as any;
        nodeModel.style = {
          fill: entry.fill,
          strokeColor: entry.border,
          strokeWidth: 1.5,
        };
        nodeModel.annotations = shouldShowAnnotations()
          ? getShapeAnnotation(entry.name)
          : [];
      },
    },
    getConnectorDefaults: (connector: ConnectorModel) => {
      connector.type = 'Orthogonal';
      connector.style = {
        strokeColor: '#64748B',
        strokeWidth: 1.35,
      };
      connector.targetDecorator = {
        shape: 'Arrow',
        width: 8,
        height: 8,
        style: {
          fill: '#64748B',
          strokeColor: '#64748B',
        },
      };
      return connector;
    },
    dataLoaded: () => {
      appendLog(`HTree data loaded | records=${data.length}`, 'info');
    },
    created: () =>
      finalizeRender(
        'htree',
        'Hierarchical Tree render',
        `records=${data.length}`
      ),
  });

  appendLog(
    `HTree requested | records=${
      data.length
    } | annotations=${shouldShowAnnotations()}`,
    'info'
  );
}

function renderOrgChart(): void {
  currentMode = 'org';
  setModeLabel(currentMode);

  const hierarchyCount = getNodeCount();
  const data = createHierarchyData(hierarchyCount);

  setStatus('Rendering Organizational Chart...');
  setLastAction(`Org (${data.length} items)`);

  createBaseDiagram({
    layout: {
      type: 'OrganizationalChart',
      horizontalSpacing: 60,
      verticalSpacing: 60,
    },
    dataSourceSettings: {
      id: 'id',
      parentId: 'parentId',
      dataManager: new DataManager(data),
      doBinding: (nodeModel: NodeModel, item: any) => {
        const entry = item as HierarchyItem;
        nodeModel.id = entry.id;
        nodeModel.width = 116;
        nodeModel.height = 50;
        nodeModel.shape = { type: 'Basic', shape: 'Rectangle' } as any;
        nodeModel.style = {
          fill: entry.fill,
          strokeColor: entry.border,
          strokeWidth: 1.5,
        };
        nodeModel.annotations = shouldShowAnnotations()
          ? getShapeAnnotation(`${entry.role}`)
          : [];
      },
    },
    getConnectorDefaults: (connector: ConnectorModel) => {
      connector.type = 'Orthogonal';
      connector.style = {
        strokeColor: '#64748B',
        strokeWidth: 1.35,
      };
      connector.targetDecorator = {
        shape: 'Arrow',
        width: 8,
        height: 8,
        style: {
          fill: '#64748B',
          strokeColor: '#64748B',
        },
      };
      return connector;
    },
    dataLoaded: () => {
      appendLog(`Org data loaded | records=${data.length}`, 'info');
    },
    created: () =>
      finalizeRender(
        'org',
        'Organizational Chart render',
        `records=${data.length}`
      ),
  });

  appendLog(
    `Org requested | records=${
      data.length
    } | annotations=${shouldShowAnnotations()}`,
    'info'
  );
}

function renderMindMap(): void {
  currentMode = 'mind';
  setModeLabel(currentMode);

  const hierarchyCount = getNodeCount();
  const data = createHierarchyData(hierarchyCount);

  setStatus('Rendering Mind Map...');
  setLastAction(`Mind (${data.length} items)`);

  createBaseDiagram({
    layout: {
      type: 'MindMap',
      orientation: 'Horizontal',
      horizontalSpacing: 60,
      verticalSpacing: 60,
      getBranch: (obj: NodeModel) => {
        // Split first-level children left/right for a clear mind-map look.
        const idValue = String(obj.id || '');
        const numberValue = parseInt(idValue.replace(/[^\d]/g, ''), 10);
        return numberValue % 2 === 0 ? 'Left' : 'Right';
      },
    } as any,
    dataSourceSettings: {
      id: 'id',
      parentId: 'parentId',
      root: data[0].id,
      dataManager: new DataManager(data),
      doBinding: (nodeModel: NodeModel, item: any) => {
        const entry = item as HierarchyItem;
        nodeModel.id = entry.id;
        nodeModel.width = entry.level === 0 ? 140 : 104;
        nodeModel.height = entry.level === 0 ? 56 : 44;
        nodeModel.shape = { type: 'Basic', shape: 'Rectangle' } as any;
        nodeModel.style = {
          fill: entry.level === 0 ? '#111827' : entry.fill,
          strokeColor: entry.level === 0 ? '#111827' : entry.border,
          strokeWidth: 1.5,
        };
        nodeModel.annotations = shouldShowAnnotations()
          ? getShapeAnnotation(entry.level === 0 ? 'Central Topic' : entry.name)
          : [];
      },
    },
    getConnectorDefaults: (connector: ConnectorModel) => {
      connector.type = 'Orthogonal';
      connector.style = {
        strokeColor: '#64748B',
        strokeWidth: 1.35,
      };
      connector.targetDecorator = {
        shape: 'Arrow',
        width: 7,
        height: 7,
        style: {
          fill: '#64748B',
          strokeColor: '#64748B',
        },
      };
      return connector;
    },
    dataLoaded: () => {
      appendLog(`Mind data loaded | records=${data.length}`, 'info');
    },
    created: () =>
      finalizeRender('mind', 'Mind Map render', `records=${data.length}`),
  });

  appendLog(
    `Mind requested | records=${
      data.length
    } | annotations=${shouldShowAnnotations()}`,
    'info'
  );
}

function renderOrgTemplate(): void {
  currentMode = 'orgtpl';
  setModeLabel(currentMode);

  const hierarchyCount = getNodeCount();
  const data = createHierarchyData(hierarchyCount);
  const showText = shouldShowAnnotations();

  setStatus('Rendering Org Template...');
  setLastAction(`OrgTpl (${data.length} items)`);

  createBaseDiagram({
    layout: {
      type: 'OrganizationalChart',
      horizontalSpacing: 30,
      verticalSpacing: 55,
    },
    setNodeTemplate: setNodeTemplate,
    dataSourceSettings: {
      id: 'id',
      parentId: 'parentId',
      dataManager: new DataManager(data),
      doBinding: (nodeModel: NodeModel, item: any) => {
        const entry = item as HierarchyItem;
        nodeModel.id = entry.id;
        nodeModel.width = 190;
        nodeModel.height = 84;
        nodeModel.style = {
          fill: 'transparent',
          strokeColor: 'transparent',
          strokeWidth: 0,
        };
        nodeModel.annotations = [];
      },
    },
    getConnectorDefaults: (connector: ConnectorModel) => {
      connector.type = 'Orthogonal';
      connector.style = {
        strokeColor: '#94A3B8',
        strokeWidth: 1.3,
      };
      connector.targetDecorator = {
        shape: 'Arrow',
        width: 7,
        height: 7,
        style: {
          fill: '#94A3B8',
          strokeColor: '#94A3B8',
        },
      };
      return connector;
    },
    dataLoaded: () => {
      appendLog(`OrgTpl data loaded | records=${data.length}`, 'info');
    },
    created: () =>
      finalizeRender('orgtpl', 'Org template render', `records=${data.length}`),
  });

  appendLog(
    `OrgTpl requested | records=${data.length} | templateText=${showText}`,
    'info'
  );
}

function renderComplexTree(): void {
  currentMode = 'ctree';
  setModeLabel(currentMode);

  const hierarchyCount = getNodeCount();
  const data = createHierarchyData(hierarchyCount,true);
  const complexGraph = createComplexGraphFromHierarchy(data);

  setStatus('Rendering Complex Tree...');
  setLastAction(`CTree (${complexGraph.nodes.length} nodes)`);

  createBaseDiagram({
    // nodes: complexGraph.nodes,
    // connectors: complexGraph.connectors,
     dataSourceSettings: {
      id: 'id',
      parentId: 'parentIds',
      dataSource: new DataManager(data),
       doBinding: (nodeModel: NodeModel, item: any) => {
        const entry = item as HierarchyItem;
        nodeModel.id = entry.id;
        nodeModel.width = 116;
        nodeModel.height = 50;
        nodeModel.shape = { type: 'Basic', shape: 'Rectangle' } as any;
        nodeModel.style = {
          fill: entry.fill,
          strokeColor: entry.border,
          strokeWidth: 1.5,
        };
        nodeModel.annotations = shouldShowAnnotations()
          ? getShapeAnnotation(`${entry.role}`)
          : [];
      },
     },
    layout: {
      type: 'ComplexHierarchicalTree',
      orientation: 'TopToBottom',
      horizontalSpacing: 60,
      enableRouting:true,
      connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
      verticalSpacing: 60,
      horizontalAlignment: 'Center',
      verticalAlignment: 'Top',
    } as LayoutModel,
      getConnectorDefaults: (connector: ConnectorModel) => {
      connector.type = 'Orthogonal';
      connector.style = {
        strokeColor: '#94A3B8',
        strokeWidth: 1.3,
      };
      connector.targetDecorator = {
        shape: 'Arrow',
        width: 7,
        height: 7,
        style: {
          fill: '#94A3B8',
          strokeColor: '#94A3B8',
        },
      };
      return connector;
    },
    created: () =>
      finalizeRender(
        'ctree',
        'Complex Hierarchical Tree render',
        `nodes=${complexGraph.nodes.length} | connectors=${complexGraph.connectors.length}`
      ),
  });

  appendLog(
    `CTree requested | nodes=${complexGraph.nodes.length} | connectors=${
      complexGraph.connectors.length
    } | annotations=${shouldShowAnnotations()}`,
    'info'
  );
}

function renderCurrentMode(): void {
  switch (currentMode) {
    case 'init':
      renderInitialLoad();
      break;
    case 'con':
      renderOnlyOneConnector();
      break;
    case 'htree':
      renderHierarchyLayout();
      break;
    case 'ctree':
      renderComplexTree();
      break;
    case 'org':
      renderOrgChart();
      break;
    case 'mind':
      renderMindMap();
      break;
    case 'orgtpl':
      renderOrgTemplate();
      break;
  }
}

// ----------------------------------------------------
// DOM selection helpers for interaction tests
// ----------------------------------------------------
function getRootInteractiveElement(): HTMLElement {
  const d = ensureDiagram();
  return (d.element.querySelector('svg') as unknown as  HTMLElement) || d.element;
}

function getElementCenter(el: Element): { x: number; y: number } {
  const rect = (el as HTMLElement).getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function findNodeVisualElement(nodeId: string): Element | null {
  const d = ensureDiagram();
  const root = d.element;

  const candidates = [
    `#${CSS.escape(nodeId)}_groupElement`,
    `#${CSS.escape(nodeId)}_shape`,
    `[id="${nodeId}"]`,
    `[id^="${nodeId}_"]`,
    `[id*="${nodeId}"]`,
  ];

  for (const selector of candidates) {
    const found = root.querySelector(selector);
    if (found) {
      return found;
    }
  }

  return null;
}


function getRotateHandleElement(): Element | null {
  return document.querySelector('.e-diagram-rotate-handle');
}

function getEndpointHandleElement(preferTarget = true): Element | null {
  const handles = Array.from(
    document.querySelectorAll('.e-diagram-endpoint-handle')
  );
  if (!handles.length) return null;
  return preferTarget ? handles[handles.length - 1] : handles[0];
}

// ----------------------------------------------------
// Interaction benchmark actions
// ----------------------------------------------------

type Point = {
  x: number;
  y: number;
};

async function runDragTest(): Promise<void> {
  const d: Diagram = ensureDiagram();

  setStatus('Running drag test...');
  setLastAction('Drag');
  appendLog('Drag test started.', 'info');

  if (!d.nodes.length) {
    appendLog('Drag test failed: no nodes found.', 'error');
    setStatus('Drag test failed');
    return;
  }

  const testNode = d.nodes[0] as NodeModel;
  const nodeBounds: any = document.getElementById(testNode.id+'_groupElement')?.getBoundingClientRect();
  // Node center position
  const from: Point = {
    x: Number(nodeBounds.x + (nodeBounds.width/2)),
    y: Number(nodeBounds.y + (nodeBounds.height/2)),
  };

  // Drag 100px right and 100px bottom
  const to: Point = {
    x: from.x + 100,
    y: from.y + 100
  };

  const diagramCanvas = document.getElementById(`${d.element.id}content`);
  if (!diagramCanvas) {
    appendLog('Drag test failed: diagram canvas not found.', 'error');
    setStatus('Drag test failed');
    return;
  }

  const steps = 10;
  const stepX = (to.x - from.x) / steps;
  const stepY = (to.y - from.y) / steps;

  const start = performance.now();

  // Start drag
  mouseEvents.mouseDownEvent(diagramCanvas, from.x, from.y);

  // Move gradually to bottom-right
  for (let i = 1; i <= steps; i++) {
    const currentX = from.x + stepX * i;
    const currentY = from.y + stepY * i;

    mouseEvents.mouseMoveEvent(diagramCanvas, currentX, currentY);
    // await delay(0);
  }

  // End drag
  mouseEvents.mouseUpEvent(diagramCanvas, to.x, to.y);

  const end = performance.now();

  appendLog(
    `Drag completed | from=(${from.x}, ${from.y}) to=(${to.x}, ${to.y}) | <strong style="font-size:17px">total=${(end - start).toFixed(2)} ms</strong>`,
    'success'
  );
  setStatus('Drag test completed');
}


async function runResizeTest(): Promise<void> {
  const d = ensureDiagram();
  setStatus('Running resize test...');
  setLastAction('Resize');
  appendLog('Resize test started.', 'info');

  if (!d.nodes.length) {
    appendLog('Resize test failed: no nodes found.', 'error');
    setStatus('Resize test failed');
    return;
  }

  const testNode = d.nodes[0];
  d.select([testNode]);

  const resizeHandle: HTMLElement = document.getElementById('resizeNorth') as HTMLElement;
  const resizeNorthBounds = resizeHandle.getBoundingClientRect();
  const from: Point = {x:resizeNorthBounds.x + (resizeNorthBounds.width /2), y: resizeNorthBounds.y + (resizeNorthBounds.height/2)} as Point;
  const to: Point = {
    x: from.x,
    y: from.y + 100
  };
  if (!resizeHandle) {
    appendLog(
      'Resize test failed: resize handle not found. Selectable node required.',
      'error'
    );
    setStatus('Resize test failed');
    return;
  }


  const steps = 10;
  const stepX = (to.x - from.x) / steps;
  const stepY = (to.y - from.y) / steps;
  const diagramCanvas: HTMLElement = document.getElementById(`${d.element.id}content`) as HTMLElement;
  const start = performance.now();

  // Start resize
  mouseEvents.mouseDownEvent(diagramCanvas, from.x, from.y);

  // Move gradually to bottom-right
  for (let i = 1; i <= steps; i++) {
    const currentX = from.x + stepX * i;
    const currentY = from.y + stepY * i;

    mouseEvents.mouseMoveEvent(diagramCanvas, currentX, currentY);
    // await delay(0);
  }

  // End drag
  mouseEvents.mouseUpEvent(diagramCanvas, to.x, to.y);

  const end = performance.now();

  appendLog(
    `Resize button action finished | <strong style="font-size:17px">total=${(end - start).toFixed(2)} ms</strong>`,
    'success'
  );
  setStatus('Resize test completed');
}

async function runRotateTest(): Promise<void> {
  const d = ensureDiagram();
  setStatus('Running rotate test...');
  setLastAction('Rotate');
  appendLog('Rotate test started.', 'info');

  if (!d.nodes.length) {
    appendLog('Rotate test failed: no nodes found.', 'error');
    setStatus('Rotate test failed');
    return;
  }

  const testNode = d.nodes[0];
  

  const rotateHandle: HTMLElement = document.getElementById('rotateThumb') as HTMLElement;
  const rotateBounds = rotateHandle.getBoundingClientRect();
  const from: Point = {x:rotateBounds.x + (rotateBounds.width /2), y: rotateBounds.y + (rotateBounds.height/2)} as Point;
  const to: Point = {
    x: from.x + 100,
    y: from.y + 100
  };
  if (!rotateHandle) {
    appendLog(
      'Rotate test failed: rotate handle not found. Selectable node required.',
      'error'
    );
    setStatus('Rotate test failed');
    return;
  }


  const steps = 10;
  const stepX = (to.x - from.x) / steps;
  const stepY = (to.y - from.y) / steps;
  const diagramCanvas: HTMLElement = document.getElementById(`${d.element.id}content`) as HTMLElement;
  const start = performance.now();

  // Start resize
  mouseEvents.mouseDownEvent(diagramCanvas, from.x, from.y);

  // Move gradually to bottom-right
  for (let i = 1; i <= steps; i++) {
    const currentX = from.x + stepX * i;
    const currentY = from.y + stepY * i;

    mouseEvents.mouseMoveEvent(diagramCanvas, currentX, currentY);
    // await delay(0);
  }

  // End drag
  mouseEvents.mouseUpEvent(diagramCanvas, to.x, to.y);

  const end = performance.now();



  appendLog(
    `Rotate button action finished | <strong style="font-size:17px">total=${(end - start).toFixed(2)} ms</strong>`,
    'success'
  );
  setStatus('Rotate test completed');
}

async function runConnectorDragTest(): Promise<void> {
  const d = ensureDiagram();
  setStatus('Running connector endpoint drag test...');
  setLastAction('EndDrag');
  appendLog('Connector endpoint drag test started.', 'info');

  if (!d.connectors.length) {
    appendLog('Connector drag test failed: no connectors available.', 'error');
    setStatus('Connector drag failed');
    return;
  }

  const connector = d.connectors[0];
  d.select([connector]);
  
  const endpointHandle: HTMLElement = document.getElementById('connectorSourceThumb') as HTMLElement;
  const endPointBounds = endpointHandle.getBoundingClientRect();
  const from: Point = {x:endPointBounds.x + (endPointBounds.width /2), y: endPointBounds.y + (endPointBounds.height/2)} as Point;
  const to: Point = {
    x: from.x + 100,
    y: from.y + 100
  };
  if (!endpointHandle) {
    appendLog(
      'Connector drag test failed: endpoint handle not found.',
      'error'
    );
    setStatus('Connector drag failed');
    return;
  }


  const steps = 10;
  const stepX = (to.x - from.x) / steps;
  const stepY = (to.y - from.y) / steps;
  const diagramCanvas: HTMLElement = document.getElementById(`${d.element.id}content`) as HTMLElement;
  const start = performance.now();

  // Start resize
  mouseEvents.mouseDownEvent(diagramCanvas, from.x, from.y);

  // Move gradually to bottom-right
  for (let i = 1; i <= steps; i++) {
    const currentX = from.x + stepX * i;
    const currentY = from.y + stepY * i;

    mouseEvents.mouseMoveEvent(diagramCanvas, currentX, currentY);
    // await delay(0);
  }

  // End drag
  mouseEvents.mouseUpEvent(diagramCanvas, to.x, to.y);

  const end = performance.now();


  appendLog(
    `EndDrag button action finished | <strong style="font-size:17px">total=${(end - start).toFixed(2)} ms</strong>`,
    'success'
  );
  setStatus('Connector endpoint drag test completed');
}

// ----------------------------------------------------
// Event wiring
// ----------------------------------------------------

type ConnectorType = 'Straight' | 'Orthogonal' | 'Bezier';

/**
 * Select the first N nodes in the diagram.
 * If you want random nodes instead, I added that version below.
 */
function selectNodes(count: number): void {
  if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
    return;
  }

  const take = Math.min(count, diagram.nodes.length);
  const nodesToSelect = diagram.nodes.slice(0, take);

  diagram.clearSelection();
  diagram.select(nodesToSelect);
}


/**
 * Keep only one connector in the diagram.
 * This permanently removes the others from the current diagram instance.
 * If you instead want hide/show behavior, I can give that version too.
 */
function renderOnlyOneConnector(): void {
 currentMode = 'con';
  setModeLabel(currentMode);

  setStatus('Rendering Only One Connector...');
  setLastAction(`1 Connector`);

  createBaseDiagram({
    connectors:[{sourcePoint:{x:100, y:200}, targetPoint:{x:300, y:250}}],
    created: () =>
      finalizeRender(
        'con',
        'Connector render',
        `records=1`
      ),
  });

  appendLog(
    `Connector requested | records=1`,
    'info'
  );
}

/**
 * Change all existing connector types.
 * For best consistency, segment types are also aligned with connector type.
 */
function changeConnectorType(type: ConnectorType): void {
  if (!diagram || !diagram.connectors || diagram.connectors.length === 0) {
    return;
  }

  diagram.connectors.forEach((connector) => {
    connector.type = type;
  });

  diagram.dataBind();
}

// ----------------------------------------------------
// Event handlers
// ----------------------------------------------------
btnSelect10.addEventListener('click', () => {
  // Select first 10 nodes
  selectNodes(10);
});

btnSelect50.addEventListener('click', () => {
  // Select first 50 nodes
  selectNodes(50);

});

btnOneConnector.addEventListener('click', () => {
  // Render diagram with only one connector
    try {
    renderOnlyOneConnector();
  } catch (error) {
    appendLog(
      `Org error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('Org failed');
  }
});

connectorTypeSelect.addEventListener('change', (evt) => {
  const value = (evt.target as HTMLSelectElement).value as ConnectorType;

  if (value !== 'Straight' && value !== 'Orthogonal' && value !== 'Bezier') {
    return;
  }

  changeConnectorType(value);
});

btnInitialLoad.addEventListener('click', () => {
  try {
    renderInitialLoad();
  } catch (error) {
    appendLog(
      `Init error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('Init failed');
  }
});

btnHierarchy.addEventListener('click', () => {
  try {
    renderHierarchyLayout();
  } catch (error) {
    appendLog(
      `HTree error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('HTree failed');
  }
});

btnComplex.addEventListener('click', () => {
  try {
    renderComplexTree();
  } catch (error) {
    appendLog(
      `CTree error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('CTree failed');
  }
});

btnOrg.addEventListener('click', () => {
  try {
    renderOrgChart();
  } catch (error) {
    appendLog(
      `Org error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('Org failed');
  }
});

btnMind.addEventListener('click', () => {
  try {
    renderMindMap();
  } catch (error) {
    appendLog(
      `Mind error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('Mind failed');
  }
});

btnOrgTemplate.addEventListener('click', () => {
  try {
    renderOrgTemplate();
  } catch (error) {
    appendLog(
      `OrgTpl error: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
    setStatus('OrgTpl failed');
  }
});

btnDragTest.addEventListener('click', () => {
  runDragTest().catch((error) => {
    appendLog(
      `Drag test error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
    setStatus('Drag test failed');
  });
});

btnResizeTest.addEventListener('click', () => {
  runResizeTest().catch((error) => {
    appendLog(
      `Resize test error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
    setStatus('Resize test failed');
  });
});

btnRotateTest.addEventListener('click', () => {
  runRotateTest().catch((error) => {
    appendLog(
      `Rotate test error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
    setStatus('Rotate test failed');
  });
});

btnConnectorDragTest.addEventListener('click', () => {
  runConnectorDragTest().catch((error) => {
    appendLog(
      `Connector drag test error: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
    setStatus('Connector drag failed');
  });
});

btnClearLog.addEventListener('click', clearLog);

showAnnotationsInput.addEventListener('change', () => {
  appendLog(
    `Show annotations changed | value=${shouldShowAnnotations()} | rerendering current mode=${currentMode}`,
    'warn'
  );
  renderCurrentMode();
});

// ----------------------------------------------------
// Boot
// ----------------------------------------------------
clearLog();
appendLog('Performance test lab initialized.', 'success');
appendLog(
  'Use Init for linear node/connector render. Use HTree / CTree / Org / Mind / OrgTpl for layout scenarios.',
  'info'
);
appendLog(
  "Toggle 'Show node annotations' to render nodes with or without labels. The checkbox is checked by default.",
  'info'
);

setStatus('Ready');
setLastAction('None');
setModeLabel(currentMode);

// Optional:
// renderInitialLoad();
