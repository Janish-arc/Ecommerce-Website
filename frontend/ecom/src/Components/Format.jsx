
export const discount =  (MRP, price) => {
    // return Math.round((MRP - price) / (MRP)) * 100
    return Math.round(((MRP - price) / MRP) * 100);
}

export const formatDate = (inputDate) => {
    const date = new Date(inputDate)
    return date.toLocaleDateString("en-IN", {
        day:"2-digit",
        month:"short",
        year:"numeric"
       })
}