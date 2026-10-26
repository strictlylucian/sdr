export function createComparator(type: 'text' | 'number', compareText?: (left: string, right: string) => number) {
  return (left: string | number, right: string | number) => {
    if (type === 'number') {
      if (String(left).trim() === '' || String(right).trim() === '' || !Number.isFinite(Number(left)) || !Number.isFinite(Number(right))) throw new Error('SDR numeric sorting requires finite numeric values.');
      return Number(left) - Number(right);
    }
    const a = String(left).trim(), b = String(right).trim();
    return compareText ? compareText(a, b) : a < b ? -1 : a > b ? 1 : 0;
  };
}
