const colSpanMap = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
};

const rowSpanMap = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
  3: 'lg:row-span-3',
  4: 'lg:row-span-4',
};

export default function BentoCell({ span, interactive = false, compact = false, className = '', children }) {
  const classes = ['bento-cell'];

  if (interactive) classes.push('bento-cell-interactive');
  if (compact) classes.push('bento-cell-compact');

  if (span?.col && colSpanMap[span.col]) {
    classes.push(colSpanMap[span.col]);
  }

  if (span?.row && rowSpanMap[span.row]) {
    classes.push(rowSpanMap[span.row]);
  }

  if (className) classes.push(className);

  return <div className={classes.join(' ')}>{children}</div>;
}
