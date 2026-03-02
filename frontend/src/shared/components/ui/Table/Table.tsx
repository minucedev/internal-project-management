import { Spinner } from '../Spinner';
import { twMerge } from 'tailwind-merge';

export interface Column<T> {
    key: string;
    title: string;
    render?: (record: T, index: number) => React.ReactNode;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    onRowClick?: (record: T) => void;
    rowKey: keyof T | ((record: T) => string);
    className?: string;
}

const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export const Table = <T extends Record<string, any>>({
    columns,
    data,
    loading = false,
    emptyText = 'Không có dữ liệu',
    onRowClick,
    rowKey,
    className,
}: TableProps<T>) => {
    const getRowKey = (record: T, index: number): string => {
        if (typeof rowKey === 'function') {
            return rowKey(record);
        }
        return String(record[rowKey] || index);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500">
                {emptyText}
            </div>
        );
    }

    return (
        <div className={twMerge('w-full overflow-x-auto', className)}>
            <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={twMerge(
                                    'px-6 py-4 text-sm font-semibold text-gray-700',
                                    alignClasses[column.align || 'left']
                                )}
                                style={{ width: column.width }}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((record, index) => {
                        const key = getRowKey(record, index);
                        const isClickable = !!onRowClick;

                        return (
                            <tr
                                key={key}
                                onClick={() => onRowClick?.(record)}
                                className={twMerge(
                                    'border-b border-gray-100 transition-colors duration-200',
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                    isClickable && 'cursor-pointer hover:bg-blue-50',
                                    'last:border-b-0'
                                )}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={twMerge(
                                            'px-6 py-4 text-sm text-gray-900',
                                            alignClasses[column.align || 'left']
                                        )}
                                    >
                                        {column.render
                                            ? column.render(record, index)
                                            : record[column.key]}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
