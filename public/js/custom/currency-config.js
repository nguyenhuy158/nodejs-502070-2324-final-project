var VND = value => currency(value, {
    symbol: '₫',
    precision: 0,
    separator: ',',
    pattern: `# !`,
});