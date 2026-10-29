type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type ProductSpecificationTableProps = {
  rows: Cell[][];
  caption: string;
};

/** Renders extracted legacy specification values without changing their order or text. */
export function ProductSpecificationTable({ rows, caption }: ProductSpecificationTableProps) {
  return <div className="w-full overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left text-[13px]"><caption className="sr-only">{caption}</caption><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cell.type === 'th' ? <th className="border border-ink/15 bg-surface px-3 py-3 align-top font-bold text-white" key={cellIndex} colSpan={cell.colSpan} rowSpan={cell.rowSpan} scope="col">{cell.value}</th> : <td className="border border-ink/15 px-3 py-3 align-top text-ink" key={cellIndex} colSpan={cell.colSpan} rowSpan={cell.rowSpan}>{cell.value}</td>)}</tr>)}</tbody></table></div>;
}
