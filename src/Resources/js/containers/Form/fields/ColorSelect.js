// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {SingleSelect} from 'sulu-admin-bundle/components';
import type {FieldTypeProps} from 'sulu-admin-bundle/types';
import {toJS} from 'mobx';

const styles = {
    colorSelectOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    colorSelectIndicator: {
        display: 'inline-block',
        width: '14px',
        height: '14px',
        borderRadius: '1px',
        border: '1px solid #ccc',
        flexShrink: 0,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
    },
    colorSelectLabel: {
        flex: 1,
    },
};

@observer
class ColorSelect extends React.Component<FieldTypeProps<string>> {
    handleChange = (value: string | number) => {
        const {onChange, onFinish} = this.props;

        onChange(value);
        onFinish();
    };

    render() {
        const {dataPath, error, value, schemaOptions} = this.props;
        const values: Array<any> = toJS(schemaOptions?.values?.value || []);

        const selectValues = values.map((item) => {
            // Get translatable title from metadata, fallback to name or value
            const displayName = item.title || item.name || item.value;

            const itemValue = item.value || key;
            const parts = itemValue.split(':');
            const name = parts[0];
            const color = parts[1] || '#000000';

            return {
                value: item.value,
                label: (
                    <div style={styles.colorSelectOption}>
                        <span
                            style={{
                                ...styles.colorSelectIndicator,
                                backgroundColor: color || '#ccc',
                            }}
                        />
                        <span style={styles.colorSelectLabel}>{displayName}</span>
                    </div>
                ),
            };
        });

        return (
            <SingleSelect
                id={dataPath}
                value={value}
                onChange={this.handleChange}
                valid={!error}
            >
                {selectValues.map((option) => (
                    <SingleSelect.Option key={option.value} value={option.value}>
                        {option.label}
                    </SingleSelect.Option>
                ))}
            </SingleSelect>
        );
    }
}

export default ColorSelect;