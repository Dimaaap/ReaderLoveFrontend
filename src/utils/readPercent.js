export const readPercent = (readPages, totalPages) => {
    const progress = totalPages > 0 
    ? Math.round((readPages / totalPages) * 100)
    : 0;

    return progress
}