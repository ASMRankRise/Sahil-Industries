type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type ProductSpecificationTableProps = {
  rows: Cell[][];
  caption: string;
};

/** Renders extracted legacy specification values without changing their order or text. */
export function ProductSpecificationTable({ rows, caption }: ProductSpecificationTableProps) {
  return <div className="table-responsive"><table><caption className="sr-only">{caption}</caption><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cell.type === 'th' ? <th key={cellIndex} colSpan={cell.colSpan} rowSpan={cell.rowSpan} scope="col">{cell.value}</th> : <td key={cellIndex} colSpan={cell.colSpan} rowSpan={cell.rowSpan}>{cell.value}</td>)}</tr>)}</tbody></table></div>;
}
