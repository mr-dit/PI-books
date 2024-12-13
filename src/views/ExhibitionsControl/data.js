export const inputs = [
    { key: 'name', label: 'Название выставки' },
    { key: 'startDate', label: 'Дата начала', type: 'date', maxDate: 'endDate' },
    { key: 'endDate', label: 'Дата окончания', type: 'date', minDate: 'startDate' }
]