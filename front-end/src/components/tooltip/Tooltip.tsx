import React, { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    placement = 'top',
    delay = 50,
    className = ''
}) => {
    const [visible, setVisible] = useState(false);
    const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const childRef = useRef<HTMLDivElement | null>(null);

    const { styles, attributes } = usePopper(childRef.current, tooltipRef.current, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: { offset: [0, 8] },
            },
            {
                name: 'preventOverflow',
                options: {
                    padding: 8,
                },
            },
        ],
    });

    const showTooltip = () => {
        if (delayTimeout) clearTimeout(delayTimeout);
        setVisible(true);
    };

    const hideTooltip = () => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, delay);
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
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>

            {visible && (
                <div
                    ref={tooltipRef}
                    style={styles.popper}
                    {...attributes.popper}
                    className={`z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg 
                        transition-opacity duration-200 select-none ${className}`}
                    role="tooltip"
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
