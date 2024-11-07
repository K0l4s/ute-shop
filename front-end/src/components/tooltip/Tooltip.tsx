import React, { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [visible, setVisible] = useState(false);
    const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const childRef = useRef<HTMLDivElement | null>(null);
    const { styles, attributes } = usePopper(childRef.current, tooltipRef.current, {
        placement: 'top',
        modifiers: [
            {
                name: 'offset',
                options: { offset: [0, 8] },
            },
        ],
    });

    const handleMouseEnter = () => {
        if (delayTimeout) clearTimeout(delayTimeout);
        setVisible(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, 50); // thêm 200ms delay khi ẩn
        setDelayTimeout(timeout);
    };

    useEffect(() => {
        return () => {
            if (delayTimeout) clearTimeout(delayTimeout);
        };
    }, [delayTimeout]);

    return (
        <div className="relative inline-block">
            <div
                ref={childRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>

            {visible && (
                <p
                    ref={tooltipRef}
                    style={styles.popper}
                    {...attributes.popper}
                    className="z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-200"
                >
                    {text}
                </p>
            )}
        </div>
    );
};

export default Tooltip;
