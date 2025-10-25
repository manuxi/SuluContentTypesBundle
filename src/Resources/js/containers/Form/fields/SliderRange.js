// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {Input} from 'sulu-admin-bundle/components';
import type {FieldTypeProps} from 'sulu-admin-bundle/types';

const styles = {
    container: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
    },
    wrapper: {
        flex: 1,
        paddingTop: '8px',
        minWidth: 0,
    },
    sliderContainer: {
        position: 'relative',
        paddingBottom: '24px',
        paddingLeft: '0',
        paddingRight: '0',
    },
    input: {
        height: '2px',
        background: 'transparent',
        borderRadius: '1px',
        outline: 'none',
        WebkitAppearance: 'none',
        appearance: 'none',
        cursor: 'pointer',
        margin: '0 8px',
        width: 'calc(100% - 16px)',
    },
    labels: {
        position: 'relative',
        marginTop: '8px',
        height: '16px',
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    label: {
        fontSize: '12px',
        color: '#999',
        position: 'absolute',
        top: 0,
        whiteSpace: 'nowrap',
    },
    labelMin: {
        left: '0',
        transform: 'translateX(0)',
    },
    labelMax: {
        right: '0',
        transform: 'translateX(0)',
    },
    labelCurrent: {
        fontWeight: 600,
        color: '#112a46',
        transform: 'translateX(-50%)',
    },
    labelCurrentFloating: {
        fontWeight: 600,
        color: '#112a46',
        position: 'absolute',
        bottom: '100%',
        marginBottom: '4px',
        transform: 'translateX(-50%)',
        backgroundColor: '#112a46',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        transition: 'left 0.1s ease-out',
    },
    labelCurrentBelow: {
        fontWeight: 600,
        color: '#112a46',
        textAlign: 'center',
        marginTop: '8px',
        fontSize: '14px',
    },
    value: {
        width: '100px',
        flexShrink: 0,
    },
};

// CSS for range input thumb - Sulu style with #112a46 color
const rangeInputStyles = `
    .sulu-slider-range-input {
        position: relative;
        display: block;
    }
    
    .sulu-slider-range-input::-webkit-slider-runnable-track {
        width: 100%;
        height: 2px;
        background: #d8d8d8;
        border-radius: 1px;
    }
    
    .sulu-slider-range-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        margin-top: -7px;
        background: #112a46;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 1px 3px rgba(17, 42, 70, 0.3);
        transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .sulu-slider-range-input::-webkit-slider-thumb:hover {
        background: #0d1f33;
        box-shadow: 0 2px 4px rgba(17, 42, 70, 0.4);
    }
    
    .sulu-slider-range-input::-webkit-slider-thumb:active {
        background: #081426;
        box-shadow: 0 1px 2px rgba(17, 42, 70, 0.5);
    }
    
    .sulu-slider-range-input::-moz-range-track {
        width: 100%;
        height: 2px;
        background: #d8d8d8;
        border-radius: 1px;
        border: none;
    }
    
    .sulu-slider-range-input::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #112a46;
        cursor: pointer;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 1px 3px rgba(17, 42, 70, 0.3);
        transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .sulu-slider-range-input::-moz-range-thumb:hover {
        background: #0d1f33;
        box-shadow: 0 2px 4px rgba(17, 42, 70, 0.4);
    }
    
    .sulu-slider-range-input::-moz-range-thumb:active {
        background: #081426;
        box-shadow: 0 1px 2px rgba(17, 42, 70, 0.5);
    }
    
    .sulu-slider-range-input::-moz-focus-outer {
        border: 0;
    }
`;

@observer
class SliderRange extends React.Component<FieldTypeProps<number>> {
    componentDidMount() {
        if (!document.getElementById('sulu-slider-range-styles')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'sulu-slider-range-styles';
            styleTag.textContent = rangeInputStyles;
            document.head.appendChild(styleTag);
        }
    }

    handleSliderChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const {onChange} = this.props;
        const value = parseInt(event.target.value, 10);

        onChange(value);
    };

    handleInputChange = (value: ?string) => {
        const {onChange, onFinish} = this.props;
        const numValue = value ? parseInt(value, 10) : undefined;

        onChange(numValue);
        onFinish();
    };

    handleBlur = () => {
        this.props.onFinish();
    };

    calculateCurrentPosition = (value: number, min: number, max: number): string => {
        const percentage = ((value - min) / (max - min)) * 100;
        return `${percentage}%`;
    };

    render() {
        const {dataPath, error, value, schemaOptions, colSpan} = this.props;
        const min = schemaOptions?.min?.value || 0;
        const max = schemaOptions?.max?.value || 100;
        const step = schemaOptions?.step?.value || 1;
        const defaultValue = schemaOptions?.default_value?.value;

        // Display mode: 'input' (default), 'floating', 'inline', 'below', 'none'
        const displayMode = schemaOptions?.display_mode?.value || 'input';

        // Show/hide min/max labels (default: true for all modes except 'none')
        const showLabelsParam = schemaOptions?.show_labels?.value;
        const showLabels = showLabelsParam !== undefined ? showLabelsParam : (displayMode !== 'none');

        const currentValue = value !== undefined && value !== null ? value : defaultValue || min;

        // Show input field only in 'input' mode
        const showInput = displayMode === 'input';

        // Calculate position for current value label
        const currentPosition = this.calculateCurrentPosition(currentValue, min, max);

        // Calculate text widths for better positioning (approximation)
        const minLength = String(min).length;
        const maxLength = String(max).length;

        return (
            <div style={styles.container}>
                <div style={styles.wrapper}>
                    <div style={styles.sliderContainer}>
                        <input
                            type="range"
                            className="sulu-slider-range-input"
                            style={styles.input}
                            min={min}
                            max={max}
                            step={step}
                            value={currentValue}
                            onChange={this.handleSliderChange}
                            onMouseUp={this.handleBlur}
                            onTouchEnd={this.handleBlur}
                        />

                        {/* Floating label above thumb */}
                        {displayMode === 'floating' && (
                            <span
                                style={{
                                    ...styles.labelCurrentFloating,
                                    left: currentPosition,
                                }}
                            >
                                {currentValue}
                            </span>
                        )}

                        {/* Labels below slider */}
                        {showLabels && (
                            <div style={styles.labels}>
                                {/* Min label */}
                                <span style={{...styles.label, ...styles.labelMin}}>
                                    {min}
                                </span>

                                {/* Current value inline with min/max */}
                                {displayMode === 'inline' && (
                                    <span
                                        style={{
                                            ...styles.label,
                                            ...styles.labelCurrent,
                                            left: currentPosition,
                                        }}
                                    >
                                        {currentValue}
                                    </span>
                                )}

                                {/* Max label */}
                                <span style={{...styles.label, ...styles.labelMax}}>
                                    {max}
                                </span>
                            </div>
                        )}

                        {/* Current value centered below everything */}
                        {displayMode === 'below' && (
                            <div style={styles.labelCurrentBelow}>
                                {currentValue}
                            </div>
                        )}
                    </div>
                </div>

                {/* Input field (only in 'input' mode) */}
                {showInput && (
                    <div style={styles.value}>
                        <Input
                            id={dataPath}
                            type="number"
                            value={currentValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}
                            valid={!error}
                            min={min}
                            max={max}
                            step={step}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default SliderRange;